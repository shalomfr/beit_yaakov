"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight, Wallet, FileText } from "lucide-react";
import { ReportsDialog } from "@/components/reports/ReportsDialog";

interface QuickActionsProps {
  onAddExpense: () => void;
  onAddTransfer: () => void;
  onAddDebt: () => void;
}

export function QuickActions({ onAddExpense, onAddTransfer, onAddDebt }: QuickActionsProps) {
  const [showReportsDialog, setShowReportsDialog] = useState(false);

  const actions = [
    {
      label: "הוסף הוצאה",
      icon: Plus,
      onClick: onAddExpense,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700",
      dataTour: "add-expense-btn",
    },
    {
      label: "העברה חדשה",
      icon: ArrowLeftRight,
      onClick: onAddTransfer,
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
      dataTour: "transfers-btn",
    },
    {
      label: "רשום חוב",
      icon: Wallet,
      onClick: onAddDebt,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
      dataTour: "debts-btn",
    },
    {
      label: "הפק דוח",
      icon: FileText,
      onClick: () => setShowReportsDialog(true),
      gradient: "bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
      dataTour: "reports-btn",
    },
  ];

  return (
    <>
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            פעולות מהירות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action) => (
              <Button
                key={action.label}
                onClick={action.onClick}
                data-tour={action.dataTour}
                className={`h-auto flex-col gap-3 py-6 ${action.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0`}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm font-semibold">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <ReportsDialog
        open={showReportsDialog}
        onOpenChange={setShowReportsDialog}
      />
    </>
  );
}
