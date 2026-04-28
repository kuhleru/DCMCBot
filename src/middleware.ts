import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = "dcmc-web-secret";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") return NextResponse.next();
  
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));
  
  try { jwt.verify(token, JWT_SECRET); } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next).*)"] };