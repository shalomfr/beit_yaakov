"use client";

import { useTourStore } from '@/stores/useTourStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function WelcomeModal() {
  const { showWelcomeModal, hasSeenTour, startTour, skipTour } = useTourStore();

  if (hasSeenTour || !showWelcomeModal) return null;

  return (
    <Dialog open={showWelcomeModal} onOpenChange={(open) => !open && skipTour()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            ברוכים הבאים למערכת ניהול הכספים! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-4">
            זו הפעם הראשונה שלך במערכת. האם תרצה לעשות סיור מודרך קצר ולהכיר את כל התכונות?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 sm:justify-center">
          <Button onClick={skipTour} variant="outline" className="flex-1">
            אולי מאוחר יותר
          </Button>
          <Button onClick={startTour} className="flex-1">
            התחל סיור 🚀
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
