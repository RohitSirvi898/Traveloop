"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, Camera, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function CreateTripPage() {
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverPreviewUrl]);

  const canSubmit = useMemo(() => {
    return tripName.trim().length > 0 && startDate.length > 0 && endDate.length > 0;
  }, [tripName, startDate, endDate]);

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Please upload a PNG, JPG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }

    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setCoverPhoto(file);
    setCoverPreviewUrl(previewUrl);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast.success("Trip details saved. Next step can connect to backend later.");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-44 h-44 w-44 rounded-full bg-teal-100/70 blur-[1px]" />
        <div className="absolute -right-16 top-80 h-52 w-52 rounded-full bg-slate-200/75" />
        <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-r from-teal-100/60 via-cyan-50/40 to-teal-100/60" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-7 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-xl font-semibold tracking-tight text-teal-700">Traveloop</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-14 rounded-full bg-teal-700" />
            <span className="h-1.5 w-14 rounded-full bg-teal-300" />
            <span className="h-1.5 w-14 rounded-full bg-teal-200" />
          </div>
        </div>

        <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/70 backdrop-blur-sm sm:p-8">
          <header className="mb-7 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Start your adventure</h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Fill in the details below to begin planning your next great escape.
            </p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="tripName" className="text-sm font-medium text-slate-700">
                Trip Name
              </label>
              <input
                id="tripName"
                name="tripName"
                value={tripName}
                onChange={(event) => setTripName(event.target.value)}
                placeholder="e.g., Summer in Santorini"
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium text-slate-700">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium text-slate-700">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-700">
                Trip Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What are you most excited about for this trip?"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Cover Photo (Optional)</p>
              <label
                htmlFor="coverPhoto"
                className="flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-5 text-center transition hover:border-teal-400 hover:bg-teal-50/50"
              >
                {coverPreviewUrl ? (
                  <img
                    src={coverPreviewUrl}
                    alt="Trip cover preview"
                    className="mb-3 h-28 w-full max-w-xs rounded-lg object-cover"
                  />
                ) : (
                  <span className="mb-3 rounded-full bg-teal-100 p-3 text-teal-700">
                    <Camera className="size-5" />
                  </span>
                )}

                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">
                    {coverPhoto ? `Selected: ${coverPhoto.name}` : "Click or drag photo to upload"}
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG or WEBP (Max. 5MB)</p>
                </div>

                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-teal-700">
                  <Upload className="size-3.5" />
                  Choose image
                </span>
              </label>
              <input
                id="coverPhoto"
                name="coverPhoto"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleCoverChange}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit}
              className="h-12 w-full rounded-xl bg-teal-700 text-base font-semibold text-white hover:bg-teal-800"
            >
              Save & Continue <ArrowRight className="size-4" />
            </Button>

            <p className="text-center text-xs text-slate-500">Step 1 of 3: Core Details</p>
          </form>
        </section>
      </main>
    </div>
  );
}
