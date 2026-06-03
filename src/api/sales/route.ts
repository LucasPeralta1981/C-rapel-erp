// src/api/sales/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// --- OBTENER TODOS LOS REGISTROS (GET) ---
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('ventas_db');
    const collection = db.collection('registros');

    const registros = await collection.find({}).sort({ fechaCreacion: -1 }).toArray();

    const registrosFormateados = registros.map((reg) => ({
      ...reg,
      id: reg._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(registrosFormateados, { status: 200 });
  } catch (error) {
    console.error('Error al obtener registros:', error);
    return NextResponse.json({ error: 'Error al obtener los registros' }, { status: 500 });
  }
}

// --- GUARDAR NUEVO REGISTRO (POST) ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clienteNombre, total, items, itemsCount, estado, tipoVenta } = body;

    if (!clienteNombre || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Datos inválidos: Falta cliente o ítems' }, { status: 400 });
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
    console.error('Error al guardar en MongoDB:', error);
    return NextResponse.json({ error: 'Error al guardar el registro' }, { status: 500 });
  }
}

// --- ACTUALIZAR ESTADO (PATCH) ---
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, estado } = body;

    if (!id || !estado) {
      return NextResponse.json({ error: 'ID y estado son requeridos' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ventas_db');
    const collection = db.collection('registros');

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: objectId },
      { $set: { estado, fechaActualizacion: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'No se encontró el registro' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

// --- ELIMINAR REGISTRO (DELETE) ---
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('ventas_db');
    const collection = db.collection('registros');

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'No se encontró el registro' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}