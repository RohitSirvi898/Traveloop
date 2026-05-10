"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

interface TripCardProps {
  id: string;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  status: "Upcoming" | "Past" | "Shared";
}

export function TripCard({
  id,
  name,
  image,
  startDate,
  endDate,
  destinations,
  status,
}: TripCardProps) {
  const statusColors = {
    Upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Past: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    Shared: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-800">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-200">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          {name}
        </h3>

        {/* Date Range */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          {startDate} – {endDate}
        </p>

        {/* Destinations */}
        <div className="flex flex-wrap gap-2 mb-4">
          {destinations.map((destination, index) => (
            <span
              key={index}
              className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded"
            >
              {destination}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Eye size={16} />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Edit size={16} />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
