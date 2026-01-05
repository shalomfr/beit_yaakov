"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface Debt {
  id: string;
  employee: {
    firstName: string;
    lastName: string;
  };
  amount: number;
  reason: string;
}

interface PayDebtDialogProps {
  debt: Debt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function PayDebtDialog({ debt, open, onOpenChange }: PayDebtDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState("");

  const handleSubmit = async () => {
    if (!debt) return;
    setIsLoading(true);
    
    try {
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onOpenChange(false);
      setPaymentType("full");
      setPartialAmount("");
    } catch (error) {
      console.error("Error paying debt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!debt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            סימון חוב כשולם
          </DialogTitle>
          <DialogDescription>
            חוב של {debt.employee.firstName} {debt.employee.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Debt Info */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">סכום החוב:</span>
              <span className="text-2xl font-bold">{formatCurrency(debt.amount)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{debt.reason}</p>
          </div>

          {/* Payment Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium">סוג התשלום</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType("full")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  paymentType === "full"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-border hover:border-green-300"
                }`}
              >
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <span className="font-medium block">תשלום מלא</span>
                <span className="text-sm text-muted-foreground">{formatCurrency(debt.amount)}</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType("partial")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  paymentType === "partial"
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                    : "border-border hover:border-amber-300"
                }`}
              >
                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                <span className="font-medium block">תשלום חלקי</span>
                <span className="text-sm text-muted-foreground">סכום לבחירה</span>
              </button>
            </div>
          </div>

          {/* Partial Amount Input */}
          {paymentType === "partial" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">סכום התשלום (₪)</label>
              <Input
                type="number"
                placeholder="0"
                value={partialAmount}
                onChange={(e) => setPartialAmount(e.target.value)}
                className="text-lg"
                min="1"
                max={debt.amount}
                step="0.01"
              />
              {partialAmount && Number(partialAmount) > 0 && (
                <p className="text-sm text-muted-foreground">
                  יתרה שתישאר: {formatCurrency(debt.amount - Number(partialAmount))}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            ביטול
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || (paymentType === "partial" && !partialAmount)}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "מעדכן..." : "אשר תשלום"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
