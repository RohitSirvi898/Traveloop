import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { canManageUsers } from "@/lib/admin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await canManageUsers(currentUserId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: targetUserId } = await params;
    let body: { action?: string } = {};
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      body = (await req.json()) as { action?: string };
    }

    if (body.action && body.action !== "make-admin" && body.action !== "revoke-admin") {
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }

    const nextRole = body.action === "revoke-admin" ? "user" : "admin";

    const client = await clerkClient();
    const targetUser = await client.users.getUser(targetUserId);
    const previousMetadata = (targetUser.publicMetadata ?? {}) as Record<string, unknown>;

    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        ...previousMetadata,
        role: nextRole,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await canManageUsers(currentUserId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: targetUserId } = await params;

    if (targetUserId === currentUserId) {
      return NextResponse.json({ error: "You cannot remove your own account." }, { status: 400 });
    }

    const client = await clerkClient();
    await client.users.deleteUser(targetUserId);

    try {
      const { prisma } = await import("@/lib/database/prisma/client");
      await prisma.user.deleteMany({
        where: {
          id: targetUserId,
        },
      });
    } catch {
      // User is already removed from Clerk. Local DB cleanup is best-effort.
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
