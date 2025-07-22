import { requireApiKey } from "../lib/requireApiKey";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const result = await requireApiKey(req);
  if ("error" in result) return result; // Unauthorized
  // ...protected logic here...
  return NextResponse.json({ message: "GET Success!" });
}

export async function POST(req: NextRequest) {
  const result = await requireApiKey(req);
  if ("error" in result) return result; // Unauthorized
  // ...protected logic here...
  return NextResponse.json({ message: "POST Success!" });
} 