import logger from "@/config/logger";
import { NextResponse } from "next/server";

export async function GET() {
    logger.info("Successfully Registered")
    return NextResponse.json(
        { message: "Successfully registered" },
    );
}