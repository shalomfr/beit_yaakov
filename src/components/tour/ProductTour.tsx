"use client";

import { useCallback } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useTourStore } from '@/stores/useTourStore';
import { tourSteps } from './tourSteps';
import { hebrewLocale, rtlStyles } from '@/lib/tourStyles';

export function ProductTour() {
  const { isTourActive, currentStep, setCurrentStep, endTour } = useTourStore();

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, index, type } = data;

    if (type === 'step:after') {
      setCurrentStep(index + 1);
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
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
      disableCloseOnEsc
      spotlightPadding={4}
    />
  );
}
