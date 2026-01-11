"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export function ComingSoonDialog({
  open,
  onOpenChange,
  feature = "תכונה זו"
}: ComingSoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">בקרוב במערכת 🚀</DialogTitle>
          <DialogDescription className="text-center text-base pt-4">
            {feature} תהיה זמינה בגרסה הבאה של המערכת.
            <br />
            אנחנו עובדים קשה להביא לכם את התכונה הזו בהקדם!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
