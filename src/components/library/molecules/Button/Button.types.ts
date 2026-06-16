export enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
  Warning = 'warning',
  Outlined = 'outlined',
  Text = 'text',
}

export enum ButtonSize {
  Default = 'default',
  Wide = 'wide',
}

export enum IconPosition {
  Left = 'left',
  Right = 'right',
}
export interface ButtonProps {
  size?: ButtonSize;
  type?: ButtonType;
  label?: string;
  Icon?: React.ReactNode;
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  iconPosition?: IconPosition;
  labelClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
