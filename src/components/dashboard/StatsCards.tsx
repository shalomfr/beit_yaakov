"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Building2, GraduationCap, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: {
    value: number;
    label: string;
  };
  icon: React.ReactNode;
  gradient: string;
}

function StatCard({ title, value, subtitle, change, icon, gradient }: StatCardProps) {
  const isPositive = change && change.value > 0;

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
      gradient
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 text-white">
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">{title}</p>
            <p className="mt-3 text-4xl font-bold">{value}</p>
            {subtitle && (
              <p className="mt-2 text-sm text-white/70">{subtitle}</p>
            )}
            {change && (
              <div className={cn(
                "mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm",
                isPositive
                  ? "bg-white/20 text-white"
                  : "bg-black/20 text-white"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span>{Math.abs(change.value)}% {change.label}</span>
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-white/20 backdrop-blur-sm p-4 shadow-lg">
            {icon}
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      </CardContent>
    </Card>
  );
}

interface StatsCardsProps {
  kindergartenTotal: number;
  schoolTotal: number;
  monthTotal: number;
  fixedAmount: number;
  occasionalAmount: number;
  kindergartenChange?: number;
  schoolChange?: number;
}

export function StatsCards({
  kindergartenTotal,
  schoolTotal,
  monthTotal,
  fixedAmount,
  occasionalAmount,
  kindergartenChange = 0,
  schoolChange = 0,
}: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="הוצאות גנים"
        value={formatCurrency(kindergartenTotal)}
        change={kindergartenChange !== 0 ? {
          value: kindergartenChange,
          label: "מהחודש הקודם"
        } : undefined}
        icon={<Building2 className="h-7 w-7 text-white" />}
        gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600"
      />

      <StatCard
        title="הוצאות בית ספר"
        value={formatCurrency(schoolTotal)}
        change={schoolChange !== 0 ? {
          value: schoolChange,
          label: "מהחודש הקודם"
        } : undefined}
        icon={<GraduationCap className="h-7 w-7 text-white" />}
        gradient="bg-gradient-to-br from-amber-500 via-orange-600 to-red-600"
      />

      <StatCard
        title="סה״כ הוצאות החודש"
        value={formatCurrency(monthTotal)}
        subtitle={`קבועות: ${formatCurrency(fixedAmount)} | מזדמנות: ${formatCurrency(occasionalAmount)}`}
        icon={<BarChart3 className="h-7 w-7 text-white" />}
        gradient="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600"
      />
    </div>
  );
}
