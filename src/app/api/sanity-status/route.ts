import { NextResponse } from "next/server";
import { isSanityConfigured } from "@/lib/sanity/env";

export async function GET() {
  if (!isSanityConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET, then create events in /studio or keep using content/events.json.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    message:
      "Open /studio to manage content. Seed tip: create Event documents matching content/events.json (slug = id, upload flyers).",
  });
}
