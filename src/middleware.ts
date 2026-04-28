import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dcmc-web-secret-1111";

export function middleware(request: NextRequest) {
  // Skip login page
  if (request.nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  // Check for token
  const token = request.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};