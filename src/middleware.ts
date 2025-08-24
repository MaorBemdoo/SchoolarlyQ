/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "./utils/auth";
import ResponseHandler from "./utils/ResponseHandler";

const protectedRoutes = ["/quiz"];
export const middleware = async (req: NextRequest) => {
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    const session = await auth()

    if (!session) {
      if(req.nextUrl.pathname.startsWith("/api")){
        return NextResponse.json(ResponseHandler("failed", "Unauthorized"), { status: 401 });
      }
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }
  return NextResponse.next();
};
