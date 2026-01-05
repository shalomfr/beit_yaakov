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
import { Building2, GraduationCap, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransferDialog({ open, onOpenChange }: AddTransferDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    sourceFrameworkId: "",
    targetFrameworkId: "",
    amount: "",
    description: "",
    transferDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onOpenChange(false);
      setFormData({
        sourceFrameworkId: "",
        targetFrameworkId: "",
        amount: "",
        description: "",
        transferDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error adding transfer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const swapFrameworks = () => {
    setFormData({
      ...formData,
      sourceFrameworkId: formData.targetFrameworkId,
      targetFrameworkId: formData.sourceFrameworkId,
    });
  };

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
                    onClick={() => setFormData({ ...formData, sourceFrameworkId: "kindergarten", targetFrameworkId: formData.targetFrameworkId === "kindergarten" ? "" : formData.targetFrameworkId })}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                      formData.sourceFrameworkId === "kindergarten"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-border hover:border-blue-300"
                    )}
                  >
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">גנים</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sourceFrameworkId: "school", targetFrameworkId: formData.targetFrameworkId === "school" ? "" : formData.targetFrameworkId })}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                      formData.sourceFrameworkId === "school"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        : "border-border hover:border-amber-300"
                    )}
                  >
                    <GraduationCap className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">בי״ס</span>
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
                    onClick={() => setFormData({ ...formData, targetFrameworkId: "kindergarten", sourceFrameworkId: formData.sourceFrameworkId === "kindergarten" ? "" : formData.sourceFrameworkId })}
                    disabled={formData.sourceFrameworkId === "kindergarten"}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                      formData.targetFrameworkId === "kindergarten"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-border hover:border-blue-300",
                      formData.sourceFrameworkId === "kindergarten" && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">גנים</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, targetFrameworkId: "school", sourceFrameworkId: formData.sourceFrameworkId === "school" ? "" : formData.sourceFrameworkId })}
                    disabled={formData.sourceFrameworkId === "school"}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors",
                      formData.targetFrameworkId === "school"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        : "border-border hover:border-amber-300",
                      formData.sourceFrameworkId === "school" && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <GraduationCap className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">בי״ס</span>
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
              {isLoading ? "מעביר..." : "בצע העברה"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
