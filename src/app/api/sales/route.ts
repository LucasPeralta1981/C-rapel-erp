import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// URL de conexión desde el archivo .env
const uri = process.env.MONGODB_URI || '';
const dbName = 'rapelerp'; // Asegúrate que este sea el nombre de tu DB

if (!uri) {
  throw new Error('Por favor define MONGODB_URI en tu archivo .env');
}

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

// Función auxiliar para conectar solo una vez
async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function POST(req: NextRequest) {
  try {
    console.log('🟢 Intentando conectar a MongoDB...');
    
    // 1. Conectar
    const { db } = await connectToDatabase();
    console.log('🟢 Conectado a MongoDB correctamente.');

    // 2. Leer el cuerpo de la solicitud
    const body = await req.json();
    console.log('📥 Datos recibidos:', body);

    // Validaciones básicas
    if (!body.cliente || !body.productos || !Array.isArray(body.productos) || body.productos.length === 0) {
      return NextResponse.json(
        { error: 'Datos inválidos. Se requiere "cliente" y al menos un "producto" en el array.' },
        { status: 400 }
      );
    }

    // 3. Procesar los productos (cálculo de totales)
    const productosParaGuardar = body.productos.map((p: any) => ({
      productoId: p.id || p.productoId, // Soporta ambos nombres
      nombre: p.nombre,
      cantidad: Number(p.cantidad),
      precioUnitario: Number(p.precioUnitario),
      subtotal: Number(p.cantidad) * Number(p.precioUnitario)
    }));

    const totalVenta = productosParaGuardar.reduce((acc: number, p: any) => acc + p.subtotal, 0);

    // 4. Crear el documento
    const nuevaVenta = {
      cliente: body.cliente,
      productos: productosParaGuardar,
      total: totalVenta,
      estado: 'Pendiente',
      fecha: new Date(),
      creadoEn: new Date()
    };

    console.log('💾 Insertando venta:', nuevaVenta);

    // 5. Guardar en la colección 'ventas'
    const result = await db.collection('ventas').insertOne(nuevaVenta);

    console.log('✅ Venta guardada con ID:', result.insertedId);

    return NextResponse.json({
      success: true,
      message: 'Venta guardada exitosamente',
      id: result.insertedId,
      total: totalVenta
    });

  } catch (error: any) {
    console.error('❌ ERROR DETALLADO en API /sales:', error);
    console.error('❌ Mensaje de error:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor', 
        detalle: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}