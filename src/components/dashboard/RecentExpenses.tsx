"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Building2, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Expense {
  id: string;
  description: string;
  amount: number;
  expenseDate: Date;
  expenseType: "FIXED" | "OCCASIONAL";
  framework: {
    name: string;
    type: "KINDERGARTEN" | "SCHOOL";
  };
  category: {
    name: string;
    icon: string;
  };
}

interface RecentExpensesProps {
  expenses: Expense[];
  onAddExpense: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function RecentExpenses({ expenses, onAddExpense }: RecentExpensesProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          הוצאות אחרונות
        </CardTitle>
        <Button
          onClick={onAddExpense}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4 ml-2" />
          הוסף הוצאה
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>אין הוצאות להצגה</p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-xl border-0 bg-gradient-to-r from-slate-50 to-blue-50/50 hover:from-slate-100 hover:to-blue-100/50 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  {/* Framework Icon */}
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm",
                    expense.framework.type === "SCHOOL"
                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                      : "bg-gradient-to-br from-blue-500 to-cyan-600"
                  )}>
                    {expense.framework.type === "SCHOOL" ? (
                      <GraduationCap className="h-6 w-6 text-white" />
                    ) : (
                      <Building2 className="h-6 w-6 text-white" />
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <p className="font-semibold text-slate-900">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 font-medium">
                        {format(new Date(expense.expenseDate), "dd/MM/yyyy", { locale: he })}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-xs text-slate-500">
                        {expense.category.icon} {expense.category.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Type */}
                <div className="text-left">
                  <p className="font-bold text-lg text-slate-900">{formatCurrency(expense.amount)}</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs mt-1",
                      expense.expenseType === "FIXED"
                        ? "bg-blue-500/10 text-blue-700 border border-blue-200"
                        : "bg-purple-500/10 text-purple-700 border border-purple-200"
                    )}
                  >
                    {expense.expenseType === "FIXED" ? "◉ קבוע" : "○ מזדמן"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        {expenses.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              הצג את כל ההוצאות ←
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
