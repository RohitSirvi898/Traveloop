import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";
import ItineraryBuilderClient from "./ItineraryBuilderClient";

export default async function TripBuildPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const trip = await prisma.trip.findUnique({
    where: {
      id,
      userId: userId,
    },
    include: {
      stops: {
        orderBy: {
          startDate: 'asc',
        },
        include: {
          activities: {
            orderBy: {
              startTime: 'asc',
            }
          }
        }
      }
    }
  });

  if (!trip) {
    redirect("/dashboard");
  }

  return <ItineraryBuilderClient trip={trip} />;
}
