"use client";

import { Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BudgetCategory {
  name: string;
  amount: number;
  color: string;
}

interface RegionalCost {
  city: string;
  image: string;
  duration: string;
  estimatedSpend: number;
  dailyAvg: number;
  status: "over-budget" | "under-budget" | "on-target";
}

const mockBudgetData = {
  totalBudget: 4500.0,
  estimatedSpend: 3842.15,
  remaining: 657.85,
};

const budgetCategories: BudgetCategory[] = [
  { name: "Transport", amount: 1200, color: "#0d9488" },
  { name: "Hotel", amount: 1500, color: "#14b8a6" },
  { name: "Meals", amount: 800, color: "#f59e0b" },
  { name: "Activities", amount: 342.15, color: "#78350f" },
];

const regionalCosts: RegionalCost[] = [
  {
    city: "Mumbai",
    image: "🏙️",
    duration: "4 Days",
    estimatedSpend: 1240.0,
    dailyAvg: 310,
    status: "over-budget",
  },
  {
    city: "Surat",
    image: "🏖️",
    duration: "3 Days",
    estimatedSpend: 820.5,
    dailyAvg: 273,
    status: "under-budget",
  },
  {
    city: "Goa",
    image: "🌊",
    duration: "5 Days",
    estimatedSpend: 1781.65,
    dailyAvg: 356,
    status: "on-target",
  },
];

function PieChart() {
  const total = budgetCategories.reduce((sum, cat) => sum + cat.amount, 0);
  let currentAngle = -90;

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 160 160" className="mb-6">
        {budgetCategories.map((category) => {
          const sliceAngle = (category.amount / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = 80 + 60 * Math.cos(startRad);
          const y1 = 80 + 60 * Math.sin(startRad);
          const x2 = 80 + 60 * Math.cos(endRad);
          const y2 = 80 + 60 * Math.sin(endRad);

          const largeArc = sliceAngle > 180 ? 1 : 0;

          const path = [
            `M 80 80`,
            `L ${x1} ${y1}`,
            `A 60 60 0 ${largeArc} 1 ${x2} ${y2}`,
            `Z`,
          ].join(" ");

          currentAngle = endAngle;

          return (
            <path
              key={category.name}
              d={path}
              fill={category.color}
              stroke="white"
              strokeWidth="3"
            />
          );
        })}
        {/* Inner circle for donut effect */}
        <circle cx="80" cy="80" r="35" fill="white" />
        <text
          x="80"
          y="88"
          textAnchor="middle"
          className="text-2xl font-bold fill-slate-900"
        >
          $3.8k
        </text>
      </svg>

      <div className="space-y-2 text-sm text-center">
        {budgetCategories.map((category) => (
          <div key={category.name} className="flex items-center justify-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-slate-600">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Expenses() {
  const budgetUsed = (mockBudgetData.estimatedSpend / mockBudgetData.totalBudget) * 100;

  return (
    <div className="ml-40 min-h-screen bg-white">
      {/* Top Header with Profile & Notifications */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Budget Overview
          </h1>
          <p className="text-slate-600 text-sm">
            West India Expedition: Oct 12 - Oct 25
          </p>
        </div>
        <div></div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Export and Add Expense Buttons */}
        <div className="flex gap-3 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={18} />
            Export
          </button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2">
            + Add Expense
          </Button>
        </div>

        {/* Three Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Total Budget & Estimated Spend Combined */}
          <div className="col-span-2 bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-2 gap-12">
              {/* Total Budget */}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                  Total Budget
                </p>
                <p className="text-5xl font-bold text-slate-900 mt-4">
                  ${mockBudgetData.totalBudget.toFixed(2)}
                </p>
              </div>

              {/* Estimated Spend */}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
                  Estimated Spend
                </p>
                <p className="text-5xl font-bold text-teal-600 mt-4">
                  ${mockBudgetData.estimatedSpend.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-4 mt-8 pt-8 border-t border-slate-200">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-slate-700">
                    {budgetUsed.toFixed(0)}% of budget used
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    ${mockBudgetData.remaining.toFixed(2)} remaining
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full transition-all"
                    style={{ width: `${budgetUsed}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-sm text-slate-700 font-medium">
                  On track for planned savings
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown by Category Card */}
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-6">
              Breakdown by Category
            </p>
            <PieChart />
          </div>
        </div>

        {/* Regional Cost Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Regional Cost Breakdown
            </h2>
            <span className="text-xs text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Sorted by Highest Spend
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                    City
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                    Duration
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                    Est. Spend
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                    Daily Avg
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {regionalCosts.map((cost) => (
                  <tr
                    key={cost.city}
                    className="border-b border-slate-200 hover:bg-white transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{cost.image}</span>
                        <span className="font-medium text-slate-900">
                          {cost.city}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {cost.duration}
                    </td>
                    <td className="py-4 px-4 font-semibold text-teal-600">
                      ${cost.estimatedSpend.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      ${cost.dailyAvg}/day
                    </td>
                    <td className="py-4 px-4">
                      {cost.status === "over-budget" && (
                        <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                          🔴 Over Budget [$42]
                        </span>
                      )}
                      {cost.status === "under-budget" && (
                        <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-teal-100 text-teal-700">
                          🟢 Under Budget
                        </span>
                      )}
                      {cost.status === "on-target" && (
                        <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          🟡 On Target
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Insights Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Highest Daily Average */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold text-slate-900 mb-2">
              $295.55
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Highest Daily Average
            </p>
            <p className="text-xs text-slate-500">
              Last Trip
            </p>
          </div>

          {/* Budget Anomalies */}
          <div className="bg-red-50 rounded-xl p-6 border border-red-200 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">
                Budget Anomalies
              </p>
              <div className="text-xl font-bold text-red-600">
                Oct 14 (Over by $42)
              </div>
              <div className="text-xs text-red-600">
                Oct 19 (Over by $15)
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Section */}
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-900 font-medium">
              Review all itemized receipts?
            </p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white text-xs py-2 px-4">
            Go to Ledger
          </Button>
        </div>
      </div>
    </div>
  );
}
