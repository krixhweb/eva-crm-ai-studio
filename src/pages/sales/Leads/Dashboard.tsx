import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/Card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "../../../lib/utils";

type Props = {
  deals: Deal[];
};

import type { Deal } from "../../../types"

const stages = [
  "Lead Gen",
  "Qualification",
  "Proposal",
  "Demo",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

const palette = [
  "#9CA3AF",
  "#60A5FA",
  "#A78BFA",
  "#FACC15",
  "#F97316",
  "#22C55E",
  "#EF4444",
];

// Custom Pie Label
const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
  if (percent < 0.07) return null; // hide tiny labels

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 12;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
    >
      {name}
    </text>
  );
};

const Dashboard: React.FC<Props> = ({ deals }) => {
  // Pipeline Value
  const pipelineData = useMemo(() => {
    const map: Record<string, number> = {};
    deals.forEach((d) => {
      if (!map[d.stage]) map[d.stage] = 0;
      map[d.stage] += d.value;
    });
    return stages
      .map((s, i) => ({
        name: s,
        value: map[s] || 0,
        color: palette[i],
      }))
      .filter((x) => x.value > 0);
  }, [deals]);

  const totalPipelineValue = pipelineData.reduce((s, p) => s + p.value, 0);

  const closedWon = deals.filter((d) => d.stage === "Closed Won");
  const closedLost = deals.filter((d) => d.stage === "Closed Lost");

  const winRate =
    closedWon.length + closedLost.length === 0
      ? 0
      : Math.round(
          (closedWon.length / (closedWon.length + closedLost.length)) * 100
        );

  const totalRevenue = closedWon.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Total Revenue */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-xs text-gray-500">
            Generated from {closedWon.length} won deals.
          </p>
        </CardContent>
      </Card>

      {/* Pipeline Distribution */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Pipeline Value Distribution</CardTitle>
        </CardHeader>
        <CardContent className="relative flex items-center justify-center min-h-[240px]">
          {pipelineData.length === 0 ? (
            <p className="text-gray-500 text-sm">No pipeline data</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pipelineData}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={75}
                    label={renderLabel}
                  >
                    {pipelineData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center value */}
              <div className="absolute text-center">
                <div className="text-xl font-bold">
                  {formatCurrency(totalPipelineValue)}
                </div>
                <div className="text-xs text-gray-500">Total Pipeline</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Win Rate Gauge */}
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Win Rate</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">

          <div className="relative w-40 h-40">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <defs>
                <linearGradient id="winGradient" x1="0" x2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>

              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />

              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#winGradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={(1 - winRate / 100) * 2 * Math.PI * 50}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">{winRate}%</div>
              <div className="text-xs text-gray-500">Win Rate</div>
            </div>
          </div>

          <div className="mt-4 text-sm flex justify-between w-full px-4 text-gray-500">
            <div className="text-center">
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {closedWon.length}
              </div>
              <div className="text-xs">Won</div>
            </div>

            <div className="text-center">
              <div className="font-semibold text-gray-800 dark:text-gray-200">
                {closedLost.length}
              </div>
              <div className="text-xs">Lost</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
