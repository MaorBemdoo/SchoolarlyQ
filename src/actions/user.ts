"use server";

import initLogger from "@/config/logger";
import { userService } from "@/services/user.service";
import connectDB from "@/utils/db";
import ResponseHandler from "@/utils/ResponseHandler";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUser(id: string, data: any) {
  await connectDB();
  const logger = await initLogger();

  try {
    const user = await userService.updateUser(id, data);
    return ResponseHandler("success", "User updated successfully", user);
  } catch (error) {
    logger.error(error, "Error updating user");
    return ResponseHandler("failed", "Error updating user");
  }
}
