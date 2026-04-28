import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { writeFileSync, readFileSync, existsSync } from "fs";

const JWT_SECRET = process.env.JWT_SECRET || "dcmc-secret-change-me";

export async function POST(request: NextRequest) {
  try {
    // Get token from header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    // Verify token
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const { action, args } = await request.json();
    
    if (!action) {
      return NextResponse.json({ error: "No action provided" }, { status: 400 });
    }

    let cmd = action;
    if (args) cmd += ` ${args}`;
    
    writeFileSync("command.txt", cmd + "\n");

    return NextResponse.json({ success: true, response: `Sent: ${cmd}` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send command" }, { status: 500 });
  }
}