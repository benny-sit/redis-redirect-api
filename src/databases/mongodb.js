import { MongoClient } from 'mongodb';

if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI)
  throw new Error('MONGO_URI env must be set');

export const mongoClient = new MongoClient(
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/redis-redirect-api'
);
export const db = mongoClient.db();

export const configCollection = db.collection('config');
