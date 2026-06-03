// src/lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI; // Asegúrate de que esta variable se cargue
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Por favor, agrega MONGODB_URI en el archivo .env');
}

if (process.env.NODE_ENV === 'development') {
  // Modo desarrollo: Reutilizar instancia para evitar múltiples conexiones
  if (!(global as any)._mongoClientPromise) {
    (global as any)._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // Modo producción: Conexión fresca cada vez
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db('rapel-erp'); // Asegúrate de que el nombre de la DB coincida
}