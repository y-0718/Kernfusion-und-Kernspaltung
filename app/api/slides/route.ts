import { NextResponse } from "next/server";
import { getActivePresentation, getPublicSlides } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const presentation = await getActivePresentation();
  if (!presentation) return NextResponse.json({ slides: [] });
  const slides = await getPublicSlides(presentation.id);
  return NextResponse.json({ slides });
}
