"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Download, Plus, Loader2, ArrowLeft,
  Wallet, TrendingDown, TrendingUp, BarChart3,
  MapPin, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Trip = { id: string; title: string; totalBudget: number | null; startDate: string; endDate: string };
type Expense = {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalAmount: number;
  tripId: string;
};

const CATEGORIES = ["Transport", "Hotel", "Meals", "Activities", "Shopping", "Other"];
const CATEGORY_COLORS: Record<string, string> = {
  Transport: "#0d9488",
  Hotel: "#14b8a6",
  Meals: "#f59e0b",
  Activities: "#8b5cf6",
  Shopping: "#ec4899",
  Other: "#6b7280",
};

export default function Expenses() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    category: "Transport",
    description: "",
    quantity: 1,
    unitCost: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/trips")
      .then((r) => r.json())
      .then((d) => {
        const t = d.trips || [];
        setTrips(t);
        if (t.length > 0) setSelectedTripId(t[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedTripId) return;
    setLoadingExpenses(true);
    fetch(`/api/expenses?tripId=${selectedTripId}`)
      .then((r) => r.json())
      .then((d) => setExpenses(d.expenses || []))
      .finally(() => setLoadingExpenses(false));
  }, [selectedTripId]);

  const selectedTrip = trips.find((t) => t.id === selectedTripId);
  const totalBudget = selectedTrip?.totalBudget ?? 0;
  const totalSpend = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const remaining = totalBudget - totalSpend;
  const budgetUsed = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

  // Group by category
  const byCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.totalAmount;
  });
  const categoryEntries = Object.entries(byCategory).sort(([, a], [, b]) => b - a);
  const catTotal = categoryEntries.reduce((sum, [, v]) => sum + v, 0);

  const handleAddExpense = async () => {
    if (!formData.description.trim() || formData.unitCost <= 0) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tripId: selectedTripId }),
      });
      if (res.ok) {
        const { expense } = await res.json();
        setExpenses((prev) => [...prev, expense]);
        setShowAddModal(false);
        setFormData({ category: "Transport", description: "", quantity: 1, unitCost: 0 });
        toast.success("Expense added!");
      } else {
        toast.error("Failed to add expense.");
      }
    } catch {
      toast.error("Failed to add expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    } catch {
      toast.error("Failed to delete.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Budget Overview</h1>
          {selectedTrip && (
            <p className="text-slate-600 text-sm">
              {selectedTrip.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Action buttons */}
        <div className="flex gap-3 mb-8">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2"
            disabled={!selectedTripId}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Wallet className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No trips found</h3>
            <p className="text-gray-400 mb-6">Create a trip first to start tracking expenses.</p>
            <Link href="/trips/create">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Trip
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="col-span-2 bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                      Total Budget
                    </p>
                    <p className="text-5xl font-bold text-slate-900 mt-4">
                      ₹{totalBudget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                      Total Spent
                    </p>
                    <p className="text-5xl font-bold text-teal-600 mt-4">
                      ₹{totalSpend.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-8 pt-8 border-t border-slate-200">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-slate-700">
                        {budgetUsed}% of budget used
                      </span>
                      <span className="text-sm font-medium text-slate-600">
                        ₹{remaining.toLocaleString()} remaining
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          budgetUsed > 90 ? "bg-red-500" : "bg-gradient-to-r from-teal-500 to-teal-600"
                        }`}
                        style={{ width: `${Math.min(100, budgetUsed)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        budgetUsed > 90 ? "bg-red-500" : budgetUsed > 75 ? "bg-amber-500" : "bg-green-500"
                      }`}
                    />
                    <span className="text-sm text-slate-700 font-medium">
                      {budgetUsed > 90
                        ? "Over budget! Consider reducing expenses"
                        : budgetUsed > 75
                          ? "Approaching budget limit"
                          : "On track for planned savings"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown by Category */}
              <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-6">
                  Breakdown by Category
                </p>
                {categoryEntries.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                    No expenses yet
                  </div>
                ) : (
                  <div className="space-y-3 flex-1">
                    {categoryEntries.map(([cat, amount]) => {
                      const pct = catTotal > 0 ? Math.round((amount / catTotal) * 100) : 0;
                      const color = CATEGORY_COLORS[cat] || "#6b7280";
                      return (
                        <div key={cat}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-sm text-slate-700">{cat}</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900">
                              ₹{amount.toLocaleString()} ({pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Expense List */}
            {loadingExpenses ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
              </div>
            ) : expenses.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    All Expenses ({expenses.length})
                  </h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                        Category
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600">
                        Qty
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600">
                        Unit Cost
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600">
                        Total
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e) => (
                      <tr
                        key={e.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="py-3 px-4 font-medium text-slate-900 text-sm">
                          {e.description}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: `${CATEGORY_COLORS[e.category] || "#6b7280"}15`,
                              color: CATEGORY_COLORS[e.category] || "#6b7280",
                            }}
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: CATEGORY_COLORS[e.category] || "#6b7280" }}
                            />
                            {e.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-slate-600">
                          {e.quantity}
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-slate-600">
                          ₹{e.unitCost.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-semibold text-teal-600">
                          ₹{e.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="text-red-400 hover:text-red-600 transition text-xs font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center text-center">
                <BarChart3 className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No expenses recorded</h3>
                <p className="text-gray-400 text-sm">Click "Add Expense" to start tracking.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Add Expense</h2>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Flight to Mumbai"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Unit Cost (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Total: <span className="font-bold text-teal-600">₹{(formData.quantity * formData.unitCost).toLocaleString()}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddExpense}
                disabled={submitting}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Expense"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
