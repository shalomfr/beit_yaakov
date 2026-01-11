"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, GraduationCap, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFrameworks } from "@/hooks/useFrameworks";
import { useCreateTransfer } from "@/hooks/useTransfers";
import { toast } from "sonner";

interface AddTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransferDialog({ open, onOpenChange }: AddTransferDialogProps) {
  const { data: frameworks = [], isLoading: frameworksLoading } = useFrameworks();
  const createTransfer = useCreateTransfer();

  const [formData, setFormData] = useState({
    sourceFrameworkId: "",
    targetFrameworkId: "",
    amount: "",
    description: "",
    transferDate: new Date().toISOString().split("T")[0],
  });

  // Get kindergarten and school frameworks
  const kindergarten = frameworks.find(f => f.type === "KINDERGARTEN");
  const school = frameworks.find(f => f.type === "SCHOOL");

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        sourceFrameworkId: "",
        targetFrameworkId: "",
        amount: "",
        description: "",
        transferDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sourceFrameworkId || !formData.targetFrameworkId || !formData.amount) {
      toast.error("אנא מלא את כל השדות");
      return;
    }

    try {
      await createTransfer.mutateAsync({
        sourceFrameworkId: formData.sourceFrameworkId,
        targetFrameworkId: formData.targetFrameworkId,
        amount: parseFloat(formData.amount),
        description: formData.description,
        transferDate: formData.transferDate,
      });

      toast.success("ההעברה נוצרה בהצלחה");
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding transfer:", error);
      toast.error("שגיאה ביצירת ההעברה");
    }
  };

  const swapFrameworks = () => {
    setFormData({
      ...formData,
      sourceFrameworkId: formData.targetFrameworkId,
      targetFrameworkId: formData.sourceFrameworkId,
    });
  };

  const isLoading = frameworksLoading || createTransfer.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">העברה חדשה</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Source & Target Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium">מאיפה לאיפה?</label>

            <div className="flex items-center gap-4">
              {/* Source */}
              <div className="flex-1 space-y-2">
                <p className="text-xs text-muted-foreground text-center">מקור</p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    disabled={!kindergarten}
                    onClick={() => kindergarten && setFormData({
                      ...formData,
                      sourceFrameworkId: kindergarten.id,
                      targetFrameworkId: formData.targetFrameworkId === kindergarten.id ? "" : formData.targetFrameworkId
                    })}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                      formData.sourceFrameworkId === kindergarten?.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-border hover:border-blue-300",
                      !kindergarten && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{kindergarten?.name || "גנים"}</span>
                  </button>
                  <button
                    type="button"
                    disabled={!school}
                    onClick={() => school && setFormData({
                      ...formData,
                      sourceFrameworkId: school.id,
                      targetFrameworkId: formData.targetFrameworkId === school.id ? "" : formData.targetFrameworkId
                    })}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                      formData.sourceFrameworkId === school?.id
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        : "border-border hover:border-amber-300",
                      !school && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <GraduationCap className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">{school?.name || "בי״ס"}</span>
                  </button>
                </div>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={swapFrameworks}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Target */}
              <div className="flex-1 space-y-2">
                <p className="text-xs text-muted-foreground text-center">יעד</p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    disabled={!kindergarten || formData.sourceFrameworkId === kindergarten?.id}
                    onClick={() => kindergarten && setFormData({
                      ...formData,
                      targetFrameworkId: kindergarten.id,
                      sourceFrameworkId: formData.sourceFrameworkId === kindergarten.id ? "" : formData.sourceFrameworkId
                    })}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                      formData.targetFrameworkId === kindergarten?.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-border hover:border-blue-300",
                      (!kindergarten || formData.sourceFrameworkId === kindergarten?.id) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{kindergarten?.name || "גנים"}</span>
                  </button>
                  <button
                    type="button"
                    disabled={!school || formData.sourceFrameworkId === school?.id}
                    onClick={() => school && setFormData({
                      ...formData,
                      targetFrameworkId: school.id,
                      sourceFrameworkId: formData.sourceFrameworkId === school.id ? "" : formData.sourceFrameworkId
                    })}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                      formData.targetFrameworkId === school?.id
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        : "border-border hover:border-amber-300",
                      (!school || formData.sourceFrameworkId === school?.id) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <GraduationCap className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">{school?.name || "בי״ס"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">סכום להעברה (₪)</label>
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
            <label className="text-sm font-medium">תיאור / סיבה</label>
            <Input
              placeholder="למשל: החזר הוצאות משותפות"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">תאריך העברה</label>
            <Input
              type="date"
              value={formData.transferDate}
              onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
              required
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
            <Button
              type="submit"
              disabled={isLoading || !formData.sourceFrameworkId || !formData.targetFrameworkId}
            >
              {createTransfer.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  מעביר...
                </>
              ) : (
                "בצע העברה"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
