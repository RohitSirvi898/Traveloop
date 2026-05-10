import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/database/prisma/client";
import ChecklistClient from "./ChecklistClient";

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) redirect("/sign-in");

  const trip = await prisma.trip.findUnique({
    where: { id, userId },
    select: {
      id: true,
      title: true,
      checklist: {
        orderBy: { category: "asc" },
      },
    },
  });

  if (!trip) redirect("/my-trips");

  return (
    <ChecklistClient
      tripId={trip.id}
      tripTitle={trip.title}
      initialItems={trip.checklist}
    />
  );
}
