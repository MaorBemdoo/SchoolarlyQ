import mongoose from "mongoose"
import logger from "./logger"

const MONGODB_URI = process.env.MONGODB_URI

if(!MONGODB_URI){
    throw new Error("Please define the MONGODB_URI environment variable in .env.local")
}

let isConnected = false

const connectDB = async () => {
    if(isConnected){
        return
    }

    try{
        await mongoose.connect(MONGODB_URI)
        isConnected = true;
        logger.info("MongoDB Connected successfully");
    }catch(err){
        logger.error("Error connecting to MongoDB", err)
    }
}

export default  connectDB