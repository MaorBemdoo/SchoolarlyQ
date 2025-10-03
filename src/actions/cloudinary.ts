"use server"

import initLogger from "@/config/logger";
import ResponseHandler from "@/utils/ResponseHandler";
import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (file: File) => {
    const logger = await initLogger();
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      folder: "schoolarlyq/past-questions",
    };

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const res = await new Promise ((resolve, reject) => {
        cloudinary.uploader.upload_stream(options, function (error, result){
          if ( error ) {
            reject(error);
            throw error;
          }
          resolve(result);
        }).end(buffer);
      });
      return ResponseHandler("success", "Image uploaded successfully", res);
    } catch (error) {
        logger.error(error, "Error uploading image to Cloudinary");
        return ResponseHandler("failed", "Error uploading image");
    }
};