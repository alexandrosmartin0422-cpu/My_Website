import { NextResponse } from "next/server";
import { incrementDownloads } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function POST() {
  const stats = await incrementDownloads();
  return NextResponse.json(stats, {
    headers: { "Cache-Control": "no-store" },
  });
}
