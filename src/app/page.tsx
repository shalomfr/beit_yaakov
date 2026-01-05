"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout";
import { StatsCards, ExpenseChart, RecentExpenses, QuickActions } from "@/components/dashboard";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";

// Demo data - will be replaced with real data from API
const demoExpenses = [
  {
    id: "1",
    description: "משכורת ינואר - צוות הוראה",
    amount: 45000,
    expenseDate: new Date("2026-01-05"),
    expenseType: "FIXED" as const,
    framework: { name: "בית ספר", type: "SCHOOL" as const },
    category: { name: "משכורות", icon: "💰" },
  },
  {
    id: "2",
    description: "חשבון חשמל דצמבר",
    amount: 3200,
    expenseDate: new Date("2026-01-04"),
    expenseType: "FIXED" as const,
    framework: { name: "גנים", type: "KINDERGARTEN" as const },
    category: { name: "חשמל", icon: "⚡" },
  },
  {
    id: "3",
    description: "תיקון מזגן כיתה ד'",
    amount: 1800,
    expenseDate: new Date("2026-01-03"),
    expenseType: "OCCASIONAL" as const,
    framework: { name: "בית ספר", type: "SCHOOL" as const },
    category: { name: "תחזוקה", icon: "🔧" },
  },
  {
    id: "4",
    description: "שירותי ניקיון חודשי",
    amount: 4500,
    expenseDate: new Date("2026-01-02"),
    expenseType: "FIXED" as const,
    framework: { name: "גנים", type: "KINDERGARTEN" as const },
    category: { name: "ניקיון", icon: "🧹" },
  },
  {
    id: "5",
    description: "ציוד משרדי",
    amount: 890,
    expenseDate: new Date("2026-01-01"),
    expenseType: "OCCASIONAL" as const,
    framework: { name: "בית ספר", type: "SCHOOL" as const },
    category: { name: "ציוד", icon: "📦" },
  },
];

const demoChartData = [
  { name: "משכורות", amount: 92000, percentage: 65, color: "hsl(var(--chart-1))" },
  { name: "חשמל", amount: 25500, percentage: 18, color: "hsl(var(--chart-2))" },
  { name: "תחזוקה", amount: 14000, percentage: 10, color: "hsl(var(--chart-3))" },
  { name: "ניקיון", amount: 7000, percentage: 5, color: "hsl(var(--chart-4))" },
  { name: "אחר", amount: 3300, percentage: 2, color: "hsl(var(--chart-5))" },
];

export default function DashboardPage() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="דשבורד הוצאות" 
        subtitle="תמונת מצב יומית" 
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards
          kindergartenTotal={52800}
          schoolTotal={89000}
          monthTotal={141800}
          fixedAmount={118700}
          occasionalAmount={23100}
          kindergartenChange={12}
          schoolChange={-5}
        />

        {/* Chart and Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ExpenseChart data={demoChartData} />
          <QuickActions
            onAddExpense={() => setIsAddExpenseOpen(true)}
            onAddTransfer={() => {}}
            onAddDebt={() => {}}
          />
        </div>

        {/* Recent Expenses */}
        <RecentExpenses
          expenses={demoExpenses}
          onAddExpense={() => setIsAddExpenseOpen(true)}
        />
      </div>

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />
    </div>
  );
}
