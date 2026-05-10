import { NextRequest, NextResponse } from "next/server";
import { saveItinerary } from "@/lib/actions";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // expected: { tripId, stops }
    await saveItinerary(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? String(error) }, { status: 500 });
  }
}
