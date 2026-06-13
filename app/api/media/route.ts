import { NextResponse } from "next/server";
import { getMediaAssets } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const media = await getMediaAssets();
  return NextResponse.json({ media });
}
