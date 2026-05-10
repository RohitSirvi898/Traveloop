"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, MapPin, Star, DollarSign, ArrowLeft,
  Plus, X, Calendar, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type GlobalActivity = { id: string; title: string; type: string };
type Destination = {
  id: string;
  name: string;
  region: string;
  description: string;
  imageUrl: string;
  costIndex: string;
  dailyBudget: number;
  activities: GlobalActivity[];
};

const REGIONS = ["All Regions", "North India", "South India", "Coastal", "Mountainous", "International"];
const REGION_MAP: Record<string, string[]> = {
  "North India": ["Delhi", "Jaipur", "Agra", "Varanasi", "Amritsar"],
  "South India": ["Kochi", "Chennai", "Bengaluru", "Hyderabad"],
  "Coastal": ["Mumbai", "Goa", "Kochi", "Pondicherry"],
  "Mountainous": ["Shimla", "Manali", "Darjeeling"],
  "International": [],
};

// Add Stop Modal
function AddStopModal({
  destination,
  tripId,
  onClose,
  onAdded,
}: {
  destination: Destination;
  tripId: string;
  onClose: () => void;
  onAdded: (stop: any) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!startDate || !endDate) return toast.error("Please pick dates.");
    if (endDate < startDate) return toast.error("End date must be after start date.");
    setLoading(true);
    try {
      const res = await fetch("/api/stops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          cityName: destination.name,
          startDate,
          endDate,
          budget: destination.dailyBudget,
        }),
      });
      if (!res.ok) throw new Error();
      const { stop } = await res.json();
      toast.success(`${destination.name} added to your trip!`);
      onAdded(stop);
      onClose();
    } catch {
      toast.error("Failed to add stop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="relative h-40 overflow-hidden">
          <img
            src={`${destination.imageUrl}?w=600&q=80`}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-xl font-bold">{destination.name}</h3>
            <p className="text-sm opacity-80 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {destination.region}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 rounded-full p-1.5 text-white hover:bg-black/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 font-medium">When are you visiting?</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Check In</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Check Out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Trip"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("All Regions");
  const [activeTab, setActiveTab] = useState<"Cities" | "Activities">("Cities");
  const [modalDest, setModalDest] = useState<Destination | null>(null);
  const [addedStops, setAddedStops] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDestinations(data);
        else console.error("Destinations API error:", data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = destinations.filter((d) => {
    const matchesQuery =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.region.toLowerCase().includes(query.toLowerCase());
    const matchesRegion =
      activeRegion === "All Regions" ||
      (REGION_MAP[activeRegion]?.includes(d.name) ?? false);
    return matchesQuery && matchesRegion;
  });

  const [featured, ...rest] = filtered;

  const handleAddToTrip = (dest: Destination) => {
    if (!tripId) {
      // Navigate to activities if no trip context
      router.push(`/activities?city=${encodeURIComponent(dest.name)}&destinationId=${dest.id}`);
      return;
    }
    setModalDest(dest);
  };

  const handleCardClick = (dest: Destination) => {
    router.push(
      `/activities?city=${encodeURIComponent(dest.name)}&destinationId=${dest.id}${tripId ? `&tripId=${tripId}` : ""}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        {tripId && (
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Explore Destinations</h1>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Tabs + Search */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(["Cities", "Activities"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Where to next?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Region Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                activeRegion === r
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`rounded-2xl bg-gray-200 animate-pulse ${i === 0 ? "md:col-span-2 h-80" : "h-64"}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <MapPin className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg">No cities found{query ? ` for "${query}"` : ""}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Featured — large card spanning 2 columns */}
            {featured && (
              <div className="md:col-span-2 relative rounded-2xl overflow-hidden shadow-md group cursor-pointer h-72">
                <img
                  src={`${featured.imageUrl}?w=900&q=80`}
                  alt={featured.name}
                  onClick={() => handleCardClick(featured)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* TOP PICK badge */}
                <div className="absolute top-4 left-4 bg-teal-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Top Pick
                </div>

                {/* Cost Index */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                  {featured.costIndex}
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs">4.9 · {featured.activities.length} activities</span>
                    </div>
                    <h2 className="text-3xl font-bold">{featured.name}</h2>
                    <p className="text-sm opacity-80 mt-0.5">{featured.description.slice(0, 60)}… · {featured.region}</p>
                  </div>
                  {tripId && (
                    <button
                      onClick={() => handleAddToTrip(featured)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition shrink-0 ${
                        addedStops.has(featured.id)
                          ? "bg-teal-500 text-white cursor-default"
                          : "bg-teal-500 hover:bg-teal-400 text-white"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      {addedStops.has(featured.id) ? "Added!" : "Add to Trip"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Right side: first small card */}
            {rest[0] && (
              <SmallCard
                dest={rest[0]}
                tripId={tripId}
                isAdded={addedStops.has(rest[0].id)}
                badge="Popular"
                onCardClick={handleCardClick}
                onAddToTrip={handleAddToTrip}
              />
            )}

            {/* Bottom row */}
            {rest.slice(1).map((dest, i) => (
              <SmallCard
                key={dest.id}
                dest={dest}
                tripId={tripId}
                isAdded={addedStops.has(dest.id)}
                badge={i === 1 ? "Trending" : undefined}
                onCardClick={handleCardClick}
                onAddToTrip={handleAddToTrip}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Stop Modal */}
      {modalDest && tripId && (
        <AddStopModal
          destination={modalDest}
          tripId={tripId}
          onClose={() => setModalDest(null)}
          onAdded={(stop) => setAddedStops((prev) => new Set([...prev, modalDest.id]))}
        />
      )}
    </div>
  );
}

function SmallCard({
  dest,
  tripId,
  isAdded,
  badge,
  onCardClick,
  onAddToTrip,
}: {
  dest: Destination;
  tripId: string | null;
  isAdded: boolean;
  badge?: string;
  onCardClick: (d: Destination) => void;
  onAddToTrip: (d: Destination) => void;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div
        className="relative h-36 overflow-hidden cursor-pointer group"
        onClick={() => onCardClick(dest)}
      >
        <img
          src={`${dest.imageUrl}?w=600&q=80`}
          alt={dest.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {badge && (
          <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            {badge}
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm">{dest.name}</h3>
          <div className="flex items-center gap-0.5 text-xs text-gray-500 shrink-0">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>4.{Math.floor(Math.random() * 3) + 5}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-0.5">{dest.description.slice(0, 35)}…</p>
        <p className="text-xs text-gray-400 mb-3">Cost: {dest.costIndex}</p>
        {tripId ? (
          <button
            onClick={() => onAddToTrip(dest)}
            className={`w-full py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition ${
              isAdded
                ? "bg-teal-50 border-teal-200 text-teal-600 cursor-default"
                : "border-gray-200 text-gray-700 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            {isAdded ? "Added to Trip" : "Add to Trip"}
          </button>
        ) : (
          <button
            onClick={() => onCardClick(dest)}
            className="w-full py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition flex items-center justify-center gap-1"
          >
            View Activities
          </button>
        )}
      </div>
    </div>
  );
}
