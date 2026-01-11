"use client";

import { useEffect } from 'react';
import { useTourStore } from '@/stores/useTourStore';

export function useTourInit() {
  const { hasSeenTour, showWelcomeModal } = useTourStore();

  useEffect(() => {
    // On first mount, if user hasn't seen tour, welcome modal will show automatically
    // No additional logic needed - state handles it
  }, [hasSeenTour, showWelcomeModal]);
}
