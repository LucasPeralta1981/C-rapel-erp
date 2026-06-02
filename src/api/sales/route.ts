import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientId, items, total, discount, paymentMethod } = body;

    if (!clientId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Datos de venta inválidos' }, { status: 400 });
    }

    // Generar número de factura (simple, en producción usaría un contador secuencial)
    const invoiceNumber = `F-${Date.now().toString().slice(-8)}`;
    const saleId = uuidv4();

    // Transacción: Crear venta y descontar stock
    const sale = await prisma.$transaction(async (tx) => {
      // 1. Crear ítems de venta
      const saleItems = await Promise.all(
        items.map(async (item: any) => {
          return tx.saleItem.create({
            data: {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal
            }
          });
        })
      );

      // 2. Descontar stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 3. Crear la venta
      return tx.sale.create({
        data: {
          id: saleId,
          clientId,
          total,
          discount: discount || 0,
          paymentMethod: paymentMethod || 'EFECTIVO',
          status: 'PAID',
          items: {
            create: saleItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal
            }))
          }
        },
        include: {
          client: true,
          items: {
            include: { product: true }
          }
        }
      });
    });

    // Retorna el ID de la venta en el header para que el frontend sepa qué imprimir
    const response = NextResponse.json({ success: true, saleId: sale.id, message: 'Venta procesada' });
    response.headers.set('sale-id', sale.id);
    return response;

  } catch (error) {
    console.error('Error en venta:', error);
    return NextResponse.json({ error: 'Error interno al procesar la venta' }, { status: 500 });
  }
}

// Ruta para obtener una venta específica y generar el PDF
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const saleId = searchParams.get('id');

  if (!saleId) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  try {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        client: true,
        items: {
          include: { product: true }
        }
      }
    });

    if (!sale) return NextResponse.json({ error: 'Venta no encontrada' }, { status: 404 });

    // Calcular totales para el PDF
    const subtotal = sale.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const tax = subtotal * 0.21; // 21% IVA
    const total = subtotal + tax;

    const pdfData = {
      number: `R.A.P.E.L ${sale.id.slice(0, 8)}`, // Número temporal
      date: new Date(sale.createdAt).toLocaleDateString('es-AR'),
      client: {
        name: sale.client.name,
        cuil: sale.client.cuil,
        address: sale.client.address,
        type: sale.client.type
      },
      items: sale.items.map((item: any) => ({
        sku: item.product.sku,
        name: item.product.name,
        qty: item.quantity,
        price: Number(item.unitPrice),
        total: Number(item.subtotal)
      })),
      subtotal,
      tax,
      total,
      type: sale.paymentMethod === 'EFECTIVO' ? 'FACTURA A' : 'FACTURA B'
    };

    return NextResponse.json(pdfData);
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo venta' }, { status: 500 });
  }
}