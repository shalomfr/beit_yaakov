"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Building2, GraduationCap } from "lucide-react";
import { Framework, useUpdateFramework } from "@/hooks/useFrameworks";
import { toast } from "sonner";

interface EditFrameworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  framework: Framework | null;
}

export function EditFrameworkDialog({
  open,
  onOpenChange,
  framework,
}: EditFrameworkDialogProps) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const updateFramework = useUpdateFramework();

  useEffect(() => {
    if (framework) {
      setName(framework.name);
      setBalance(framework.currentBalance.toString());
    } else {
      setName("");
      setBalance("");
    }
  }, [framework, open]);

  const handleSubmit = async () => {
    if (!framework || !name) return;

    const balanceNum = parseFloat(balance) || 0;

    if (balanceNum < 0) {
      toast.error("היתרה לא יכולה להיות שלילית");
      return;
    }

    try {
      await updateFramework.mutateAsync({
        id: framework.id,
        data: {
          name,
          currentBalance: balanceNum,
        },
      });
      toast.success("המסגרת עודכנה בהצלחה");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "שגיאה בעדכון המסגרת");
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value) || 0;
    return `₪${num.toLocaleString()}`;
  };

  const IconComponent = framework?.type === "KINDERGARTEN" ? Building2 : GraduationCap;
  const typeLabel = framework?.type === "KINDERGARTEN" ? "גנים" : "בית ספר";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>עריכת מסגרת</DialogTitle>
          <DialogDescription>
            עדכון פרטי המסגרת והיתרה
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Framework type indicator */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              framework?.type === "KINDERGARTEN"
                ? "bg-blue-100 text-blue-600"
                : "bg-amber-100 text-amber-600"
            }`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{typeLabel}</p>
              <p className="text-sm text-muted-foreground">סוג מסגרת</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">שם המסגרת</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: גנים, בית ספר"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">יתרה נוכחית (₪)</label>
            <Input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="text-left"
              dir="ltr"
            />
            <p className="text-sm text-muted-foreground">
              תצוגה: {formatCurrency(balance)}
            </p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
            <p className="font-medium mb-1">שים לב:</p>
            <p>שינוי היתרה ישפיע על כל החישובים במערכת. וודא שהסכום נכון.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ביטול
          </Button>
          <Button onClick={handleSubmit} disabled={updateFramework.isPending || !name}>
            {updateFramework.isPending ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                שומר...
              </>
            ) : (
              "שמור שינויים"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
