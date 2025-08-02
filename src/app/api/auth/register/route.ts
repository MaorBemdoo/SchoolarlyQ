import bcrypt from "bcryptjs";
import { signIn } from "@/utils/auth";
import { NextRequest } from "next/server";
import User from "@/models/User";
import connectDB from "@/utils/db";
import ResponseHandler from "@/utils/ResponseHandler";
import initLogger from "@/config/logger";

export async function POST(req: NextRequest) {
  const { full_name, email, password, step = 1, type = "credentials", matric_number, department, level } = await req.json();
  const logger = await initLogger()

  if(step == 1){
    if(type == "credentials"){
      if (!full_name || !email || !password) {
        return ResponseHandler(
          400,
          "Missing required fields",
        )
      }
    
      const username = email.slice(0, email.indexOf("@"))
    
      await connectDB();
    
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return ResponseHandler(
          409,
          "User with email already exist",
        );
      }
    
      const hashedPassword = await bcrypt.hash(password, 7);
      const user = new User({
        full_name,
        username,
        email,
        password: hashedPassword,
      });
    
      try {
        await user.save();
    
        await signIn("credentials", {
          usernameOrEmailOrMatric: username,
          password,
          redirect: false,
        });
    
        logger.info("User created and signed in successfully", {
          id: user._id,
        });
        return ResponseHandler(
          201,
          "User created and signed in successfully",
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logger.error(err, "Error Registering User");
        return ResponseHandler(
          err.cause.err.status || 500,
          err.cause.err.message,
        );
      }
    }else{
      try {
        const data = await signIn("google", { redirect: false })
        console.log(data)

        return ResponseHandler(
          201,
          "User created and signed in successfully"
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logger.error(err, "Error Registering User");
        return ResponseHandler(
          err.cause.err.status || 500,
          err.cause.err.message,
        );
      }
    }
  }else{
    if (!matric_number || !department || !level || !email) {
      return ResponseHandler(
        400,
        "Missing required fields"
      );
    }

    await connectDB();
    const existingMatricNumber = await User.findOne({ matric_number });
    if (existingMatricNumber) {
      return ResponseHandler(
        409,
        "Hmmm... Are you sure that's your matric number"
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return ResponseHandler(
        404,
        "User does not exist"
      );
    }

    try {
      await User.updateOne({ email }, {
        matric_number,
        department,
        level
      });
      return ResponseHandler(
        200,
        "User updated successfully"
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      logger.error("Error Updating User", err);
      return ResponseHandler(
        err?.cause?.err?.status || 500,
        err?.cause?.err?.message
      );
    }
  }
}
