"use client";

import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { TripCard } from "@/components/TripCard";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "upcoming" | "past" | "shared";

export default function MyTrips() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with real data from API
  const trips = [
    {
      id: "1",
      name: "Incredible India Odyssey",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
      startDate: "Dec 12",
      endDate: "Dec 28, 2024",
      destinations: ["Mumbai", "Surat", "Indore"],
      status: "Upcoming" as const,
    },
    {
      id: "2",
      name: "Summer Beach Retreat",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      startDate: "Aug 05",
      endDate: "Aug 17, 2024",
      destinations: ["Halo", "Maafiushi"],
      status: "Shared" as const,
    },
    {
      id: "3",
      name: "Alpine Skiing Adventure",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      startDate: "Jan 20",
      endDate: "Jan 27, 2024",
      destinations: ["Zermatt", "Interlaken"],
      status: "Past" as const,
    },
    {
      id: "4",
      name: "NYC Business & Leisure",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      startDate: "Nov 10",
      endDate: "Nov 15, 2024",
      destinations: ["Manhattan", "Brooklyn"],
      status: "Upcoming" as const,
    },
  ];

  // Filter trips based on active filter
  const filteredTrips = trips.filter((trip) => {
    const matchesFilter = activeFilter === "all" || trip.status.toLowerCase() === activeFilter;
    const matchesSearch =
      trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destinations.some((d) =>
        d.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-40 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Trips</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Manage your upcoming adventures and relive past memories.
            </p>
          </div>
          <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            <Bell size={20} />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-8 py-6">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by destination or trip name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                {[
                  { label: "All Trips", value: "all" },
                  { label: "Upcoming", value: "upcoming" },
                  { label: "Past", value: "past" },
                  { label: "Shared", value: "shared" },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value as FilterType)}
                    variant={activeFilter === filter.value ? "default" : "outline"}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeFilter === filter.value
                        ? "bg-teal-600 text-white"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Trip Cards Grid */}
            {filteredTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map((trip) => (
                  <TripCard key={trip.id} {...trip} />
                ))}

                {/* Add New Trip Card */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-8 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors cursor-pointer">
                  <div className="text-4xl mb-3">+</div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Plan a New Trip
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">
                    Start your next journey today
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  No trips found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
