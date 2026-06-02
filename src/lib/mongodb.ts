// src/lib/mongodb.ts
// @ts-ignore: suppress missing module/types for environments without mongodb types installed
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // En modo desarrollo, usamos una variable global para evitar reconexiones en hot-reload
  let globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // En producción, creamos la conexión directamente
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
