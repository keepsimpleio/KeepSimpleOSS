import type { IObject } from '@/types/object';

export interface BookCardProps {
  object: IObject;
  onClick?: (object: IObject) => void;
  className?: string;
}
