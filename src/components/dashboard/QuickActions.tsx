"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight, Wallet, FileText } from "lucide-react";

interface QuickActionsProps {
  onAddExpense: () => void;
  onAddTransfer: () => void;
  onAddDebt: () => void;
}

export function QuickActions({ onAddExpense, onAddTransfer, onAddDebt }: QuickActionsProps) {
  const actions = [
    {
      label: "הוסף הוצאה",
      icon: Plus,
      onClick: onAddExpense,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "העברה חדשה",
      icon: ArrowLeftRight,
      onClick: onAddTransfer,
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      label: "רשום חוב",
      icon: Wallet,
      onClick: onAddDebt,
      color: "bg-amber-500 hover:bg-amber-600",
    },
    {
      label: "הפק דוח",
      icon: FileText,
      onClick: () => {},
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">פעולות מהירות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              onClick={action.onClick}
              className={`h-auto flex-col gap-2 py-4 ${action.color} text-white`}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
