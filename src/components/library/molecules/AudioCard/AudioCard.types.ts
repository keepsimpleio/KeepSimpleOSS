import type { IObject } from '@local-types/library/object';

export interface AudioCardProps {
  object: IObject;
  onClick?: (object: IObject) => void;
  className?: string;
}
