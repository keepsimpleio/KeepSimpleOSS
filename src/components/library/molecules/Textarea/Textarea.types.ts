export interface TextareaProps {
  value?: string;
  placeholder: string;
  placeholderColor?: string;
  wrapperClassName?: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  rows?: number;
  maxLength?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
