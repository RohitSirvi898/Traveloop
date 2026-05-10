import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const searchParams = req.nextUrl.searchParams;
        const tripId = searchParams.get('tripId');

        if (!tripId) {
            return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
        }

        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip || trip.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const expenses = await prisma.expense.findMany({
            where: { tripId }
        });

        return NextResponse.json({ expenses });
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

        const expense = await prisma.expense.create({
            data: {
                tripId: data.tripId,
                category: data.category,
                description: data.description,
                quantity: data.quantity || 1,
                unitCost: data.unitCost,
                totalAmount: (data.quantity || 1) * data.unitCost
            }
        });

        return NextResponse.json({ expense }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
