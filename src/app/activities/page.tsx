"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Clock, DollarSign, Plus, CheckCircle2,
  Landmark, Utensils, Camera, Bus, Music, TreePine,
  MapPin, Star, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type GlobalActivity = {
  id: string;
  title: string;
  type: string;
  duration: string;
  estimatedCost: number;
};

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

const ICON_MAP: Record<string, React.ReactNode> = {
  CULTURE: <Landmark className="w-5 h-5" />,
  FOOD: <Utensils className="w-5 h-5" />,
  SCENIC: <Camera className="w-5 h-5" />,
  TRANSPORT: <Bus className="w-5 h-5" />,
  ACTIVITY: <TreePine className="w-5 h-5" />,
  ENTERTAINMENT: <Music className="w-5 h-5" />,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  CULTURE: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  FOOD: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  SCENIC: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  TRANSPORT: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
  ACTIVITY: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  ENTERTAINMENT: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
};

function getColor(type: string) {
  return COLOR_MAP[type] ?? COLOR_MAP.ACTIVITY;
}

export default function ActivitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityName = searchParams.get("city") ?? "";
  const destinationId = searchParams.get("destinationId");
  const stopId = searchParams.get("stopId");
  const tripId = searchParams.get("tripId");

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        if (destinationId) {
          const res = await fetch(`/api/destinations/${destinationId}`);
          setDestination(await res.json());
        } else {
          const res = await fetch("/api/destinations");
          const all: Destination[] = await res.json();
          setDestination(all.find((d) => d.name.toLowerCase() === cityName.toLowerCase()) ?? null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [destinationId, cityName]);

  const activityTypes = destination
    ? ["All", ...Array.from(new Set(destination.activities.map((a) => a.type)))]
    : ["All"];

  const filtered =
    destination?.activities.filter(
      (a) => activeFilter === "All" || a.type === activeFilter
    ) ?? [];

  const handleAdd = async (activity: GlobalActivity) => {
    if (!stopId) {
      toast.error("No stop linked — go back and select a stop first.");
      return;
    }
    setAdding(activity.id);
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stopId,
          title: activity.title,
          type: activity.type,
          cost: activity.estimatedCost,
          description: `${activity.duration} · ${activity.type}`,
          startTime: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error();
      setAdded((prev) => new Set([...prev, activity.id]));
      toast.success(`"${activity.title}" added!`);
    } catch {
      toast.error("Failed to add activity.");
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Sticky header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">
            {destination?.name ?? cityName}
          </h1>
          <p className="text-xs text-gray-500">
            {destination?.region} · {destination?.costIndex} · ~₹{destination?.dailyBudget}/day
          </p>
        </div>
        {stopId && added.size > 0 && (
          <button
            onClick={() => router.back()}
            className="text-sm font-semibold text-teal-600 hover:underline"
          >
            Done ({added.size} added)
          </button>
        )}
      </div>

      {/* Hero Banner */}
      {destination && (
        <div className="relative h-56 overflow-hidden">
          <img
            src={`${destination.imageUrl}?w=1200&q=80`}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-black/10" />
          <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">4.8 · {destination.activities.length} curated activities</span>
              </div>
              <h2 className="text-3xl font-bold">{destination.name}</h2>
              <p className="text-sm opacity-80 mt-1 max-w-lg line-clamp-2">{destination.description}</p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <span className="bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-full">
                {destination.costIndex}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/80 bg-black/30 px-2 py-1 rounded-full">
                <MapPin className="w-3 h-3" /> {destination.region}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && destination && (
        <div className="px-6 py-4 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-100 bg-white">
          {activityTypes.map((type) => {
            const c = type === "All" ? null : getColor(type);
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition ${
                  activeFilter === type
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6 max-w-3xl mx-auto">
        {!stopId && (
          <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            Browsing only — link a stop to add activities to your itinerary.
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <Landmark className="w-12 h-12 mb-3 text-gray-300" />
            <p>No activities in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((activity) => {
              const isAdded = added.has(activity.id);
              const isAdding = adding === activity.id;
              const c = getColor(activity.type);
              const icon = ICON_MAP[activity.type] ?? <Landmark className="w-5 h-5" />;

              return (
                <div
                  key={activity.id}
                  className={`bg-white border rounded-2xl p-4 shadow-sm flex items-center gap-4 transition ${
                    isAdded ? "border-teal-200 bg-teal-50/30" : "border-gray-100 hover:shadow-md"
                  }`}
                >
                  {/* Icon */}
                  <div className={`p-3 rounded-xl border shrink-0 ${c.bg} ${c.text} ${c.border}`}>
                    {icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm leading-snug">{activity.title}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${c.bg} ${c.text} ${c.border}`}>
                        {activity.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {activity.duration}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-amber-600">
                        <DollarSign className="w-3.5 h-3.5" />
                        {activity.estimatedCost === 0 ? "Free" : `₹${activity.estimatedCost}`}
                      </span>
                    </div>
                  </div>

                  {/* Add Button */}
                  {stopId && (
                    <button
                      onClick={() => !isAdded && handleAdd(activity)}
                      disabled={isAdded || isAdding}
                      className="shrink-0 ml-1"
                      title={isAdded ? "Already added" : "Add to itinerary"}
                    >
                      {isAdded ? (
                        <CheckCircle2 className="w-9 h-9 text-teal-500" />
                      ) : isAdding ? (
                        <Loader2 className="w-9 h-9 text-gray-300 animate-spin" />
                      ) : (
                        <div className="w-9 h-9 rounded-full border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white flex items-center justify-center transition">
                          <Plus className="w-5 h-5" />
                        </div>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
