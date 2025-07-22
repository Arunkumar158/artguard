import { NextRequest, NextResponse } from "next/server";

export declare function requireApiKey(req: NextRequest): Promise<{ keyRecord: any } | NextResponse>; 