import { getFullItinerary } from "@/lib/actions";
import { format } from "date-fns";

export default async function TripViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getFullItinerary(id);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{format(new Date(trip.startDate), "MMM dd")} – {format(new Date(trip.endDate), "MMM dd, yyyy")}</p>
          {trip.description ? <p className="mt-3 text-sm text-gray-700">{trip.description}</p> : null}
        </div>

        <div className="mt-6 space-y-6">
          {trip.stops.map((stop: any) => (
            <div key={stop.id} className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{stop.cityName}</h2>
                  <p className="text-xs text-gray-500">{format(new Date(stop.startDate), "MMM dd")} – {format(new Date(stop.endDate), "MMM dd")}</p>
                </div>
                <div className="text-sm text-gray-600">{stop.activities.length} activities</div>
              </div>

              <div className="mt-4 space-y-3">
                {stop.activities.map((a: any) => (
                  <div key={a.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{a.title}</div>
                        {a.description ? <div className="text-xs text-gray-500">{a.description}</div> : null}
                      </div>
                      <div className="text-xs text-gray-600">{format(new Date(a.startTime), "hh:mm a")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
