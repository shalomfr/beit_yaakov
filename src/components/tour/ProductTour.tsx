"use client";

import { useCallback, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, ACTIONS, EVENTS } from 'react-joyride';
import { useTourStore } from '@/stores/useTourStore';
import { tourSteps, interactiveStepIndices } from './tourSteps';
import { hebrewLocale, rtlStyles } from '@/lib/tourStyles';

export function ProductTour() {
  const { isTourActive, currentStep, setCurrentStep, endTour } = useTourStore();

  // Listen for clicks on interactive elements to advance the tour
  useEffect(() => {
    if (!isTourActive) return;

    const currentStepData = tourSteps[currentStep];
    if (!currentStepData?.isInteractive) return;

    // Find the target element
    const targetSelector = currentStepData.target as string;
    const targetElement = document.querySelector(targetSelector);

    if (!targetElement) return;

    const handleClick = () => {
      // After user clicks the interactive element, advance to next step after a delay
      // This gives time for the dialog/action to open
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 800);
    };

    targetElement.addEventListener('click', handleClick);

    return () => {
      targetElement.removeEventListener('click', handleClick);
    };
  }, [isTourActive, currentStep, setCurrentStep]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, index, type, action } = data;
    const currentStepData = tourSteps[index];

    // Handle step navigation for non-interactive steps
    if (type === EVENTS.STEP_AFTER && !currentStepData?.isInteractive) {
      setCurrentStep(index + 1);
    }

    // Handle tour completion or skip
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      endTour();
    }

    // Handle close button
    if (action === ACTIONS.CLOSE) {
      endTour();
    }
  }, [setCurrentStep, endTour]);

  if (!isTourActive) return null;

  return (
    <Joyride
      steps={tourSteps}
      stepIndex={currentStep}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      locale={hebrewLocale}
      styles={rtlStyles}
      disableOverlayClose
      disableCloseOnEsc={false}
      spotlightPadding={4}
      floaterProps={{
        disableAnimation: false,
      }}
    />
  );
}
