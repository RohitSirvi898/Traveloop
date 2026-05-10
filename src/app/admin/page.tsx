import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { canManageUsers } from "@/lib/admin";
import AdminConsoleClient from "./AdminConsoleClient";

export default async function AdminPage() {
	const { userId } = await auth();

	if (!userId) {
		redirect("/sign-in");
	}

	const isAdmin = await canManageUsers(userId);
	if (!isAdmin) {
		redirect("/dashboard");
	}

	return <AdminConsoleClient currentUserId={userId} />;
}
