import type { IObject } from '@local-types/library/object';

export interface BookCardProps {
  object: IObject;
  onClick?: (object: IObject) => void;
  className?: string;
}
