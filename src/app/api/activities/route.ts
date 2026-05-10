import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        // Verify that the stop exists and belongs to the user's trip
        const stop = await prisma.stop.findUnique({
            where: { id: data.stopId },
            include: { trip: true }
        });

        if (!stop || stop.trip.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const activity = await prisma.activity.create({
            data: {
                stopId: data.stopId,
                title: data.title,
                description: data.description || "",
                cost: data.cost || 0,
                type: data.type || "ACTIVITY",
                startTime: new Date(data.startTime),
                endTime: data.endTime ? new Date(data.endTime) : null
            }
        });

        return NextResponse.json({ activity }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
