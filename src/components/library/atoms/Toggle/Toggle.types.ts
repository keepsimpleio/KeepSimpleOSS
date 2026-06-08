export interface ToggleProps {
  checked: boolean;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
  onChange: () => void;
}
