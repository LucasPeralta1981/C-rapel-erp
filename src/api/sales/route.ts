import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// POST: crear nuevo registro de venta/presupuesto
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clienteNombre, total, items, itemsCount, estado, tipoVenta } = body;

    if (!clienteNombre || !items || items.length === 0) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ventas_db');
    const collection = db.collection('registros');

    const nuevoRegistro = {
      clienteNombre,
      total,
      items,
      itemsCount,
      estado,
      tipoVenta,
      fechaCreacion: new Date(),
    };

    const result = await collection.insertOne(nuevoRegistro);

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error al guardar:', error);
    return NextResponse.json({ error: 'Error al guardar el registro' }, { status: 500 });
  }
}

// GET: obtener registros ordenados por fecha (más reciente primero)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('ventas_db');
    const collection = db.collection('registros');

    const registros = await collection.find({}).sort({ fechaCreacion: -1 }).toArray();

    const registrosFormateados = registros.map((reg: any) => ({
      ...reg,
      id: reg._id?.toString(),
      _id: undefined,
    }));

    return NextResponse.json(registrosFormateados, { status: 200 });
  } catch (error) {
    console.error('Error al obtener registros:', error);
    return NextResponse.json({ error: 'Error al obtener los registros' }, { status: 500 });
  }
}