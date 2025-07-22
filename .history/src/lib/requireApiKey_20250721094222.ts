import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function requireApiKey(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  // Validate API key
  const { data: keyRecord, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("api_key", apiKey)
    .eq("active", true)
    .single();

  if (!keyRecord || error) {
    return NextResponse.json({ error: "Invalid or inactive API key" }, { status: 401 });
  }

  // Log usage
  await supabase.from("api_usage_logs").insert({
    key_id: keyRecord.id,
    endpoint: req.nextUrl.pathname,
    timestamp: new Date().toISOString(),
  });

  // Return the key record for downstream use
  return { keyRecord };
} 