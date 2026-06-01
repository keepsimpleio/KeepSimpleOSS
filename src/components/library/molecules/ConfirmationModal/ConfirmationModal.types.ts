import { ReactNode } from 'react';

import { IconName } from '@components/library/atoms/Icon';

import { ButtonType } from '../Button';

export type ConfirmationModalVariant = 'success' | 'delete';

export interface ConfirmationModalProps {
  variant?: ConfirmationModalVariant;
  icon?: IconName | ReactNode;
  title: string;
  text: string;
  actionButtonLabel?: string;
  actionButtonType?: ButtonType;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}
