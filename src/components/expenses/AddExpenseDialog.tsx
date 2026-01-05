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
import { Building2, GraduationCap } from "lucide-react";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { id: "1", name: "משכורות", icon: "💰" },
  { id: "2", name: "חשמל", icon: "⚡" },
  { id: "3", name: "תחזוקה", icon: "🔧" },
  { id: "4", name: "ניקיון", icon: "🧹" },
  { id: "5", name: "ציוד", icon: "📦" },
  { id: "6", name: "אחר", icon: "📁" },
];

export function AddExpenseDialog({ open, onOpenChange }: AddExpenseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    frameworkId: "",
    categoryId: "",
    amount: "",
    description: "",
    expenseDate: new Date().toISOString().split("T")[0],
    expenseType: "OCCASIONAL",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onOpenChange(false);
      setFormData({
        frameworkId: "",
        categoryId: "",
        amount: "",
        description: "",
        expenseDate: new Date().toISOString().split("T")[0],
        expenseType: "OCCASIONAL",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">הוספת הוצאה חדשה</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Framework Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">מסגרת</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, frameworkId: "kindergarten" })}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  formData.frameworkId === "kindergarten"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-border hover:border-blue-300"
                }`}
              >
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="font-medium">גנים</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, frameworkId: "school" })}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                  formData.frameworkId === "school"
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                    : "border-border hover:border-amber-300"
                }`}
              >
                <GraduationCap className="h-5 w-5 text-amber-600" />
                <span className="font-medium">בית ספר</span>
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">קטגוריה</label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">תיאור</label>
            <Input
              placeholder="למשל: חשבון חשמל דצמבר"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">תאריך</label>
            <Input
              type="date"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              required
            />
          </div>

          {/* Expense Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">סוג הוצאה</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, expenseType: "FIXED" })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.expenseType === "FIXED"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="font-medium">◉ קבועה</span>
                <p className="text-xs text-muted-foreground mt-1">הוצאה חוזרת</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, expenseType: "OCCASIONAL" })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.expenseType === "OCCASIONAL"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="font-medium">○ מזדמנת</span>
                <p className="text-xs text-muted-foreground mt-1">הוצאה חד פעמית</p>
              </button>
            </div>
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
              {isLoading ? "שומר..." : "הוסף הוצאה"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
