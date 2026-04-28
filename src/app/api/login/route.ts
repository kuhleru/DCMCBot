import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PASSWORD = "1111";
const JWT_SECRET = process.env.JWT_SECRET || "dcmc-web-secret-1111";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (password !== PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    
    const token = jwt.sign({ access: "dcmc" }, JWT_SECRET, { expiresIn: "7d" });
    
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}