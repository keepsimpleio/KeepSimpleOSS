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
  autoComplete?: string;
  'aria-autocomplete'?: React.AriaAttributes['aria-autocomplete'];
  'aria-controls'?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}
