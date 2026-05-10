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

  const trip = await prisma.trip.findUnique({
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

  if (!trip) {
    redirect("/my-trips");
  }

  // Allow owner or public trips
  if (!trip.isPublic && trip.userId !== userId) {
    redirect("/my-trips");
  }

  return <ItineraryViewerClient trip={trip} />;
}
