import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";
import type { Metadata } from "next";
import ItineraryViewerClient from "./ItineraryViewerClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { title: true, description: true },
    });
    if (!trip) return { title: "Trip Not Found – Traveloop" };
    return {
      title: `${trip.title} – Itinerary | Traveloop`,
      description: trip.description ?? `View the full day-by-day itinerary for ${trip.title}.`,
    };
  } catch {
    return { title: "Itinerary | Traveloop" };
  }
}

export default async function TripViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  let trip;
  try {
    trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: { startDate: "asc" },
          include: {
            activities: {
              orderBy: { startTime: "asc" },
            },
          },
        },
      },
    });
  } catch (e) {
    console.error("Error fetching trip:", e);
    redirect("/my-trips");
  }

  if (!trip) {
    redirect("/my-trips");
  }

  // Allow owner or public trips
  if (!trip.isPublic && trip.userId !== userId) {
    redirect("/my-trips");
  }

  // Serialize dates to ISO strings to avoid hydration issues when passing
  // Prisma Date objects from Server Component → Client Component.
  const serializedTrip = {
    id: trip.id,
    title: trip.title,
    description: trip.description,
    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),
    coverImage: trip.coverImage,
    totalBudget: trip.totalBudget,
    stops: trip.stops.map((stop) => ({
      id: stop.id,
      cityName: stop.cityName,
      startDate: stop.startDate.toISOString(),
      endDate: stop.endDate.toISOString(),
      budget: stop.budget,
      activities: stop.activities.map((act) => ({
        id: act.id,
        title: act.title,
        description: act.description,
        cost: act.cost,
        type: act.type,
        startTime: act.startTime.toISOString(),
        endTime: act.endTime ? act.endTime.toISOString() : null,
      })),
    })),
  };

  return <ItineraryViewerClient trip={serializedTrip} />;
}
