import { notFound } from "next/navigation";
import { prisma } from "@/lib/database/prisma/client";
import ItineraryViewerClient from "@/app/trips/[id]/ItineraryViewerClient";

export default async function SharedTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      stops: {
        include: { activities: true },
        orderBy: { startDate: "asc" },
      },
    },
  });

  if (!trip) {
    notFound();
  }

  // If the trip is not marked public, don't show it here.
  // (Alternatively, you could check if the currently logged in user owns it,
  // but this is specifically the /shared/ route).
  if (!trip.isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Private Trip</h1>
          <p className="text-gray-500">
            This trip is private and cannot be viewed via the shared link.
          </p>
        </div>
      </div>
    );
  }

  return <ItineraryViewerClient trip={trip} isPublicView={true} />;
}
