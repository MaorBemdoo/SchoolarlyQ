/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import bcrypt from "bcryptjs";
import { signIn } from "@/utils/auth";
import initLogger from "@/config/logger";
import { userService } from "@/services/user.service";
import ResponseHandler from "@/utils/ResponseHandler";

interface StepOneData {
  full_name: string;
  email: string;
  password: string;
  type?: "credentials" | "google";
}

interface StepTwoData {
  matric_number: string;
  department: string;
  level: string;
  email: string;
}

export async function registerUser(
  data: StepOneData | StepTwoData,
  step: 1 | 2 = 1
) {
  const logger = await initLogger();

  if (step === 1) {
    const { full_name, email, password, type = "credentials" } =
      data as StepOneData;

    if (type === "credentials") {
      if (!full_name || !email || !password) {
        return ResponseHandler("failed", "All fields are required");
      }

      const username = email.slice(0, email.indexOf("@"));
      const hashedPassword = await bcrypt.hash(password, 7);

      try {
        const newUser = await userService.createUser({
          full_name: full_name.trim(),
          username,
          email,
          password: hashedPassword,
        });

        await signIn("credentials", {
          usernameOrEmailOrMatric: username,
          password,
          redirect: false,
        });

        logger.info({ id: newUser._id }, "User created and signed in successfully");

        return ResponseHandler("success", "User created and signed in successfully");
      } catch (err: any) {
        logger.error(err, "Error Registering User");
        return ResponseHandler("failed", err.message || "Error registering user");
      }
    } else {
      await signIn("google");
      logger.info("User created and signed in successfully");
      return ResponseHandler("success", "User created and signed in successfully");
    }
  }

  const { matric_number, department, level, email } = data as StepTwoData;

  if (!matric_number || !department || !level || !email) {
    return ResponseHandler("failed", "Missing required fields");
    };

  const existingMatricNumber = await userService.getUserByMatricNumber(
    matric_number
  );
  if (existingMatricNumber) {
    return ResponseHandler("failed", "Hmmm... Are you sure that's your matric number");
  }

  try {
    const username = email.slice(0, email.indexOf("@"));
    await userService.updateUser(username, {
      matric_number,
      department,
      level,
    });

    return ResponseHandler("success", "User updated successfully");
  } catch (err: any) {
    logger.error(err, "Error Updating User");
    return ResponseHandler("failed", err.message || "Error updating user");
  }
}
