export interface ITagAttributes {
  name: string;
  description: string;
  color: string;
  slug: string;
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ITag {
  id: number;
  attributes: ITagAttributes;
}

// Subset returned when tags are populated as a relation on another entity.
export interface ITagRef {
  id: number;
  attributes: Pick<ITagAttributes, 'name' | 'color'>;
}
