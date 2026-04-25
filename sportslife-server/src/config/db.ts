import mongoose from 'mongoose';
import { env } from './env';

const clientOptions = {
  serverApi: { version: '1' as const, strict: true, deprecationErrors: true },
};

// DO NOT FORGET TO WHITELIST YOUR IP ADDRESS WITH MongoDB Atlas BEFORE LAUNCHING

export const connectToDatabase = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI, clientOptions);

  console.log('MongoDB connected');
};
