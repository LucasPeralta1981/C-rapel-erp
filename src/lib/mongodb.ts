  import mongoose from 'mongoose';

    if (!process.env.MONGODB_URI) {
      throw new Error('Please add your Mongo URI to .env.local');
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    declare global {
      var mongoose: { conn: any; promise: any };
    }

    if (!global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }

    async function getDb() {
      if (global.mongoose.conn) {
        return global.mongoose.conn;
      }

      if (!global.mongoose.promise) {
        global.mongoose.promise = mongoose.connect(MONGODB_URI, {
          serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
          socketTimeoutMS: 45000,
        }).then((mongoose) => {
          return mongoose;
        });
      }

      global.mongoose.conn = await global.mongoose.promise;
      return global.mongoose.conn;
    }

    export default getDb;