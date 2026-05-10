import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id } = await params;

        const data = await req.json();

        // Verify ownership
        const activity = await prisma.activity.findUnique({
            where: { id },
            include: { stop: { include: { trip: true } } }
        });

        if (!activity || activity.stop.trip.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const updated = await prisma.activity.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                cost: data.cost,
                date: data.date ? new Date(data.date) : undefined
            }
        });

        return NextResponse.json({ activity: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id } = await params;

        // Verify ownership
        const activity = await prisma.activity.findUnique({
            where: { id },
            include: { stop: { include: { trip: true } } }
        });

        if (!activity || activity.stop.trip.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.activity.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
