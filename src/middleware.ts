import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/quiz"];
export const middleware = async (req: NextRequest) => {
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    const token = (await cookies()).get(
      process.env.NODE_ENV === "development"
        ? "authjs.session-token"
        : "__Secure-authjs.session-token",
    )?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }
  return NextResponse.next();
};
