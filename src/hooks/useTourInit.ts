"use client";

import { useEffect, useRef } from 'react';
import { useTourStore } from '@/stores/useTourStore';

export function useTourInit() {
  const { hasSeenTour, resetTour, setShowWelcomeModal } = useTourStore();
  const hasCheckedIP = useRef(false);

  useEffect(() => {
    // Only check IP once per session
    if (hasCheckedIP.current) return;
    hasCheckedIP.current = true;

    async function checkIPForTour() {
      try {
        const response = await fetch('/api/tour/check-ip');
        const data = await response.json();

        if (data.success && data.shouldShowTour) {
          // This is a new IP - show the tour regardless of localStorage
          resetTour();
          setShowWelcomeModal(true);
        }
      } catch (error) {
        console.error('Error checking IP for tour:', error);
        // On error, fall back to localStorage-based logic
        // Don't disrupt user experience
      }
    }

    checkIPForTour();
  }, [resetTour, setShowWelcomeModal]);

  // Also update the useTourStore to mark IP as seen when tour ends
  useEffect(() => {
    if (hasSeenTour) {
      // Mark this IP as having seen the tour
      fetch('/api/tour/mark-seen', { method: 'POST' }).catch(console.error);
    }
  }, [hasSeenTour]);
}
