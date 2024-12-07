import bcrypt from "bcryptjs";
import { signIn } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import logger from "@/config/logger";
import connectDB from "@/utils/db";

export async function POST(req: NextRequest) {
  const { full_name, email, matric_number, username, password } =
    await req.json();

  if (!full_name || !username || !email || !matric_number || !password) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  await connectDB();

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return NextResponse.json(
      { message: "Username already exist" },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 7);
  const user = new User({
    full_name,
    username,
    email,
    matric_number,
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
}
