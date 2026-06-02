import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PDFDocument, StandardFonts } from '@react-pdf/renderer'; // Nota: En Next.js Serverless, a veces es mejor generar el buffer directamente
// Para simplificar en este entorno, usaremos una ruta que renderiza el PDF como buffer si se configurara, 
// pero dado que usamos @react-pdf/renderer en el cliente, haremos un truco:
// Devolvemos los datos y el frontend usa ReactPDF.renderToStream o similar.
// SIN EMBARGO, para que funcione directo en Next.js App Router sin complicaciones de servidor:
// Usaremos una estrategia de "Data URL" o redirigimos a una página de impresión.

// OPCIÓN SENCILLA Y ROBUSTA PARA PRODUCCIÓN RÁPIDA:
// Redirigimos a una página de visualización de PDF generada por el cliente.
// Pero si necesitas el PDF directo:
import { renderToStream } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/documents/InvoicePDF';

export async function GET(req: NextRequest, { params }: { params: { saleId: string } }) {
  const { saleId } = params;

  try {
    // 1. Obtener datos de la venta
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        client: true,
        items: { include: { product: true } }
      }
    });

    if (!sale) return NextResponse.json({ error: 'No found' }, { status: 404 });

    // 2. Preparar datos para el PDF
    const subtotal = sale.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const tax = subtotal * 0.21;
    const total = subtotal + tax;

    const data = {
      number: `R.A.P.E.L ${saleId.slice(0, 8)}`,
      date: new Date(sale.createdAt).toLocaleDateString('es-AR'),
      client: {
        name: sale.client.name,
        cuil: sale.client.cuil,
        address: sale.client.address,
        type: sale.client.type
      },
      items: sale.items.map(i => ({
        sku: i.product.sku,
        name: i.product.name,
        qty: i.quantity,
        price: Number(i.unitPrice),
        total: Number(i.subtotal)
      })),
      subtotal,
      tax,
      total,
      type: 'FACTURA'
    };

    // 3. Renderizar PDF como Stream
    const stream = await renderToStream(<InvoicePDF data={data} />);
    
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="factura-${saleId}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error generando PDF' }, { status: 500 });
  }
}