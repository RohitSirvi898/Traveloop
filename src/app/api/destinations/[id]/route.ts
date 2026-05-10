import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

// GET /api/destinations/[id]  — returns a single destination with its activities
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        const { id } = await params;
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const destination = await prisma.globalDestination.findUnique({
            where: { id },
            include: { activities: true },
        });

        if (!destination) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json(destination);
    } catch (error) {
        console.error("GET /api/destinations/[id] error:", error);
        return NextResponse.json({ error: "Failed to fetch destination" }, { status: 500 });
    }
}
