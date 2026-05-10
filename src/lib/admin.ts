import { clerkClient } from "@clerk/nextjs/server";

type PublicMetadataLike = {
	role?: string;
};

export async function canManageUsers(currentUserId: string) {
	const client = await clerkClient();
	const currentUser = await client.users.getUser(currentUserId);

	const role = (currentUser.publicMetadata as PublicMetadataLike | null)?.role;
	if (role === "admin") {
		return true;
	}

	const adminIds = (process.env.ADMIN_USER_IDS ?? "")
		.split(",")
		.map((id) => id.trim())
		.filter(Boolean);

	return adminIds.includes(currentUserId);
}
