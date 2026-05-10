import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        const { id } = await params;
        
        // Let public trips be viewed without auth, but check for private
        const trip = await prisma.trip.findUnique({
            where: { id },
            include: {
                stops: {
                    include: { activities: true },
                    orderBy: { startDate: 'asc' }
                },
                expenses: true,
                checklist: true,
                notes: true
            }
        });

        if (!trip) return NextResponse.json({ error: "Not Found" }, { status: 404 });
        if (!trip.isPublic && trip.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ trip });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id } = await params;

        const data = await req.json();

        // Verify ownership
        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip || trip.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const updated = await prisma.trip.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                coverImage: data.coverImage,
                isPublic: data.isPublic
            }
        });

        return NextResponse.json({ trip: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const { id } = await params;

        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip || trip.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.trip.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
