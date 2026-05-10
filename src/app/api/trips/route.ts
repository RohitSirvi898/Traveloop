import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const trips = await prisma.trip.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ trips });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await req.json();
        
        // Ensure user exists in our DB, if not create them
        // Clerk handles auth, but we need the relation
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: { id: userId, email: `${userId}@placeholder.com` } // Email might be required by schema
        });

        const trip = await prisma.trip.create({
            data: {
                userId,
                title: data.title,
                description: data.description || "",
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                coverImage: data.coverImage || null,
                totalBudget: data.totalBudget || null,
                proTip: data.proTip || null,
            }
        });

        return NextResponse.json({ trip }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
