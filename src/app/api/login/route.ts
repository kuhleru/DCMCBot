import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PASSWORD = "1111";
const JWT_SECRET = "dcmc-web-secret";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  
  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  }
  
  const token = jwt.sign({ access: "dcmc" }, JWT_SECRET, { expiresIn: "7d" });
  return NextResponse.json({ token });
}