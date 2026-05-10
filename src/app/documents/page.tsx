"use client";

import { useEffect, useState } from "react";
import { Search, Bell, Trash2, Edit2, Plus, X } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  tripId: string;
  title: string;
  locationTag: string | null;
  content: string;
  date: string;
}

interface Trip {
  id: string;
  title: string;
}

export default function Documents() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTripFilter, setSelectedTripFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    locationTag: "",
    content: "",
    tripId: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load trips and notes on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load trips
        const tripsRes = await fetch("/api/trips");
        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          setTrips(tripsData.trips || []);
        }

        // Load notes
        const notesRes = await fetch("/api/notes");
        if (notesRes.ok) {
          const notesData = await notesRes.json();
          const sortedNotes = (notesData.notes || []).sort(
            (a: Note, b: Note) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setNotes(sortedNotes);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.locationTag?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesTrip = selectedTripFilter === "all" || note.tripId === selectedTripFilter;

    return matchesSearch && matchesTrip;
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.tripId) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editingNote) {
        // Update note
        const res = await fetch(`/api/notes/${editingNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            locationTag: formData.locationTag || null,
            content: formData.content,
          }),
        });

        if (res.ok) {
          const updatedNote = await res.json();
          setNotes(
            notes
              .map((n) => (n.id === editingNote.id ? updatedNote.note : n))
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          );
        }
      } else {
        // Create new note
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const { note } = await res.json();
          setNotes(
            [...notes, note].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          );
        }
      }

      // Reset form
      setFormData({ title: "", locationTag: "", content: "", tripId: "" });
      setEditingNote(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });

      if (res.ok) {
        setNotes(notes.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    }
  };

  // Handle edit
  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      locationTag: note.locationTag || "",
      content: note.content,
      tripId: note.tripId,
    });
    setIsModalOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setFormData({ title: "", locationTag: "", content: "", tripId: "" });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  const getTripName = (tripId: string) => {
    return trips.find((t) => t.id === tripId)?.title || "Unknown Trip";
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-40 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documents</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Write and save notes or reminders tied to your trips
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
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search notes by title, content, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  <Plus size={18} />
                  Add Note
                </button>
              </div>

              {/* Trip Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedTripFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedTripFilter === "all"
                      ? "bg-teal-600 text-white"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500"
                  }`}
                >
                  All Trips
                </button>
                {trips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTripFilter(trip.id)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedTripFilter === trip.id
                        ? "bg-teal-600 text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500"
                    }`}
                  >
                    {trip.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-slate-600 dark:text-slate-400">Loading notes...</p>
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {note.title}
                          </h3>
                          {note.locationTag && (
                            <span className="px-2 py-1 text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded">
                              {note.locationTag}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                          <span>{getTripName(note.tripId)}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(note.date)}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {note.content}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(note)}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit note"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {searchTerm ? "No notes found matching your search." : "No notes yet. Create your first note!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingNote ? "Edit Note" : "Add New Note"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Trip Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Trip *
                </label>
                {trips.length === 0 ? (
                  <div className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm">
                    <p>No trips available. Please create a trip first from <span className="font-medium">My Trips</span> to add notes.</p>
                  </div>
                ) : (
                  <select
                    value={formData.tripId}
                    onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                    disabled={!!editingNote}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                  >
                    <option value="">Select a trip</option>
                    {trips.map((trip) => (
                      <option key={trip.id} value={trip.id}>
                        {trip.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Hotel Check-in Details"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Location Tag */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.locationTag}
                  onChange={(e) => setFormData({ ...formData, locationTag: e.target.value })}
                  placeholder="e.g., Mumbai, Surat"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Note Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your note here... (hotel details, contacts, reminders, etc.)"
                  rows={8}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  {editingNote ? "Update Note" : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
