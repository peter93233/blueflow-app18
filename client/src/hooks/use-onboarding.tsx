import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { OnboardingDataManager } from '@/lib/onboarding-data';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetElement: string; // CSS selector or ref name
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'add-expense',
    title: 'Track Your Expenses',
    description: 'Tap here to record your daily expenses and keep track of your spending habits.',
    targetElement: '#add-expense-button'
  },
  {
    id: 'add-income',
    title: 'Log Your Income',
    description: 'Use this to log any incoming money from salary, freelance work, or other sources.',
    targetElement: '#add-income-button'
  },
  {
    id: 'view-reports',
    title: 'Check Your Reports',
    description: 'View your weekly and monthly spending reports to understand your financial patterns.',
    targetElement: 'a[href="/reports"]'
  }
];

export function useOnboarding() {
  const { user, updateUserOnboardingStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const isNewUser = user?.isNewUser === 1;

  const startOnboarding = useCallback(() => {
    if (!isNewUser) return;
    
    // Load demo data
    OnboardingDataManager.loadDemoData();
    
    // Start the tutorial
    setIsActive(true);
    setCurrentStep(0);
    
    // Calculate position for first tooltip
    setTimeout(() => {
      updateTooltipPosition(ONBOARDING_STEPS[0].targetElement);
    }, 100);
  }, [isNewUser]);

  const updateTooltipPosition = useCallback((targetSelector: string) => {
    const element = document.querySelector(targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      setTooltipPosition({
        top: rect.bottom + scrollTop + 10,
        left: rect.left + (rect.width / 2) - 150, // Center tooltip (assuming 300px width)
      });
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      // Update tooltip position for next step
      setTimeout(() => {
        updateTooltipPosition(ONBOARDING_STEPS[nextStepIndex].targetElement);
      }, 100);
    } else {
      completeOnboarding();
    }
  }, [currentStep, updateTooltipPosition]);

  const completeOnboarding = useCallback(async () => {
    // Clear demo data
    OnboardingDataManager.clearDemoData();
    
    // Update user status
    if (updateUserOnboardingStatus) {
      await updateUserOnboardingStatus(false);
    }
    
    // Reset onboarding state
    setIsActive(false);
    setCurrentStep(0);
    
    // Refresh page to show clean state
    window.location.reload();
  }, [updateUserOnboardingStatus]);

  const skipOnboarding = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  return {
    isNewUser,
    isActive,
    currentStep,
    totalSteps: ONBOARDING_STEPS.length,
    currentStepData: ONBOARDING_STEPS[currentStep],
    tooltipPosition,
    startOnboarding,
    nextStep,
    skipOnboarding,
    updateTooltipPosition
  };
}