"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import {
  Calendar, MapPin, Share2, Plus, LayoutList,
  Car, Bed, Landmark, PlusCircle, MoreHorizontal, Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Activity = {
  id: string;
  title: string;
  description?: string | null;
  cost: number;
  type: string;
  startTime: string | Date;
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
  startDate: string | Date;
  endDate: string | Date;
  stops: Stop[];
};

// Group activities by day index relative to stop start date
function groupByDay(stop: Stop): { dayNum: number; date: Date; activities: Activity[] }[] {
  const start = new Date(stop.startDate);
  const end = new Date(stop.endDate);
  const numDays = Math.max(1, differenceInDays(end, start));

  return Array.from({ length: numDays }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      dayNum: i + 1,
      date,
      activities: stop.activities.filter((a) => {
        const aDate = new Date(a.startTime);
        return aDate.toDateString() === date.toDateString();
      }),
    };
  });
}

export default function ItineraryBuilderClient({ trip: initialTrip }: { trip: Trip }) {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip>(initialTrip);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(
    initialTrip.stops[0]?.id || null
  );

  const selectedStop = trip.stops.find((s) => s.id === selectedStopId);
  const days = selectedStop ? groupByDay(selectedStop) : [];

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA]">
      {/* ─── Top Header ─── */}
      <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-gray-900">{trip.title}</h1>
          <p className="text-xs text-gray-500">
            {format(new Date(trip.startDate), "MMM dd")} –{" "}
            {format(new Date(trip.endDate), "MMM dd, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-1 rounded-lg flex items-center">
            <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-sm font-medium text-teal-700 flex items-center gap-2">
              <LayoutList className="w-4 h-4" />
              Timeline View
            </button>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar View
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Layout ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─── Stops Sidebar ─── */}
        <div className="w-72 bg-[#F8F9FA] border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Stops</h2>
            <Link
              href={`/explore?tripId=${trip.id}`}
              className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Stop
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {trip.stops.map((stop) => {
              const nights = differenceInDays(
                new Date(stop.endDate),
                new Date(stop.startDate)
              );
              const isSelected = stop.id === selectedStopId;
              return (
                <div
                  key={stop.id}
                  onClick={() => setSelectedStopId(stop.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? "bg-white border-teal-500 shadow-sm ring-1 ring-teal-500"
                      : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-gray-900 text-sm">{stop.cityName}</h3>
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-800 text-[10px] font-bold"
                    >
                      {nights} NIGHTS
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {format(new Date(stop.startDate), "MMM dd")} –{" "}
                    {format(new Date(stop.endDate), "MMM dd")}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {stop.activities.length} activit{stop.activities.length === 1 ? "y" : "ies"}
                  </p>
                </div>
              );
            })}

            {/* Add Stop CTA */}
            <Link href={`/explore?tripId=${trip.id}`} className="block mt-2">
              <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:text-teal-600 hover:border-teal-400 hover:bg-teal-50 transition cursor-pointer">
                <Plus className="w-5 h-5 mr-2" />
                <span className="font-medium text-sm">Add Stop</span>
              </div>
            </Link>
          </div>
        </div>

        {/* ─── Itinerary Panel ─── */}
        <div className="flex-1 overflow-y-auto bg-white">
          {selectedStop ? (
            <div className="max-w-4xl mx-auto p-8">
              {/* Stop Header */}
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                    {selectedStop.cityName} Schedule
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 gap-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(selectedStop.startDate), "MMM dd")} –{" "}
                      {format(new Date(selectedStop.endDate), "MMM dd")}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-medium text-amber-600">
                      <Banknote className="w-4 h-4" />
                      Budget: ₹{selectedStop.budget ?? 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                  <Button className="bg-teal-700 hover:bg-teal-800 text-white">
                    Save Draft
                  </Button>
                </div>
              </div>

              {/* Day-by-day Timeline */}
              <div className="space-y-10">
                {days.map(({ dayNum, date, activities }) => (
                  <div key={dayNum} className="relative">
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center border-4 border-white shadow-sm z-10">
                          <div className="w-3 h-3 rounded-full bg-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Day {dayNum}
                          </h3>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {format(date, "EEEE, MMM dd")}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/activities?city=${encodeURIComponent(selectedStop.cityName)}&stopId=${selectedStop.id}&tripId=${trip.id}`}
                        className="text-sm font-medium text-gray-500 hover:text-teal-600 flex items-center gap-1 transition"
                      >
                        <Plus className="w-4 h-4" /> Add Activity
                      </Link>
                    </div>

                    {/* Activity Cards */}
                    <div className="ml-12 space-y-3">
                      {activities.length > 0 ? (
                        activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-start gap-4 hover:shadow-md transition"
                          >
                            <div className="bg-teal-50 text-teal-700 p-3 rounded-lg mt-0.5 shrink-0">
                              {activity.type === "TRANSPORT" ? (
                                <Car className="w-5 h-5" />
                              ) : activity.type === "LODGING" ? (
                                <Bed className="w-5 h-5" />
                              ) : (
                                <Landmark className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase shrink-0"
                                >
                                  {activity.type}
                                </Badge>
                              </div>
                              {activity.description && (
                                <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {format(new Date(activity.startTime), "hh:mm a")}
                                </span>
                                <span className="flex items-center gap-1.5 text-amber-600">
                                  <Banknote className="w-3.5 h-3.5" />
                                  {activity.cost === 0 ? "Free" : `₹${activity.cost}`}
                                </span>
                              </div>
                            </div>
                            <button className="text-gray-300 hover:text-gray-600 transition shrink-0">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center bg-gray-50/50">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                            <PlusCircle className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-sm mb-4">
                            Start planning Day {dayNum}…
                          </p>
                          <Link
                            href={`/activities?city=${encodeURIComponent(selectedStop.cityName)}&stopId=${selectedStop.id}&tripId=${trip.id}`}
                          >
                            <Button
                              variant="secondary"
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
                            >
                              Browse Activities
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <MapPin className="w-14 h-14 text-gray-200 mb-4" />
              <p className="text-lg font-medium text-gray-500">Select or add a stop to view itinerary</p>
              <Link href={`/explore?tripId=${trip.id}`} className="mt-4">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Your First Stop
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
