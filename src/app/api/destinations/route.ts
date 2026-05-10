import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

// GET /api/destinations  — returns all seeded global destinations with activities
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const destinations = await prisma.globalDestination.findMany({
            orderBy: { name: "asc" },
            include: { activities: true },
        });

        return NextResponse.json(destinations);
    } catch (error) {
        console.error("GET /api/destinations error:", error);
        return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
    }
}
