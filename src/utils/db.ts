import initLogger from "@/config/logger";
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let isConnected: boolean = false;

export default async function connectDB() {
  const logger = await initLogger();
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(uri);

    isConnected = true;
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error(error, "Error connecting to MongoDB");
    throw new Error("Could not connect to MongoDB");
  }
}
