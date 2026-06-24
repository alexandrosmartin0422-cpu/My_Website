import { NextResponse } from "next/server";
import { incrementVisits } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function POST() {
  const stats = await incrementVisits();
  return NextResponse.json(stats, {
    headers: { "Cache-Control": "no-store" },
  });
}
