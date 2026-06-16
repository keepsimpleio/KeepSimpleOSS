export enum ObjectType {
  Book = 'book',
  Video = 'video',
  Audio = 'audio',
}

export interface ObjectProps {
  type: ObjectType;
  number: number;
  noBorder?: boolean;
  className?: string;
}
