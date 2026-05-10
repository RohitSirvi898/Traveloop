"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, MapPin, Calendar, Eye, Edit, Trash2, Plus,
  Loader2, Plane, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, isFuture, isPast } from "date-fns";

type Trip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string | null;
  coverImage: string | null;
  isPublic: boolean;
  totalBudget: number | null;
  stops?: { id: string; cityName: string }[];
};

type FilterType = "all" | "upcoming" | "past" | "shared";

export default function MyTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/trips");
        if (res.ok) {
          const data = await res.json();
          setTrips(data.trips || []);
        }
      } catch (e) {
        console.error("Load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTrips((prev) => prev.filter((t) => t.id !== id));
        toast.success(`"${title}" deleted.`);
      } else {
        toast.error("Failed to delete trip.");
      }
    } catch {
      toast.error("Failed to delete trip.");
    } finally {
      setDeleting(null);
    }
  };

  const getStatus = (trip: Trip): "upcoming" | "past" | "shared" => {
    if (trip.isPublic) return "shared";
    if (isFuture(new Date(trip.startDate))) return "upcoming";
    return "past";
  };

  const filteredTrips = trips.filter((trip) => {
    const status = getStatus(trip);
    const matchesFilter =
      activeFilter === "all" || status === activeFilter;
    const matchesSearch =
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.stops?.some((s) =>
        s.cityName.toLowerCase().includes(searchTerm.toLowerCase())
      ) ?? false);
    return matchesFilter && matchesSearch;
  });

  const statusColors = {
    upcoming:
      "bg-blue-100 text-blue-800",
    past: "bg-gray-100 text-gray-800",
    shared:
      "bg-green-100 text-green-800",
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Trips</h1>
          <p className="text-sm text-slate-600">
            Manage your upcoming adventures and relive past memories.
          </p>
        </div>
        <Link href="/trips/create">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            New Trip
          </Button>
        </Link>
      </header>

      {/* Content Area */}
      <div className="flex-1 p-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by destination or trip name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                onClick={() =>
                  setActiveFilter(filter.value as FilterType)
                }
                variant={
                  activeFilter === filter.value ? "default" : "outline"
                }
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter.value
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "text-slate-700"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrips.map((trip) => {
              const status = getStatus(trip);
              const destinations = trip.stops?.map((s) => s.cityName) ?? [];
              const isDeleting = deleting === trip.id;

              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-200"
                >
                  {/* Image / Gradient Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-700">
                    {trip.coverImage && (
                      <img
                        src={trip.coverImage}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {!trip.coverImage && (
                      <div className="w-full h-full flex items-center justify-center">
                        <Plane className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[status]}`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-1">
                      {trip.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {format(new Date(trip.startDate), "MMM dd")} –{" "}
                      {format(new Date(trip.endDate), "MMM dd, yyyy")}
                    </p>

                    {/* Destinations */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {destinations.length > 0 ? (
                        destinations.slice(0, 3).map((dest, i) => (
                          <span
                            key={i}
                            className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded"
                          >
                            {dest}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          No stops yet
                        </span>
                      )}
                      {destinations.length > 3 && (
                        <span className="text-xs text-slate-400">
                          +{destinations.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="flex-1"
                      >
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          <Eye size={16} />
                          View
                        </Button>
                      </Link>
                      <Link
                        href={`/trips/${trip.id}/build`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Edit size={16} />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() =>
                          handleDelete(trip.id, trip.title)
                        }
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add New Trip Card */}
            <Link href="/trips/create">
              <div className="bg-white rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 hover:border-teal-500 hover:bg-teal-50 transition-colors cursor-pointer min-h-[300px]">
                <div className="text-4xl mb-3 text-slate-400">+</div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Plan a New Trip
                </h3>
                <p className="text-sm text-slate-600 text-center mt-1">
                  Start your next journey today
                </p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Plane className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchTerm
                ? "No trips match your search"
                : "No trips yet"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm
                ? "Try a different search term."
                : "Plan your first adventure!"}
            </p>
            <Link href="/trips/create">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Plan New Trip
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
