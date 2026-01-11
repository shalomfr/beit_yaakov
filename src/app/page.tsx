"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { StatsCards, ExpenseChart, RecentExpenses, QuickActions } from "@/components/dashboard";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";

// Empty data - system starts fresh
// Data will be loaded from API when available
const emptyExpenses: {
  id: string;
  description: string;
  amount: number;
  expenseDate: Date;
  expenseType: "FIXED" | "OCCASIONAL";
  framework: { name: string; type: "KINDERGARTEN" | "SCHOOL" };
  category: { name: string; icon: string };
}[] = [];

const emptyChartData = [
  { name: "משכורות", amount: 0, percentage: 0, color: "hsl(var(--chart-1))" },
  { name: "חשמל", amount: 0, percentage: 0, color: "hsl(var(--chart-2))" },
  { name: "תחזוקה", amount: 0, percentage: 0, color: "hsl(var(--chart-3))" },
  { name: "ניקיון", amount: 0, percentage: 0, color: "hsl(var(--chart-4))" },
  { name: "אחר", amount: 0, percentage: 0, color: "hsl(var(--chart-5))" },
];

export default function DashboardPage() {
  const router = useRouter();
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

      <div className="p-8 space-y-8 max-w-[1800px] mx-auto">
        {/* Stats Cards */}
        <div data-tour="stats-cards">
          <StatsCards
            kindergartenTotal={0}
            schoolTotal={0}
            monthTotal={0}
            fixedAmount={0}
            occasionalAmount={0}
            kindergartenChange={0}
            schoolChange={0}
          />
        </div>

        {/* Chart and Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div data-tour="expense-chart">
            <ExpenseChart data={emptyChartData} />
          </div>
          <div data-tour="quick-actions">
            <QuickActions
              onAddExpense={() => setIsAddExpenseOpen(true)}
              onAddTransfer={() => router.push("/transfers")}
              onAddDebt={() => router.push("/debts")}
            />
          </div>
        </div>

        {/* Recent Expenses */}
        <div data-tour="recent-expenses">
          <RecentExpenses
            expenses={emptyExpenses}
            onAddExpense={() => setIsAddExpenseOpen(true)}
          />
        </div>
      </div>

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />
    </div>
  );
}
