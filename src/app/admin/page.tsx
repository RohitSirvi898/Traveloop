"use client";

import { useMemo, useState } from "react";
import {
	Bell,
	Download,
	Filter,
	MoreVertical,
	ShieldCheck,
	Users,
	MapPin,
	Plane,
	TrendingUp,
	UserCheck,
	Search,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";

type AdminUser = {
	id: string;
	name: string;
	email: string;
	role: "user" | "manager" | "admin";
	status: "active" | "flagged" | "inactive";
	trips: number;
	lastSeen: string;
};

const monthlyTrips = [62, 79, 94, 122, 146, 168, 181];

const topCities = [
	{ city: "Mumbai", trips: 248, share: 21 },
	{ city: "Goa", trips: 212, share: 18 },
	{ city: "Delhi", trips: 178, share: 15 },
	{ city: "Jaipur", trips: 134, share: 11 },
	{ city: "Bengaluru", trips: 121, share: 10 },
];

const topActivities = [
	{ name: "Food Tours", bookings: 381, growth: "+16%" },
	{ name: "Beach Days", bookings: 324, growth: "+12%" },
	{ name: "City Walks", bookings: 291, growth: "+9%" },
	{ name: "Heritage Sites", bookings: 264, growth: "+7%" },
];

const users: AdminUser[] = [
	{
		id: "U-2914",
		name: "Aarav Sharma",
		email: "aarav.s@example.com",
		role: "user",
		status: "active",
		trips: 6,
		lastSeen: "2h ago",
	},
	{
		id: "U-2915",
		name: "Meera Iyer",
		email: "meera.i@example.com",
		role: "manager",
		status: "active",
		trips: 12,
		lastSeen: "15m ago",
	},
	{
		id: "U-2916",
		name: "Rohan Verma",
		email: "rohan.v@example.com",
		role: "user",
		status: "flagged",
		trips: 2,
		lastSeen: "1d ago",
	},
	{
		id: "U-2917",
		name: "Nisha Kapur",
		email: "nisha.k@example.com",
		role: "admin",
		status: "active",
		trips: 18,
		lastSeen: "Online",
	},
	{
		id: "U-2918",
		name: "Karan Singh",
		email: "karan.s@example.com",
		role: "user",
		status: "inactive",
		trips: 1,
		lastSeen: "7d ago",
	},
];

function statusClasses(status: AdminUser["status"]) {
	if (status === "active") {
		return "bg-emerald-50 text-emerald-700 border-emerald-200";
	}
	if (status === "flagged") {
		return "bg-amber-50 text-amber-700 border-amber-200";
	}
	return "bg-slate-100 text-slate-600 border-slate-200";
}

function roleClasses(role: AdminUser["role"]) {
	if (role === "admin") {
		return "bg-[#E6F4F2] text-[#2AB5A0]";
	}
	if (role === "manager") {
		return "bg-sky-100 text-sky-700";
	}
	return "bg-slate-100 text-slate-700";
}

export default function AdminPage() {
	const [query, setQuery] = useState("");

	const filteredUsers = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return users;
		return users.filter(
			(u) =>
				u.name.toLowerCase().includes(q) ||
				u.email.toLowerCase().includes(q) ||
				u.id.toLowerCase().includes(q)
		);
	}, [query]);

	const maxTrips = Math.max(...monthlyTrips);

	return (
		<div className="flex h-screen bg-slate-50">
			<Sidebar />

			<main className="flex-1 ml-40 flex flex-col overflow-hidden">
				<header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
					<div>
						<h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
						<p className="text-sm text-slate-600">
							Monitor platform growth, traveler behavior, and account health.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
							<Bell size={20} />
						</button>
						<Button variant="outline" className="border-slate-300 text-slate-700">
							<Download className="w-4 h-4 mr-2" />
							Export Report
						</Button>
					</div>
				</header>

				<div className="flex-1 overflow-auto px-8 py-6 space-y-6">
					<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
						<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
							<p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Total Users</p>
							<p className="text-3xl font-bold text-slate-900 mt-3">18,420</p>
							<p className="text-sm text-emerald-600 font-medium mt-2">+8.4% this month</p>
						</div>
						<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
							<p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Trips Created</p>
							<p className="text-3xl font-bold text-slate-900 mt-3">5,241</p>
							<p className="text-sm text-emerald-600 font-medium mt-2">+12.1% vs last month</p>
						</div>
						<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
							<p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Weekly Active Users</p>
							<p className="text-3xl font-bold text-slate-900 mt-3">7,908</p>
							<p className="text-sm text-emerald-600 font-medium mt-2">43% engagement rate</p>
						</div>
						<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
							<p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Support Flags</p>
							<p className="text-3xl font-bold text-slate-900 mt-3">27</p>
							<p className="text-sm text-amber-600 font-medium mt-2">Needs review by moderators</p>
						</div>
					</section>

					<section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
						<div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
							<div className="flex items-center justify-between mb-5">
								<div>
									<h2 className="text-lg font-semibold text-slate-900">Trips Trend</h2>
									<p className="text-sm text-slate-600">New trips created over the last 7 months</p>
								</div>
								<TrendingUp className="text-[#2AB5A0]" size={22} />
							</div>

							<div className="h-56 flex items-end gap-3">
								{monthlyTrips.map((value, index) => (
									<div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
										<div
											className="w-full rounded-t-md bg-gradient-to-b from-[#7AD8CB] to-[#2AB5A0]"
											style={{ height: `${Math.max(16, Math.round((value / maxTrips) * 180))}px` }}
										/>
										<span className="text-xs text-slate-500">M{index + 1}</span>
									</div>
								))}
							</div>
						</div>

						<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-semibold text-slate-900">Top Cities</h2>
								<MapPin size={20} className="text-[#2AB5A0]" />
							</div>
							<div className="space-y-4">
								{topCities.map((row) => (
									<div key={row.city}>
										<div className="flex items-center justify-between text-sm mb-1.5">
											<span className="font-medium text-slate-800">{row.city}</span>
											<span className="text-slate-500">{row.trips} trips</span>
										</div>
										<div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
											<div className="h-full bg-[#2AB5A0] rounded-full" style={{ width: `${row.share * 4}%` }} />
										</div>
									</div>
								))}
							</div>
						</div>
					</section>

					<section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
						<div className="bg-white border border-slate-200 rounded-xl shadow-sm">
							<div className="px-6 pt-6 pb-4 flex items-center justify-between">
								<h2 className="text-lg font-semibold text-slate-900">Popular Activities</h2>
								<Plane size={20} className="text-[#2AB5A0]" />
							</div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-y border-slate-100 bg-slate-50">
											<th className="text-left text-xs font-semibold text-slate-600 px-6 py-3">Activity</th>
											<th className="text-left text-xs font-semibold text-slate-600 px-6 py-3">Bookings</th>
											<th className="text-left text-xs font-semibold text-slate-600 px-6 py-3">Growth</th>
										</tr>
									</thead>
									<tbody>
										{topActivities.map((row) => (
											<tr key={row.name} className="border-b border-slate-100">
												<td className="px-6 py-4 text-sm font-medium text-slate-800">{row.name}</td>
												<td className="px-6 py-4 text-sm text-slate-600">{row.bookings}</td>
												<td className="px-6 py-4 text-sm font-semibold text-emerald-600">{row.growth}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						<div className="bg-white border border-slate-200 rounded-xl shadow-sm">
							<div className="px-6 pt-6 pb-4 flex items-center justify-between">
								<h2 className="text-lg font-semibold text-slate-900">User Engagement</h2>
								<Users size={20} className="text-[#2AB5A0]" />
							</div>
							<div className="px-6 pb-6 space-y-4">
								<div>
									<div className="flex justify-between text-sm mb-2">
										<span className="text-slate-700">Daily Active Users</span>
										<span className="font-semibold text-slate-900">4,812</span>
									</div>
									<div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
										<div className="h-full bg-[#2AB5A0] rounded-full" style={{ width: "74%" }} />
									</div>
								</div>

								<div>
									<div className="flex justify-between text-sm mb-2">
										<span className="text-slate-700">Repeat Trip Creators</span>
										<span className="font-semibold text-slate-900">2,093</span>
									</div>
									<div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
										<div className="h-full bg-sky-500 rounded-full" style={{ width: "56%" }} />
									</div>
								</div>

								<div>
									<div className="flex justify-between text-sm mb-2">
										<span className="text-slate-700">Shared Itinerary Usage</span>
										<span className="font-semibold text-slate-900">1,644</span>
									</div>
									<div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
										<div className="h-full bg-amber-500 rounded-full" style={{ width: "48%" }} />
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
						<div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
							<div>
								<h2 className="text-lg font-semibold text-slate-900">User Management</h2>
								<p className="text-sm text-slate-600">Review user state, role access, and moderation actions.</p>
							</div>
							<div className="flex items-center gap-2">
								<div className="relative">
									<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
									<input
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										placeholder="Search users..."
										className="pl-9 pr-3 py-2 w-56 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2AB5A0]"
									/>
								</div>
								<Button variant="outline" className="border-slate-300 text-slate-700">
									<Filter className="w-4 h-4 mr-2" />
									Filter
								</Button>
								<Button className="bg-[#2AB5A0] hover:bg-[#1f9c8b] text-white">
									<UserCheck className="w-4 h-4 mr-2" />
									Invite Admin
								</Button>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-slate-50 border-b border-slate-100">
										<th className="text-left text-xs font-semibold text-slate-600 px-6 py-3">User</th>
										<th className="text-left text-xs font-semibold text-slate-600 px-6 py-3">Role</th>
										<th className="text-left text-xs font-semibold text-slate-600 px-6 py-3">Status</th>
										<th className="text-left text-xs font-semibold text-slate-600 px-6 py-3">Trips</th>
										<th className="text-left text-xs font-semibold text-slate-600 px-6 py-3">Last Seen</th>
										<th className="text-right text-xs font-semibold text-slate-600 px-6 py-3">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredUsers.map((u) => (
										<tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/70">
											<td className="px-6 py-4">
												<p className="text-sm font-medium text-slate-900">{u.name}</p>
												<p className="text-xs text-slate-500">{u.email}</p>
											</td>
											<td className="px-6 py-4">
												<span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleClasses(u.role)}`}>
													{u.role}
												</span>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${statusClasses(
														u.status
													)}`}
												>
													{u.status}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-slate-700">{u.trips}</td>
											<td className="px-6 py-4 text-sm text-slate-600">{u.lastSeen}</td>
											<td className="px-6 py-4 text-right">
												<button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
													<MoreVertical size={16} />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm">
							<span className="text-slate-600">Showing {filteredUsers.length} of {users.length} users</span>
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
									<ShieldCheck className="w-4 h-4 mr-2" />
									Run Moderation Scan
								</Button>
								<Button size="sm" className="bg-[#F5A623] hover:bg-[#d98f1a] text-white">
									Review Flags
								</Button>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
