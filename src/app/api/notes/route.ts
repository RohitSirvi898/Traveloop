import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Get all trips for the user
        const trips = await prisma.trip.findMany({
            where: { userId }
        });

        const tripIds = trips.map(trip => trip.id);

        // Get all notes for those trips
        const notes = await prisma.tripNote.findMany({
            where: {
                tripId: {
                    in: tripIds
                }
            },
            orderBy: { date: 'desc' }
        });

        return NextResponse.json({ notes });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

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

        const note = await prisma.tripNote.create({
            data: {
                tripId: data.tripId,
                title: data.title,
                locationTag: data.locationTag || null,
                content: data.content
            }
        });

        return NextResponse.json({ note }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
