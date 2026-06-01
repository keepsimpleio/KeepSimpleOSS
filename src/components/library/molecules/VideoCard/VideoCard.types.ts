import type { IObject } from '@/types/object';

export interface VideoCardProps {
  object: IObject;
  onClick?: (object: IObject) => void;
  className?: string;
}
