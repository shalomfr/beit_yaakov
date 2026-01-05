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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">הוצאות אחרונות</CardTitle>
        <Button size="sm" onClick={onAddExpense}>
          <Plus className="h-4 w-4 ml-2" />
          הוסף הוצאה
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>אין הוצאות להצגה</p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Framework Icon */}
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    expense.framework.type === "SCHOOL"
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : "bg-blue-100 dark:bg-blue-900/30"
                  )}>
                    {expense.framework.type === "SCHOOL" ? (
                      <GraduationCap className="h-5 w-5 text-amber-600" />
                    ) : (
                      <Building2 className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  
                  {/* Details */}
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(expense.expenseDate), "dd/MM/yyyy", { locale: he })}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {expense.category.icon} {expense.category.name}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Amount & Type */}
                <div className="text-left">
                  <p className="font-bold">{formatCurrency(expense.amount)}</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      expense.expenseType === "FIXED"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
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
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm">
              הצג את כל ההוצאות
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
