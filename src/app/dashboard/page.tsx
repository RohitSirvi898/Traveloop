"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, MapPin, Calendar, Star, Plus, Wallet,
  ArrowRight, Map, Plane, TrendingUp, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, differenceInDays, isFuture, isPast } from "date-fns";

type Trip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string | null;
  coverImage: string | null;
  totalBudget: number | null;
  stops?: { id: string; cityName: string; activities: { cost: number }[] }[];
};

type Destination = {
  id: string;
  name: string;
  region: string;
  description: string;
  imageUrl: string;
  costIndex: string;
  dailyBudget: number;
  activities: { id: string; title: string }[];
};

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // First try to load real data
        const [tripsRes, destRes] = await Promise.all([
          fetch("/api/trips"),
          fetch("/api/destinations"),
        ]);
        if (tripsRes.ok) {
          const data = await tripsRes.json();
          let realTrips = data.trips || [];

          // Auto-seed demo data if the user has zero trips
          if (realTrips.length === 0) {
            try {
              const seedRes = await fetch("/api/seed", { method: "POST" });
              if (seedRes.ok) {
                // Re-fetch trips after seeding
                const freshRes = await fetch("/api/trips");
                if (freshRes.ok) {
                  const freshData = await freshRes.json();
                  realTrips = freshData.trips || [];
                }
              }
            } catch {
              // seed failed, continue with empty
            }
          }

          setTrips(realTrips);
        }
        if (destRes.ok) {
          const data = await destRes.json();
          if (Array.isArray(data)) setDestinations(data);
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const upcomingTrips = trips
    .filter((t) => isFuture(new Date(t.startDate)))
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const recentTrips = trips.slice(0, 4);

  const totalBudget = trips.reduce(
    (sum, t) => sum + (t.totalBudget || 0),
    0
  );
  const totalSpend = trips.reduce(
    (sum, t) =>
      sum +
      (t.stops?.reduce(
        (s, stop) =>
          s + stop.activities.reduce((a, act) => a + act.cost, 0),
        0
      ) ?? 0),
    0
  );

  // Filter destinations by search
  const filteredDest = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Topbar */}
      <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips, destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 bg-[#F8F9FA] border border-transparent focus:bg-white focus:border-[#2AB5A0] focus:ring-1 focus:ring-[#2AB5A0] rounded-full h-11 text-sm outline-none transition-all"
          />
        </div>
        <div></div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-8 pb-12 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back 👋
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Here is an overview of your upcoming adventures and finances.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {[
            {
              label: "Total Trips",
              value: trips.length,
              icon: <Map className="w-5 h-5 text-teal-600" />,
              bg: "bg-teal-50",
            },
            {
              label: "Upcoming",
              value: upcomingTrips.length,
              icon: <Plane className="w-5 h-5 text-blue-600" />,
              bg: "bg-blue-50",
            },
            {
              label: "Total Budget",
              value: `₹${totalBudget.toLocaleString()}`,
              icon: <Wallet className="w-5 h-5 text-amber-600" />,
              bg: "bg-amber-50",
            },
            {
              label: "Destinations",
              value: destinations.length,
              icon: <MapPin className="w-5 h-5 text-rose-600" />,
              bg: "bg-rose-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-gray-200 rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className={`w-9 h-9 rounded-full ${stat.bg} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-12">
          {/* Budget Highlights */}
          <div className="col-span-1 border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between bg-white hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Budget Highlights
                </h2>
                <div className="w-9 h-9 rounded-full bg-[#E6F4F2] flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-[#2AB5A0]" />
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Total Spent Across Trips
              </p>
              <p className="text-[40px] font-bold text-gray-900 tracking-tight">
                ₹{totalSpend.toLocaleString()}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between text-sm font-bold mb-2">
                <span className="text-gray-700">
                  ₹{totalSpend.toLocaleString()} / ₹
                  {totalBudget > 0 ? totalBudget.toLocaleString() : "–"}
                </span>
                <span className="text-[#2AB5A0]">
                  {totalBudget > 0
                    ? `${Math.min(100, Math.round((totalSpend / totalBudget) * 100))}%`
                    : "–"}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#2AB5A0] h-full rounded-full transition-all"
                  style={{
                    width: `${totalBudget > 0 ? Math.min(100, (totalSpend / totalBudget) * 100) : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="col-span-1 xl:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Trips</h2>
              <Link
                href="/my-trips"
                className="text-sm font-bold text-[#2AB5A0] hover:text-[#1e8f7d] transition-colors"
              >
                View All
              </Link>
            </div>

            {recentTrips.length === 0 ? (
              <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 bg-gray-50/50">
                <Plane className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium mb-4">
                  No trips yet. Plan your first adventure!
                </p>
                <Link href="/trips/create">
                  <Button className="bg-[#F5A623] hover:bg-[#d98f1a] text-white font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Plan New Trip
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {recentTrips.map((trip, i) => {
                  const isUpcoming = isFuture(new Date(trip.startDate));
                  const stopCount = trip.stops?.length ?? 0;
                  return (
                    <Link href={`/trips/${trip.id}`} key={trip.id}>
                      <div
                        className={`border border-gray-200 rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col justify-between h-full ${
                          i === 0 ? "border-l-4 border-l-[#2AB5A0]" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-gray-900 text-[17px]">
                                {trip.title}
                              </h3>
                              <div className="flex items-center text-gray-500 text-xs font-medium mt-1.5 gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                  {format(new Date(trip.startDate), "MMM dd")} –{" "}
                                  {format(new Date(trip.endDate), "MMM dd, yyyy")}
                                </span>
                              </div>
                            </div>
                            {isUpcoming && (
                              <span className="px-2.5 py-1 bg-[#E6F4F2] text-[#2AB5A0] text-[10px] font-bold uppercase tracking-wider rounded-md">
                                Upcoming
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-gray-500 text-xs font-medium mb-6 gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>
                              {stopCount} Destination{stopCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-600">
                          View Itinerary
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recommended for you */}
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Recommended for you
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Popular destinations to explore
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(searchQuery ? filteredDest : destinations)
              .slice(0, 6)
              .map((dest, i) => (
                <Link
                  href={`/activities?city=${encodeURIComponent(dest.name)}&destinationId=${dest.id}`}
                  key={dest.id}
                >
                  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm group bg-white hover:shadow-md transition-all">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <img
                        src={`${dest.imageUrl}?w=600&q=80&auto=format&fit=crop`}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {i === 0 && (
                        <div className="absolute top-3 left-3 bg-[#F5A623] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          Top Pick
                        </div>
                      )}
                      {i === 1 && (
                        <div className="absolute top-3 left-3 bg-teal-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                          Trending
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-white/95 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-bold shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                        4.{(7 + i) % 10}
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 text-[17px]">
                          {dest.name}
                        </span>
                        <p className="text-xs text-gray-500">
                          {dest.region} · {dest.costIndex}
                        </p>
                      </div>
                      <span className="text-[#2AB5A0] border border-[#2AB5A0]/30 hover:bg-[#E6F4F2] h-8 rounded-full px-4 font-bold text-xs flex items-center gap-1 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                        Explore
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
