import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        // Here you would typically check if the user has an 'admin' role
        // For hackathon purposes, we might just allow it or check a specific email/ID
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const totalUsers = await prisma.user.count();
        const totalTrips = await prisma.trip.count();
        const publicTrips = await prisma.trip.count({ where: { isPublic: true } });
        const totalActivities = await prisma.activity.count();
        
        // Let's get the top destinations
        const stops = await prisma.stop.groupBy({
            by: ['cityName'],
            _count: {
                cityName: true
            },
            orderBy: {
                _count: {
                    cityName: 'desc'
                }
            },
            take: 5
        });

        return NextResponse.json({
            totalUsers,
            totalTrips,
            publicTrips,
            totalActivities,
            topDestinations: stops.map(s => ({ city: s.cityName, count: s._count.cityName }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
