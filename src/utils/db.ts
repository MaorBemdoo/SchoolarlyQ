import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let isConnected: boolean = false;

export default async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(uri);

    isConnected = true;
  } catch {
    throw new Error("Could not connect to MongoDB");
  }
}
