import connectDB from './config/database';
import { Service } from './models/service.model';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function run() {
  await connectDB();
  const res = await Service.updateMany({}, { $set: { capacity: 10 } });
  console.log(`Updated ${res.modifiedCount} services to capacity 10`);
  mongoose.disconnect();
}

run().catch(console.error);
