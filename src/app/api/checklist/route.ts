import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        // Verify that the trip belongs to the user
        const trip = await prisma.trip.findUnique({ where: { id: data.tripId } });
        if (!trip || trip.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const item = await prisma.checklistItem.create({
            data: {
                tripId: data.tripId,
                category: data.category,
                itemName: data.itemName,
                isPacked: false
            }
        });

        return NextResponse.json({ item }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
