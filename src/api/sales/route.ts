// src/app/sales/new/route.ts (TEMPORAL, SOLO PARA PROBAR)
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  console.log('🔥 Endpoint temporal llamado'); // Debug
  
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db('ventas_db');
    const collection = db.collection('registros');
    
    await collection.insertOne({
      ...body,
      fechaCreacion: new Date(),
    });
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}