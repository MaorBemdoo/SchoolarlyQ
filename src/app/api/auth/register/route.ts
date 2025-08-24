import bcrypt from "bcryptjs";
import { signIn } from "@/utils/auth";
import { NextRequest } from "next/server";
import ResponseHandler from "@/utils/ResponseHandler";
import initLogger from "@/config/logger";
import { userService } from "@/services/user.service";
import { HttpStatusCode } from "axios";
import { getErrorMessage } from "@/utils/getErrorMessage";

export async function POST(req: NextRequest) {
  const {
    full_name,
    email,
    password,
    step = 1,
    type = "credentials",
    matric_number,
    department,
    level,
  } = await req.json();
  const logger = await initLogger();

  if (step == 1) {
    if (type == "credentials") {
      if (!full_name || !email || !password) {
        return ResponseHandler(HttpStatusCode.BadRequest, "Missing required fields");
      }

      const username = email.slice(0, email.indexOf("@"));
      const hashedPassword = await bcrypt.hash(password, 7);
      const user = {
        full_name: full_name.trim(),
        username,
        email,
        password: hashedPassword,
      };

      try {
        const newUser = await userService.createUser(user)

        await signIn("credentials", {
          usernameOrEmailOrMatric: username,
          password,
          redirect: false,
        });

        logger.info({id: newUser._id}, "User created and signed in successfully");
        return ResponseHandler(HttpStatusCode.Created, "User created and signed in successfully");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logger.error(err, "Error Registering User");
        return ResponseHandler(
          err?.code || HttpStatusCode.InternalServerError,
          getErrorMessage(err, "Error registering user"),
        );
      }
    } else {
      await signIn("google");
      logger.info("User created and signed in successfully");
      return ResponseHandler(HttpStatusCode.Created, "User created and signed in successfully");
    }
  } else {
    if (!matric_number || !department || !level || !email) {
      return ResponseHandler(HttpStatusCode.BadRequest, "Missing required fields");
    }

    const existingMatricNumber = await userService.getUserByMatricNumber(matric_number);
    if (existingMatricNumber) {
      return ResponseHandler(
        409,
        "Hmmm... Are you sure that's your matric number",
      );
    }

    try {
      const username = email.slice(0, email.indexOf("@"));
      await userService.updateUser(username,
        {
          matric_number,
          department,
          level,
        },
      );
      return ResponseHandler(HttpStatusCode.Ok, "User updated successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      logger.error(err, "Error Updating User");
      return ResponseHandler(
        err?.code || HttpStatusCode.InternalServerError,
        err?.message || "Error registering user",
      );
    }
  }
}
