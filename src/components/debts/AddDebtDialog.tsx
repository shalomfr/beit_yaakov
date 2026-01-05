"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddDebtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Demo employees
const demoEmployees = [
  { id: "e1", name: "שרה כהן", role: "גננת" },
  { id: "e2", name: "רחל לוי", role: "סייעת" },
  { id: "e3", name: "מרים אברהם", role: "מורה" },
  { id: "e4", name: "יעל גולדשטיין", role: "סייעת" },
  { id: "e5", name: "דינה פרידמן", role: "גננת" },
];

const debtTypes = [
  { id: "ADVANCE", name: "מקדמה על משכורת", icon: "💰" },
  { id: "LOAN", name: "הלוואה", icon: "🏦" },
  { id: "EXPENSE_REFUND", name: "החזר הוצאות", icon: "📋" },
];

export function AddDebtDialog({ open, onOpenChange }: AddDebtDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    amount: "",
    reason: "",
    debtType: "",
    dueDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onOpenChange(false);
      setFormData({
        employeeId: "",
        amount: "",
        reason: "",
        debtType: "",
        dueDate: "",
      });
    } catch (error) {
      console.error("Error adding debt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">רישום חוב חדש</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Employee */}
          <div className="space-y-2">
            <label className="text-sm font-medium">עובד/ת</label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר עובד/ת" />
              </SelectTrigger>
              <SelectContent>
                {demoEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{employee.name}</span>
                      <span className="text-muted-foreground">({employee.role})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Debt Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">סוג החוב</label>
            <div className="grid grid-cols-3 gap-2">
              {debtTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, debtType: type.id })}
                  className={`p-3 rounded-lg border-2 transition-colors text-center ${
                    formData.debtType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl block mb-1">{type.icon}</span>
                  <span className="text-xs font-medium">{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">סכום (₪)</label>
            <Input
              type="number"
              placeholder="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="text-lg"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">סיבה / פירוט</label>
            <Input
              placeholder="למשל: מקדמה על משכורת ינואר"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          {/* Due Date (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">תאריך יעד להחזרה (אופציונלי)</label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "שומר..." : "רשום חוב"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
