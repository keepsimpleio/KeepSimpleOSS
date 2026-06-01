import type { IStrapiRelation, IStrapiRelationList, IStrapiSingleResponse } from '@/types/strapi';
import type { IMedia } from '@/types/media';
import type { IShelfRef } from '@/types/shelf';
import type { ITagRef } from '@/types/tag';

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

export type IUpdateObjectPayload = Partial<Omit<ICreateObjectPayload, 'type' | 'coverImage'>> & {
  coverImage?: number | null;
};

export type IObjectSingleResponse = IStrapiSingleResponse<IObject>;
