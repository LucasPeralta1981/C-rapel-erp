// src/app/test-mongodb/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔍 Probando conexión a MongoDB...');
    const client = await clientPromise;
    const db = client.db('ventas_db');
    await db.listCollections().toArray();
    
    return NextResponse.json({ success: true, message: '✅ Conexión exitosa a MongoDB' });
  } catch (error: any) {
    console.error('❌ Error de conexión:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}