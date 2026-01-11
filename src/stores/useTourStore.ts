import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TourState {
  hasSeenTour: boolean;
  hasDemoData: boolean;
  isTourActive: boolean;
  currentStep: number;
  showWelcomeModal: boolean;

  // Actions
  startTour: () => void;
  endTour: () => void;
  skipTour: () => void;
  setCurrentStep: (step: number) => void;
  loadDemoData: () => void;
  resetTour: () => void;
  closeWelcomeModal: () => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set) => ({
      hasSeenTour: false,
      hasDemoData: false,
      isTourActive: false,
      currentStep: 0,
      showWelcomeModal: true,

      startTour: () => set({ isTourActive: true, currentStep: 0, showWelcomeModal: false }),
      endTour: () => set({ isTourActive: false, hasSeenTour: true }),
      skipTour: () => set({ isTourActive: false, hasSeenTour: true, showWelcomeModal: false }),
      setCurrentStep: (step) => set({ currentStep: step }),
      loadDemoData: () => set({ hasDemoData: true }),
      resetTour: () => set({ hasSeenTour: false, isTourActive: false, currentStep: 0, showWelcomeModal: true }),
      closeWelcomeModal: () => set({ showWelcomeModal: false }),
    }),
    {
      name: 'beit-yaakov-tour-state',
      partialize: (state) => ({
        hasSeenTour: state.hasSeenTour,
        hasDemoData: state.hasDemoData
      }),
    }
  )
);
