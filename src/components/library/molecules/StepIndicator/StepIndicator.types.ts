export interface StepIndicatorStep {
  label: string;
}

export interface StepIndicatorProps {
  steps: StepIndicatorStep[];
  currentStep: number;
  className?: string;
}
