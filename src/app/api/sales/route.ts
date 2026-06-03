import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // Asegúrate que esta ruta sea correcta
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    // 1. Conectar a la DB
    const client = await connectDB;
    const db = client.db();
    
    // 2. Obtener datos del cuerpo de la solicitud
    const body = await req.json();
    
    // Validaciones básicas
    if (!body.cliente || !body.productos || body.productos.length === 0) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios (cliente o productos)' },
        { status: 400 }
      );
    }

    // 3. Preparar el documento (calculando totales si es necesario)
    const nuevaVenta = {
      cliente: body.cliente,
      productos: body.productos.map((p: any) => ({
        productoId: p.productoId,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precioUnitario: p.precioUnitario,
        subtotal: p.cantidad * p.precioUnitario
      })),
      total: body.productos.reduce((acc: number, p: any) => acc + (p.cantidad * p.precioUnitario), 0),
      estado: 'Pendiente',
      fecha: new Date(),
      creadoEn: new Date()
    };

    // 4. Insertar en la colección 'ventas' (asegúrate que sea minúscula)
    const result = await db.collection('ventas').insertOne(nuevaVenta);

    return NextResponse.json({
      success: true,
      message: 'Venta guardada correctamente',
      id: result.insertedId
    });

  } catch (error: any) {
    // IMPRESCINDIBLE: Loguear el error en la terminal para que Lucas lo vea
    console.error('❌ Error detallado al guardar venta:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        detalle: error.message || 'Hubo un problema al procesar la venta'
      },
      { status: 500 }
    );
  }
}