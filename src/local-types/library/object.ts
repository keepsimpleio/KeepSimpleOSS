import type { IMedia } from '@local-types/library/media';
import type { IShelfRef } from '@local-types/library/shelf';
import type {
  IStrapiRelation,
  IStrapiRelationList,
  IStrapiSingleResponse,
} from '@local-types/library/strapi';
import type { ITagRef } from '@local-types/library/tag';

export type ObjectType = 'book' | 'video' | 'audio';

// Book-only review fields. Backend enum + range live in docs/object-api.md.
export type OverallRating = 1 | 2 | 3 | 4 | 5;
export type Difficulty = 'very_hard' | 'hard' | 'moderate' | 'easy';

// Scalar (non-relation) fields the client can send on create/update.
// `shelfName` is server-managed (derived from shelf.name) — do NOT send it.
export interface IObjectScalarFields {
  type: ObjectType;
  title: string;
  slug?: string;
  description?: string;
  author?: string;
  sourceUrl?: string;
  publicationDate?: string;
  source?: string;
  duration?: number;
  /** Book only — 1..5. Backend 400s if sent on non-book objects. */
  overall?: OverallRating;
  /** Book only — backend enum (underscore form). */
  difficulty?: Difficulty;
}

export interface IObjectAttributes extends IObjectScalarFields {
  /** Server-derived from `shelf.name`. Read-only from the client. */
  shelfName?: string;
  /** Position within its shelf. Backend default-sorts objects by `order` ASC. */
  order?: number;
  coverImage?: IStrapiRelation<IMedia>;
  tags?: IStrapiRelationList<ITagRef>;
  shelf?: IStrapiRelation<IShelfRef>;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface IObject {
  id: number;
  attributes: IObjectAttributes;
}

export interface ICreateObjectPayload extends IObjectScalarFields {
  coverImage?: number;
  tags?: number[];
  shelf?: number;
  // TODO: drop once Strapi `beforeCreate` lifecycle runs before required-field
  // validation (or schema makes `owner` non-required). Backend ticket pending.
  owner?: number | string;
  publishedAt?: string;
}

export type IUpdateObjectPayload = Partial<
  Omit<ICreateObjectPayload, 'type' | 'coverImage'>
> & {
  coverImage?: number | null;
};

export type IObjectSingleResponse = IStrapiSingleResponse<IObject>;

// Reorder endpoint takes a RAW body (no `{ data }` wrapper): the shelf the
// objects belong to plus each object's new position.
export interface IReorderObjectEntry {
  id: number;
  order: number;
}

export interface IReorderObjectsPayload {
  shelfId: number;
  objects: IReorderObjectEntry[];
}
