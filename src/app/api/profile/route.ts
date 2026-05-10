import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let user = await prisma.user.findUnique({
            where: { id: userId }
        });

        // Auto-create if it doesn't exist yet
        if (!user) {
            user = await prisma.user.create({
                data: { id: userId, email: `${userId}@placeholder.com` }
            });
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await req.json();

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                city: data.city,
                country: data.country,
                photoUrl: data.photoUrl,
                language: data.language,
                timezone: data.timezone,
                savedDestinations: data.savedDestinations || []
            }
        });

        return NextResponse.json({ user: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
