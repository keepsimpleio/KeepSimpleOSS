import type { IObject } from '@/types/object';

export interface AudioCardProps {
  object: IObject;
  onClick?: (object: IObject) => void;
  className?: string;
}
