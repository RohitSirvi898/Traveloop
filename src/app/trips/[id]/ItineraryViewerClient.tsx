"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, differenceInDays, eachDayOfInterval } from "date-fns";
import {
  Calendar,
  MapPin,
  Clock,
  Banknote,
  Car,
  Bed,
  Landmark,
  Utensils,
  Camera,
  TreePine,
  Music,
  Bus,
  ArrowLeft,
  Share2,
  Edit3,
  ChevronRight,
  Globe,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────
type Activity = {
  id: string;
  title: string;
  description?: string | null;
  cost: number;
  type: string;
  startTime: string | Date;
  endTime?: string | Date | null;
};

type Stop = {
  id: string;
  cityName: string;
  startDate: string | Date;
  endDate: string | Date;
  budget?: number | null;
  activities: Activity[];
};

type Trip = {
  id: string;
  title: string;
  description?: string | null;
  startDate: string | Date;
  endDate: string | Date;
  coverImage?: string | null;
  totalBudget?: number | null;
  stops: Stop[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  CULTURE:       <Landmark className="w-4 h-4" />,
  FOOD:          <Utensils className="w-4 h-4" />,
  SCENIC:        <Camera className="w-4 h-4" />,
  TRANSPORT:     <Bus className="w-4 h-4" />,
  LODGING:       <Bed className="w-4 h-4" />,
  ACTIVITY:      <TreePine className="w-4 h-4" />,
  ENTERTAINMENT: <Music className="w-4 h-4" />,
};

const ACTIVITY_COLORS: Record<string, { bg: string; text: string; border: string; pill: string }> = {
  CULTURE:       { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200", pill: "bg-purple-100 text-purple-700" },
  FOOD:          { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200", pill: "bg-orange-100 text-orange-700" },
  SCENIC:        { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",    pill: "bg-sky-100 text-sky-700" },
  TRANSPORT:     { bg: "bg-slate-50",   text: "text-slate-600",   border: "border-slate-200",  pill: "bg-slate-100 text-slate-600" },
  LODGING:       { bg: "bg-indigo-50",  text: "text-indigo-700",  border: "border-indigo-200", pill: "bg-indigo-100 text-indigo-700" },
  ACTIVITY:      { bg: "bg-green-50",   text: "text-green-700",   border: "border-green-200",  pill: "bg-green-100 text-green-700" },
  ENTERTAINMENT: { bg: "bg-pink-50",    text: "text-pink-700",    border: "border-pink-200",   pill: "bg-pink-100 text-pink-700" },
};

function getColors(type: string) {
  return ACTIVITY_COLORS[type] ?? ACTIVITY_COLORS.ACTIVITY;
}

function getIcon(type: string): React.ReactNode {
  return ACTIVITY_ICONS[type] ?? <Landmark className="w-4 h-4" />;
}

function getTimeOfDay(date: Date): "morning" | "afternoon" | "evening" | "night" {
  const h = date.getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 20) return "evening";
  return "night";
}

const TOD_ICONS = {
  morning:   <Sunrise className="w-3.5 h-3.5 text-amber-500" />,
  afternoon: <Sun className="w-3.5 h-3.5 text-orange-500" />,
  evening:   <Sunset className="w-3.5 h-3.5 text-rose-500" />,
  night:     <Moon className="w-3.5 h-3.5 text-indigo-500" />,
};

/** Given a stop, compute all calendar days within [startDate, endDate) and
 *  attach activities that fall on each day. */
function buildDays(stop: Stop) {
  const start = new Date(stop.startDate);
  const end   = new Date(stop.endDate);
  const days  = eachDayOfInterval({ start, end: end > start ? end : start });

  return days.map((date, i) => {
    const acts = stop.activities.filter((a) => {
      const aDate = new Date(a.startTime);
      return aDate.toDateString() === date.toDateString();
    });
    return { dayIndex: i + 1, date, activities: acts };
  });
}

/** Total spend across all activities in all stops. */
function computeTotalSpend(stops: Stop[]) {
  return stops.reduce(
    (acc, s) => acc + s.activities.reduce((a, act) => a + act.cost, 0),
    0
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActivityCard({ activity }: { activity: Activity }) {
  const c   = getColors(activity.type);
  const icon = getIcon(activity.type);
  const startDt = new Date(activity.startTime);
  const endDt   = activity.endTime ? new Date(activity.endTime) : null;
  const tod     = getTimeOfDay(startDt);

  return (
    <div className="group relative flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200">
      {/* Type Icon */}
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${c.bg} ${c.text} ${c.border}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold text-gray-900 text-sm leading-snug">{activity.title}</h4>
          <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${c.pill}`}>
            {activity.type}
          </span>
        </div>

        {activity.description && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{activity.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {/* Time */}
          <span className="flex items-center gap-1 text-xs text-gray-500">
            {TOD_ICONS[tod]}
            {format(startDt, "hh:mm a")}
            {endDt && ` – ${format(endDt, "hh:mm a")}`}
          </span>

          {/* Cost */}
          <span className={`flex items-center gap-1 text-xs font-semibold ${activity.cost === 0 ? "text-green-600" : "text-amber-600"}`}>
            <Banknote className="w-3.5 h-3.5" />
            {activity.cost === 0 ? "Free" : `₹${activity.cost.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>
  );
}

function DaySection({
  dayIndex,
  date,
  activities,
  globalDayNum,
  stop,
  tripId,
}: {
  dayIndex: number;
  date: Date;
  activities: Activity[];
  globalDayNum: number;
  stop: Stop;
  tripId: string;
  isPublicView?: boolean;
}) {
  const totalCost = activities.reduce((a, act) => a + act.cost, 0);
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <div className="relative">
      {/* Day Header */}
      <div className="flex items-center gap-4 mb-4">
        {/* Day badge + timeline dot */}
        <div className="relative flex flex-col items-center shrink-0">
          <div
            className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm border ${
              isToday
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            <span className="text-[10px] font-semibold uppercase leading-none opacity-70">
              {format(date, "EEE")}
            </span>
            <span className="text-lg leading-none">{format(date, "d")}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 text-base">
              Day {globalDayNum}
              {isToday && (
                <span className="ml-2 text-[11px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Today
                </span>
              )}
            </h3>
            <span className="text-sm text-gray-500">{format(date, "MMMM dd, yyyy")}</span>
          </div>

          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-400">
              {activities.length} activit{activities.length === 1 ? "y" : "ies"}
            </span>
            {totalCost > 0 && (
              <span className="text-xs text-amber-600 font-medium">
                ₹{totalCost.toLocaleString()} planned
              </span>
            )}
          </div>
        </div>

        {/* Add activity link */}
        {!isPublicView && (
          <Link
            href={`/activities?city=${encodeURIComponent(stop.cityName)}&stopId=${stop.id}&tripId=${tripId}`}
            className="shrink-0 flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-full border border-teal-200 transition"
          >
            + Add
          </Link>
        )}
      </div>

      {/* Activities */}
      <div className="ml-16 space-y-3">
        {activities.length > 0 ? (
          activities.map((act) => <ActivityCard key={act.id} activity={act} />)
        ) : (
          <div className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/60 text-gray-400">
            <AlertCircle className="w-5 h-5 shrink-0 text-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-500">Nothing planned yet</p>
              <p className="text-xs">
                <Link
                  href={`/activities?city=${encodeURIComponent(stop.cityName)}&stopId=${stop.id}&tripId=${tripId}`}
                  className="text-teal-600 hover:underline font-medium"
                >
                  Browse activities
                </Link>{" "}
                for {stop.cityName}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StopPanel({ stop, tripId, globalStartDay, isPublicView }: { stop: Stop; tripId: string; globalStartDay: number; isPublicView?: boolean }) {
  const days = buildDays(stop);
  const stopTotalCost = stop.activities.reduce((a, act) => a + act.cost, 0);
  const nights = Math.max(0, differenceInDays(new Date(stop.endDate), new Date(stop.startDate)));
  const completedDays = days.filter((d) => d.activities.length > 0).length;

  return (
    <div className="space-y-8">
      {/* Stop summary card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 to-teal-900 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-teal-300" />
              <span className="text-teal-300 text-xs font-semibold uppercase tracking-wider">Current Stop</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{stop.cityName}</h2>
            <p className="text-teal-200 text-sm">
              {format(new Date(stop.startDate), "MMM dd")} – {format(new Date(stop.endDate), "MMM dd, yyyy")}
              <span className="ml-2 opacity-60">· {nights} night{nights !== 1 ? "s" : ""}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
              <p className="text-[10px] text-teal-300 uppercase tracking-wider font-semibold">Budget</p>
              <p className="text-lg font-bold">₹{(stop.budget ?? 0).toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2">
              <p className="text-[10px] text-teal-300 uppercase tracking-wider font-semibold">Spent</p>
              <p className="text-lg font-bold">₹{stopTotalCost.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-teal-300 font-medium">{completedDays}/{days.length} days planned</span>
            <span className="text-xs text-teal-300">{Math.round((completedDays / Math.max(days.length, 1)) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-300 rounded-full transition-all duration-500"
              style={{ width: `${(completedDays / Math.max(days.length, 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Day-by-day sections */}
      <div className="space-y-10">
        {days.map(({ dayIndex, date, activities }) => (
          <DaySection
            key={dayIndex}
            dayIndex={dayIndex}
            date={date}
            activities={activities}
            globalDayNum={globalStartDay + dayIndex - 1}
            stop={stop}
            tripId={tripId}
            isPublicView={isPublicView}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ItineraryViewerClient({ trip, isPublicView = false }: { trip: Trip; isPublicView?: boolean }) {
  const [selectedStopId, setSelectedStopId] = useState<string>(
    trip.stops[0]?.id ?? ""
  );

  const totalDays = useMemo(
    () => Math.max(1, differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1),
    [trip.startDate, trip.endDate]
  );

  const totalActivities = useMemo(
    () => trip.stops.reduce((a, s) => a + s.activities.length, 0),
    [trip.stops]
  );

  const totalSpend = useMemo(() => computeTotalSpend(trip.stops), [trip.stops]);

  const selectedStop = trip.stops.find((s) => s.id === selectedStopId);

  /** Compute the global Day number where each stop starts */
  const stopStartDays = useMemo(() => {
    const tripStart = new Date(trip.startDate);
    const map: Record<string, number> = {};
    trip.stops.forEach((s) => {
      const dayNum = differenceInDays(new Date(s.startDate), tripStart) + 1;
      map[s.id] = Math.max(1, dayNum);
    });
    return map;
  }, [trip.stops, trip.startDate]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* ── Hero Header ── */}
      <div className="relative bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Link
                href="/my-trips"
                className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500 hover:text-gray-800"
                title="Back to My Trips"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600" />
                  <span className="text-xs text-teal-600 font-semibold uppercase tracking-wider">Itinerary</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mt-0.5">{trip.title}</h1>
                <p className="text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  {format(new Date(trip.startDate), "MMM dd")} – {format(new Date(trip.endDate), "MMM dd, yyyy")}
                  <span className="mx-2 opacity-40">·</span>
                  {totalDays} day{totalDays !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Right Actions */}
            {!isPublicView && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/trips/${trip.id}/checklist`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
                >
                  <Package className="w-4 h-4" />
                  Packing List
                </Link>
                <Link
                  href={`/trips/${trip.id}/build`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Plan
                </Link>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/shared/${trip.id}`);
                    toast.success("Public link copied to clipboard!");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium transition shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            )}
          </div>

          {/* ── Trip Stats Bar ── */}
          <div className="flex flex-wrap gap-4 mt-5">
            {[
              {
                label: "Destinations",
                value: trip.stops.length,
                icon: <MapPin className="w-4 h-4 text-teal-500" />,
              },
              {
                label: "Total Days",
                value: totalDays,
                icon: <Calendar className="w-4 h-4 text-blue-500" />,
              },
              {
                label: "Activities",
                value: totalActivities,
                icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
              },
              {
                label: "Total Spend",
                value: `₹${totalSpend.toLocaleString()}`,
                icon: <Banknote className="w-4 h-4 text-amber-500" />,
              },
              ...(trip.totalBudget
                ? [
                    {
                      label: "Budget",
                      value: `₹${trip.totalBudget.toLocaleString()}`,
                      icon: <Banknote className="w-4 h-4 text-teal-500" />,
                    },
                  ]
                : []),
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100"
              >
                {stat.icon}
                <div>
                  <p className="text-[11px] text-gray-400 font-medium leading-none">{stat.label}</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* ── Left: Stops Nav ── */}
        <aside className="w-64 shrink-0 space-y-3 sticky top-6 self-start hidden lg:block">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1 mb-4">Stops</h2>
          {trip.stops.map((stop) => {
            const nights = differenceInDays(new Date(stop.endDate), new Date(stop.startDate));
            const isSelected = stop.id === selectedStopId;
            const acts = stop.activities.length;
            const globalDay = stopStartDays[stop.id] ?? 1;

            return (
              <button
                key={stop.id}
                onClick={() => setSelectedStopId(stop.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? "bg-white border-teal-500 shadow-md ring-1 ring-teal-400/30"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <h3 className={`font-semibold text-sm leading-tight ${isSelected ? "text-teal-800" : "text-gray-900"}`}>
                    {stop.cityName}
                  </h3>
                  {isSelected && <ChevronRight className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Day {globalDay} · {nights} night{nights !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    acts > 0
                      ? "bg-teal-100 text-teal-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {acts} activit{acts !== 1 ? "ies" : "y"}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Quick link to builder */}
          {!isPublicView && (
            <Link
              href={`/trips/${trip.id}/build`}
              className="flex items-center justify-center gap-2 w-full mt-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50 transition text-sm font-medium"
            >
              + Add Stop
            </Link>
          )}
        </aside>

        {/* ── Right: Itinerary Detail ── */}
        <main className="flex-1 min-w-0">
          {/* Mobile stop selector */}
          <div className="lg:hidden mb-6">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Stop</label>
            <select
              value={selectedStopId}
              onChange={(e) => setSelectedStopId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {trip.stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.cityName} – Day {stopStartDays[s.id] ?? 1}
                </option>
              ))}
            </select>
          </div>

          {selectedStop ? (
            <StopPanel
              stop={selectedStop}
              tripId={trip.id}
              globalStartDay={stopStartDays[selectedStop.id] ?? 1}
              isPublicView={isPublicView}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <MapPin className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No stops added yet</h3>
              <p className="text-gray-400 text-sm mb-6">Start planning your trip by adding destinations.</p>
              <Link
                href={`/trips/${trip.id}/build`}
                className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition shadow-sm"
              >
                Open Itinerary Builder
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
