import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { canManageUsers } from "@/lib/admin";

type PublicMetadataLike = {
  role?: string;
  status?: string;
};

function getPrimaryEmail(user: {
  emailAddresses: Array<{ id: string; emailAddress: string }>;
  primaryEmailAddressId: string | null;
}) {
  if (user.primaryEmailAddressId) {
    const primary = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId);
    if (primary) return primary.emailAddress;
  }

  return user.emailAddresses[0]?.emailAddress ?? "";
}

function getRole(metadata: unknown): "user" | "manager" | "admin" {
  const role = (metadata as PublicMetadataLike | null)?.role;
  if (role === "admin" || role === "manager") {
    return role;
  }

  return "user";
}

function getStatus(metadata: unknown): "active" | "flagged" | "inactive" {
  const status = (metadata as PublicMetadataLike | null)?.status;
  if (status === "flagged" || status === "inactive") {
    return status;
  }

  return "active";
}

async function getTripsByUserId(userIds: string[]) {
  try {
    const { prisma } = await import("@/lib/database/prisma/client");
    const tripCounts = await prisma.trip.groupBy({
      by: ["userId"],
      where: {
        userId: {
          in: userIds,
        },
      },
      _count: {
        _all: true,
      },
    });

    return new Map(tripCounts.map((row) => [row.userId, row._count._all]));
  } catch {
    return new Map<string, number>();
  }
}

async function getSignedInUserIds(client: Awaited<ReturnType<typeof clerkClient>>, currentUserId: string) {
  try {
    const activeSessionsResponse = await client.sessions.getSessionList({
      status: "active",
      limit: 500,
      offset: 0,
    });

    const ids = Array.from(
      new Set(activeSessionsResponse.data.map((session) => session.userId).filter(Boolean))
    );

    if (ids.length === 0) {
      ids.push(currentUserId);
    }

    return ids;
  } catch {
    return [currentUserId];
  }
}

async function getAllUsers(client: Awaited<ReturnType<typeof clerkClient>>, currentUserId: string) {
  try {
    const response = await client.users.getUserList({
      limit: 100,
      offset: 0,
    });

    return {
      users: response.data,
      totalUsers: response.totalCount ?? response.data.length,
    };
  } catch {
    const currentUser = await client.users.getUser(currentUserId);
    return {
      users: [currentUser],
      totalUsers: 1,
    };
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await canManageUsers(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const client = await clerkClient();

    const signedInUserIds = await getSignedInUserIds(client, userId);
    const signedInSet = new Set(signedInUserIds);

    const allUsersResult = await getAllUsers(client, userId);
    const allUserIds = allUsersResult.users.map((user) => user.id);
    const tripsByUserId = await getTripsByUserId(allUserIds);

    const users = allUsersResult.users.map((user) => ({
      id: user.id,
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Unnamed User",
      email: getPrimaryEmail(user),
      role: getRole(user.publicMetadata),
      status: getStatus(user.publicMetadata),
      trips: tripsByUserId.get(user.id) ?? 0,
      lastSeen: user.lastActiveAt,
      isSignedIn: signedInSet.has(user.id),
    }));

    return NextResponse.json({ users, totalUsers: allUsersResult.totalUsers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
