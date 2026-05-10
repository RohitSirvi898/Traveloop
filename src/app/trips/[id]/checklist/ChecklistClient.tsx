"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Check, Plus, Trash2, RotateCcw,
  Package, Shirt, FileText, Smartphone, Pill,
  Camera, ChevronDown, ChevronUp, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ChecklistItem = {
  id: string;
  category: string;
  itemName: string;
  isPacked: boolean;
};

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string }> = {
  Clothing: { icon: <Shirt className="w-4 h-4" />, color: "text-purple-600 bg-purple-50 border-purple-200" },
  Documents: { icon: <FileText className="w-4 h-4" />, color: "text-blue-600 bg-blue-50 border-blue-200" },
  Electronics: { icon: <Smartphone className="w-4 h-4" />, color: "text-amber-600 bg-amber-50 border-amber-200" },
  Toiletries: { icon: <Pill className="w-4 h-4" />, color: "text-green-600 bg-green-50 border-green-200" },
  Accessories: { icon: <Camera className="w-4 h-4" />, color: "text-pink-600 bg-pink-50 border-pink-200" },
  Miscellaneous: { icon: <Package className="w-4 h-4" />, color: "text-slate-600 bg-slate-50 border-slate-200" },
};

const CATEGORIES = Object.keys(CATEGORY_META);

export default function ChecklistClient({
  tripId,
  tripTitle,
  initialItems,
}: {
  tripId: string;
  tripTitle: string;
  initialItems: ChecklistItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState("");
  const [newCategory, setNewCategory] = useState("Clothing");
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Group items by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter((i) => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  // Also capture uncategorized
  const uncatItems = items.filter((i) => !CATEGORIES.includes(i.category));
  if (uncatItems.length > 0) grouped["Miscellaneous"] = [...(grouped["Miscellaneous"] || []), ...uncatItems];

  const total = items.length;
  const packed = items.filter((i) => i.isPacked).length;
  const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

  const handleAdd = async () => {
    if (!newItemName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          category: newCategory,
          itemName: newItemName.trim(),
        }),
      });
      if (res.ok) {
        const { item } = await res.json();
        setItems((prev) => [...prev, item]);
        setNewItemName("");
        toast.success("Item added!");
      } else {
        toast.error("Failed to add item.");
      }
    } catch {
      toast.error("Failed to add item.");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (item: ChecklistItem) => {
    const newState = !item.isPacked;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isPacked: newState } : i))
    );
    try {
      await fetch(`/api/checklist/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPacked: newState }),
      });
    } catch {
      // Revert
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPacked: !newState } : i))
      );
    }
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch(`/api/checklist/${id}`, { method: "DELETE" });
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleResetAll = async () => {
    if (!confirm("Unpack all items?")) return;
    setItems((prev) => prev.map((i) => ({ ...i, isPacked: false })));
    // Batch reset — just toggle each that was packed
    for (const item of items.filter((i) => i.isPacked)) {
      fetch(`/api/checklist/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPacked: false }),
      }).catch(() => {});
    }
    toast.success("All items unpacked.");
  };

  const toggleCollapse = (cat: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">
                Packing Checklist
              </p>
              <h1 className="text-xl font-bold text-gray-900">{tripTitle}</h1>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 font-medium">
                  {packed} of {total} packed
                </span>
                <span className="text-sm font-bold text-teal-600">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <button
              onClick={handleResetAll}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition"
              title="Reset all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Add Item */}
        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex gap-3">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Item name..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewItemName("");
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={adding || !newItemName.trim()}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                >
                  {adding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Grouped Items */}
        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nothing in your checklist yet
            </h3>
            <p className="text-gray-400 text-sm">
              Add items to make sure you don't forget anything!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, catItems]) => {
              const meta = CATEGORY_META[category] ?? CATEGORY_META.Miscellaneous;
              const isCollapsed = collapsed.has(category);
              const catPacked = catItems.filter((i) => i.isPacked).length;

              return (
                <div
                  key={category}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCollapse(category)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${meta.color}`}>
                        {meta.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {category}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {catPacked}/{catItems.length} packed
                        </p>
                      </div>
                    </div>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Items */}
                  {!isCollapsed && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition group"
                        >
                          <button
                            onClick={() => handleToggle(item)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                              item.isPacked
                                ? "bg-teal-600 border-teal-600 text-white"
                                : "border-gray-300 hover:border-teal-400"
                            }`}
                          >
                            {item.isPacked && (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span
                            className={`flex-1 text-sm ${
                              item.isPacked
                                ? "text-gray-400 line-through"
                                : "text-gray-800 font-medium"
                            }`}
                          >
                            {item.itemName}
                          </span>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
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
