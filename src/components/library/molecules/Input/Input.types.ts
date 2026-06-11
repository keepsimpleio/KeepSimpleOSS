export interface InputProps {
  type: React.HTMLInputTypeAttribute;
  value?: string;
  placeholder: string;
  placeholderColor?: string;
  wrapperClassName?: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}
