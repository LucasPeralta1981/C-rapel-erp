// src/lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('❌ Falta MONGODB_URI en el archivo .env');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Reutilizar conexión en desarrollo
  let globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().catch(err => {
      console.error('❌ Error de conexión a MongoDB:', err.message);
      throw err;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Conexión en producción
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    throw err;
  });
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db('ventas_db'); // El nombre de tu base de datos
}