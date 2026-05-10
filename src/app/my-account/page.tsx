"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Clock3, Globe, MapPinned, Plus, ShieldCheck, Trash2, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AccountSettingsFormProps = {
	initialFullName: string;
	initialEmail: string;
};

function AccountSettingsForm({ initialFullName, initialEmail }: AccountSettingsFormProps) {
	const [fullName, setFullName] = useState(() => initialFullName);
	const [email, setEmail] = useState(() => initialEmail);
	const [language, setLanguage] = useState("English (United States)");
	const [timezone, setTimezone] = useState("IST (UTC +5:30)");
	const [savedDestinations, setSavedDestinations] = useState<string[]>([
		"Mumbai",
		"Kolkata",
		"Bali",
		"Tokyo",
		"Paris",
	]);
	const [newDestination, setNewDestination] = useState("");

	const handleAddDestination = () => {
		const destination = newDestination.trim();
		if (!destination) {
			return;
		}

		setSavedDestinations((current) => [...current, destination]);
		setNewDestination("");
	};

	const handleRemoveDestination = (index: number) => {
		setSavedDestinations((current) => current.filter((_, destinationIndex) => destinationIndex !== index));
	};

	const handleSaveChanges = () => {
		console.log("Saving changes:", { fullName, email, language, timezone, savedDestinations });
	};

	const handleDeleteAccount = () => {
		if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
			console.log("Delete account");
		}
	};

	return (
		<>
			<div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-6">
						<div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-200 bg-teal-100">
							<User size={56} className="text-teal-600" />
							<div className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-2 border-white bg-emerald-500" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">{fullName || "Traveler"}</h2>
							<p className="mt-1 text-gray-600">{email || "No email connected"}</p>
							<div className="mt-3 flex flex-wrap gap-2">
								<span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
									<ShieldCheck size={12} />
									PREMIUM MEMBER
								</span>
								<span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
									<Globe size={12} />
									EARLY EXPLORER
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-wrap gap-3 text-sm text-gray-500">
						<div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2">
							<Clock3 size={16} />
							<span>{timezone}</span>
						</div>
						<div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2">
							<MapPinned size={16} />
							<span>{language}</span>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<h3 className="mb-6 text-xl font-bold text-gray-900">Personal Information</h3>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
						<input
							type="text"
							value={fullName}
							onChange={(event) => setFullName(event.target.value)}
							className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
							placeholder="Full Name"
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
						<input
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
							placeholder="Email Address"
						/>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">Language Preference</label>
						<select
							value={language}
							onChange={(event) => setLanguage(event.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
						>
							<option>English (United States)</option>
							<option>English (UK)</option>
							<option>Spanish</option>
							<option>French</option>
							<option>German</option>
							<option>Hindi</option>
						</select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">Timezone</label>
						<select
							value={timezone}
							onChange={(event) => setTimezone(event.target.value)}
							className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
						>
							<option>IST (UTC +5:30)</option>
							<option>UTC</option>
							<option>EST (UTC -5:00)</option>
							<option>PST (UTC -8:00)</option>
							<option>GMT (UTC +0:00)</option>
							<option>CET (UTC +1:00)</option>
						</select>
					</div>
				</div>
			</div>

			<div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<h3 className="mb-2 text-xl font-bold text-gray-900">Saved Destinations</h3>
				<p className="mb-4 text-sm text-gray-600">Cities and regions you&apos;re currently watching for deals</p>

				<div className="mb-6 flex flex-wrap gap-3">
					{savedDestinations.map((destination, index) => (
						<div
							key={`${destination}-${index}`}
							className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
						>
							{destination}
							<button
								onClick={() => handleRemoveDestination(index)}
								className="ml-1 transition-colors hover:text-gray-900"
							>
								<X size={16} />
							</button>
						</div>
					))}
				</div>

				<div className="flex flex-col gap-2 md:flex-row">
					<input
						type="text"
						value={newDestination}
						onChange={(event) => setNewDestination(event.target.value)}
						onKeyDown={(event) => event.key === "Enter" && handleAddDestination()}
						placeholder="Add a destination"
						className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
					/>
					<button
						onClick={handleAddDestination}
						className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-600 px-4 py-2 font-medium text-teal-600 transition-colors hover:bg-teal-50"
					>
						<Plus size={18} />
						Add Destination
					</button>
				</div>
			</div>

			<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<Button
						onClick={handleSaveChanges}
						className="flex items-center gap-2 rounded-lg bg-teal-600 px-8 py-3 font-medium text-white hover:bg-teal-700"
					>
						Save Changes
					</Button>
					<button
						onClick={handleDeleteAccount}
						className="flex items-center gap-1 font-medium text-red-600 transition-colors hover:text-red-700"
					>
						<Trash2 size={18} />
						Delete Account
					</button>
				</div>
			</div>
		</>
	);
}

export default function MyAccountPage() {
	const { user } = useUser();
	const initialFullName = user?.fullName || user?.firstName || "Traveler";
	const initialEmail = user?.primaryEmailAddress?.emailAddress || "";

	return (
		<div className="ml-40 max-w-5xl p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">My Account</h1>
				<p className="mt-2 text-slate-600">Manage your profile information and travel preferences in one place.</p>
			</div>
			<AccountSettingsForm
				key={user?.id ?? "anonymous"}
				initialFullName={initialFullName}
				initialEmail={initialEmail}
			/>
		</div>
	);
}
