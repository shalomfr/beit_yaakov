"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { StatsCards, ExpenseChart, RecentExpenses, QuickActions } from "@/components/dashboard";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import { useExpenses } from "@/hooks/useExpenses";
import { useFrameworks } from "@/hooks/useFrameworks";
import { useCategories } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";

// Chart colors
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function DashboardPage() {
  const router = useRouter();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fetch real data
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: frameworks = [], isLoading: frameworksLoading } = useFrameworks();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const kindergarten = frameworks.find(f => f.type === "KINDERGARTEN");
    const school = frameworks.find(f => f.type === "SCHOOL");

    // Current month expenses
    const now = new Date();
    const currentMonthExpenses = expenses.filter(e => {
      const date = new Date(e.expenseDate);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    // Last month expenses (for comparison)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthExpenses = expenses.filter(e => {
      const date = new Date(e.expenseDate);
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
    });

    // Calculate totals
    const kindergartenTotal = kindergarten?.currentBalance || 0;
    const schoolTotal = school?.currentBalance || 0;
    const monthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const fixedAmount = currentMonthExpenses.filter(e => e.expenseType === "FIXED").reduce((sum, e) => sum + e.amount, 0);
    const occasionalAmount = currentMonthExpenses.filter(e => e.expenseType === "OCCASIONAL").reduce((sum, e) => sum + e.amount, 0);

    // Calculate changes (percentage difference from last month)
    const lastMonthKindergarten = lastMonthExpenses.filter(e => e.framework?.type === "KINDERGARTEN").reduce((sum, e) => sum + e.amount, 0);
    const lastMonthSchool = lastMonthExpenses.filter(e => e.framework?.type === "SCHOOL").reduce((sum, e) => sum + e.amount, 0);
    const currentMonthKindergarten = currentMonthExpenses.filter(e => e.framework?.type === "KINDERGARTEN").reduce((sum, e) => sum + e.amount, 0);
    const currentMonthSchool = currentMonthExpenses.filter(e => e.framework?.type === "SCHOOL").reduce((sum, e) => sum + e.amount, 0);

    const kindergartenChange = lastMonthKindergarten > 0
      ? Math.round(((currentMonthKindergarten - lastMonthKindergarten) / lastMonthKindergarten) * 100)
      : 0;
    const schoolChange = lastMonthSchool > 0
      ? Math.round(((currentMonthSchool - lastMonthSchool) / lastMonthSchool) * 100)
      : 0;

    return {
      kindergartenTotal,
      schoolTotal,
      monthTotal,
      fixedAmount,
      occasionalAmount,
      kindergartenChange,
      schoolChange,
    };
  }, [expenses, frameworks]);

  // Calculate chart data by category
  const chartData = useMemo(() => {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(e => {
      const date = new Date(e.expenseDate);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const totalAmount = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Group by category
    const categoryTotals = new Map<string, { name: string; amount: number }>();

    currentMonthExpenses.forEach(expense => {
      const categoryName = expense.category?.name || "אחר";
      const existing = categoryTotals.get(categoryName);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        categoryTotals.set(categoryName, { name: categoryName, amount: expense.amount });
      }
    });

    // Convert to array and calculate percentages
    const result = Array.from(categoryTotals.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5) // Top 5 categories
      .map((item, index) => ({
        name: item.name,
        amount: item.amount,
        percentage: totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));

    // If no data, return empty categories
    if (result.length === 0) {
      return categories.slice(0, 5).map((cat, index) => ({
        name: cat.name,
        amount: 0,
        percentage: 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
    }

    return result;
  }, [expenses, categories]);

  // Format expenses for RecentExpenses component
  const recentExpenses = useMemo(() => {
    return expenses
      .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
      .slice(0, 10)
      .map(e => ({
        id: e.id,
        description: e.description,
        amount: e.amount,
        expenseDate: new Date(e.expenseDate),
        expenseType: e.expenseType,
        framework: {
          name: e.framework?.name || "לא ידוע",
          type: (e.framework?.type === "KINDERGARTEN" || e.framework?.type === "SCHOOL"
            ? e.framework.type
            : "KINDERGARTEN") as "KINDERGARTEN" | "SCHOOL",
        },
        category: e.category || { name: "אחר", icon: "📁" },
      }));
  }, [expenses]);

  if (!mounted) {
    return null;
  }

  const isLoading = expensesLoading || frameworksLoading || categoriesLoading;

  return (
    <div className="min-h-screen">
      <Header
        title="דשבורד הוצאות"
        subtitle="תמונת מצב יומית"
      />

      <div className="p-8 space-y-8 max-w-[1800px] mx-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Stats Cards */}
            <div data-tour="stats-cards">
              <StatsCards
                kindergartenTotal={stats.kindergartenTotal}
                schoolTotal={stats.schoolTotal}
                monthTotal={stats.monthTotal}
                fixedAmount={stats.fixedAmount}
                occasionalAmount={stats.occasionalAmount}
                kindergartenChange={stats.kindergartenChange}
                schoolChange={stats.schoolChange}
              />
            </div>

            {/* Chart and Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div data-tour="expense-chart">
                <ExpenseChart data={chartData} />
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
                expenses={recentExpenses}
                onAddExpense={() => setIsAddExpenseOpen(true)}
              />
            </div>
          </>
        )}
      </div>

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />
    </div>
  );
}
