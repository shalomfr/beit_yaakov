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
  iconBg: string;
}

function StatCard({ title, value, subtitle, change, icon, iconBg }: StatCardProps) {
  const isPositive = change && change.value > 0;
  
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
            {change && (
              <div className={cn(
                "mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                isPositive 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(change.value)}% {change.label}</span>
              </div>
            )}
          </div>
          <div className={cn("rounded-xl p-3", iconBg)}>
            {icon}
          </div>
        </div>
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="הוצאות גנים"
        value={formatCurrency(kindergartenTotal)}
        change={kindergartenChange !== 0 ? {
          value: kindergartenChange,
          label: "מהחודש הקודם"
        } : undefined}
        icon={<Building2 className="h-6 w-6 text-blue-600" />}
        iconBg="bg-blue-100 dark:bg-blue-900/30"
      />
      
      <StatCard
        title="הוצאות בית ספר"
        value={formatCurrency(schoolTotal)}
        change={schoolChange !== 0 ? {
          value: schoolChange,
          label: "מהחודש הקודם"
        } : undefined}
        icon={<GraduationCap className="h-6 w-6 text-amber-600" />}
        iconBg="bg-amber-100 dark:bg-amber-900/30"
      />
      
      <StatCard
        title="סה״כ הוצאות החודש"
        value={formatCurrency(monthTotal)}
        subtitle={`קבועות: ${formatCurrency(fixedAmount)} | מזדמנות: ${formatCurrency(occasionalAmount)}`}
        icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
        iconBg="bg-purple-100 dark:bg-purple-900/30"
      />
    </div>
  );
}
