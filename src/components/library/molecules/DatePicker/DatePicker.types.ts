export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  minDate?: Date;
  maxDate?: Date;
}
