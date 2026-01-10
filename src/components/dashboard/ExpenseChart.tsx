"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ExpenseChartProps {
  data: CategoryData[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value);
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CategoryData;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(data.amount)}
        </p>
        <p className="text-sm font-medium" style={{ color: data.color }}>
          {data.percentage.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  // Add colors to data if not present
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length],
  }));

  return (
    <Card className="col-span-full lg:col-span-2 shadow-lg border-0">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent flex items-center gap-2">
          <span>📊</span>
          התפלגות הוצאות לפי קטגוריות
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}K`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={80}
                tick={{ fill: '#1e293b', fontSize: 13, fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[0, 8, 8, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
              <div
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-slate-700">
                {item.name} <span className="text-slate-500">({item.percentage.toFixed(0)}%)</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
