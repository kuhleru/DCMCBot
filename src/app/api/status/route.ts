import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dcmc-web-secret-1111";

export async function GET() {
  // Check if MC mod is responding
  let status = "Offline";
  let lastResponse = "";
  
  try {
    const res = await fetch("http://localhost:3001/poll", {
      method: "GET",
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) status = "Online";
  } catch {
    status = "Offline";
  }

  return NextResponse.json({
    status,
    lastResponse,
    timestamp: new Date().toISOString(),
  });
}