import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/quiz"];
export const middleware = async (req: NextRequest) => {
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    const session = (await cookies()).get("authjs.session-token")?.value
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
  return NextResponse.next();
}