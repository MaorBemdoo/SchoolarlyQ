import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";

const protectedRoutes = ["/quiz"];
export const middleware = async (req: NextRequest) => {
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    const session = await auth()
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
  return NextResponse.next();
}