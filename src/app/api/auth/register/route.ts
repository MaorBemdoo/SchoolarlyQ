import bcrypt from "bcryptjs";
import { signIn } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import logger from "@/config/logger";
import connectDB from "@/utils/db";

export async function POST(req: NextRequest) {
  const { full_name, email, password, step = 1, type = "credentials", matric_number, department, level, username: username2 } = await req.json();

  if(step == 1){
    if(type == "credentials"){
      if (!full_name || !email || !password) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: 400 },
        );
      }
    
      const username = email.slice(0, email.indexOf("@"))
    
      await connectDB();
    
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return NextResponse.json(
          { message: "User with email already exist" },
          { status: 409 },
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
          username,
          password,
          redirect: false,
        });
    
        logger.info("User created and signed in successfully", {
          id: user._id,
        });
        return NextResponse.json(
          { message: "User created and signed in successfully" },
          { status: 201 },
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logger.error("Error Registering User", err);
        return NextResponse.json(
          { message: err.cause.err.message },
          { status: err.cause.err.status },
        );
      }
    }else{
      const data = await signIn("google", { redirect: false })
      console.log(data)
    }
  }else{
    if (!matric_number || !department || !level || !username2) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingMatricNumber = await User.findOne({ matric_number });
    if (existingMatricNumber) {
      return NextResponse.json(
        { message: "Hmmm... Are you sure that's your matric number" },
        { status: 409 },
      );
    }

    const existingUser = await User.findOne({ username: username2 });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 404 },
      );
    }

    try {
      await User.updateOne({ username: username2 }, {
        matric_number,
        department,
        level
      });
      return NextResponse.json(
        { message: "User updated successfully" },
        { status: 200 },
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      logger.error("Error Updating User", err);
      return NextResponse.json(
        { message: err.cause.err.message },
        { status: err.cause.err.status },
      );
    }
  }
}
