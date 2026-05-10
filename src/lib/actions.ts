"use server"

import { prisma } from "@/lib/database/prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function getFullItinerary(tripId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const itinerary = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          orderBy: { startDate: 'asc' },
          include: {
            activities: {
              orderBy: { startTime: 'asc' }
            }
          }
        }
      }
    });

    if (!itinerary) throw new Error("Itinerary not found");
    // Only check auth if it's not public
    if (!itinerary.isPublic && itinerary.userId !== userId) {
        throw new Error("Unauthorized access to itinerary");
    }

    return itinerary;
  } catch (error) {
    console.error("Failed to fetch itinerary:", error);
    throw new Error("Could not load itinerary data.");
  }
}

export type ActivityInput = {
    title: string;
    description?: string | null;
    cost: number;
    type: string;
    startTime: string | Date;
    endTime?: string | Date | null;
};

export type StopInput = {
    cityName: string;
    startDate: string | Date;
    endDate: string | Date;
    budget?: number | null;
    activities: ActivityInput[];
};

export type SaveItineraryInput = {
    tripId: string;
    stops: StopInput[];
};

export async function saveItinerary(data: SaveItineraryInput) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // Verify ownership
        const trip = await prisma.trip.findUnique({ where: { id: data.tripId } });
        if (!trip || trip.userId !== userId) {
            throw new Error("Unauthorized");
        }

        // Wipe existing stops (Prisma schema has onDelete: Cascade, so activities are also wiped)
        await prisma.stop.deleteMany({
            where: { tripId: data.tripId }
        });

        // Bulk insert the new tree
        // Prisma doesn't natively support deep nested createMany yet. 
        // We create stops with their activities nested sequentially
        for (const stop of data.stops) {
            await prisma.stop.create({
                data: {
                    tripId: data.tripId,
                    cityName: stop.cityName,
                    startDate: new Date(stop.startDate),
                    endDate: new Date(stop.endDate),
                    budget: stop.budget,
                    activities: {
                        create: stop.activities.map(activity => ({
                            title: activity.title,
                            description: activity.description || "",
                            cost: activity.cost,
                            type: activity.type,
                            startTime: new Date(activity.startTime),
                            endTime: activity.endTime ? new Date(activity.endTime) : null
                        }))
                    }
                }
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to save itinerary:", error);
        throw new Error("Could not save itinerary data.");
    }
}
