import type { ObjectType } from '@/types/object';
import type { IStrapiSingleResponse } from '@/types/strapi';

export type ShelfVisibility = 'public' | 'private';

export interface IShelfAttributes {
  name: string;
  visibility: ShelfVisibility;
  type: ObjectType;
  order: number;
}

export interface IShelf {
  id: number;
  attributes: IShelfAttributes;
}

// Subset returned when a shelf is populated as a relation on another entity.
export interface IShelfRef {
  id: number;
  attributes: Pick<IShelfAttributes, 'name' | 'type' | 'order'>;
}

export interface ICreateShelfPayload {
  name: string;
  type: ObjectType;
  library: number | string;
  // Defaulted by `createShelf` (public / order 0 / no objects / published now)
  // but overridable per call.
  visibility?: ShelfVisibility;
  order?: number;
  owner?: number | string;
  objects?: number[];
  publishedAt?: string;
}

export type IShelfSingleResponse = IStrapiSingleResponse<IShelf>;

// `owner` + `type` are immutable post-create (docs/shelf-api.md), so they
// are intentionally omitted from the update payload.
export interface IUpdateShelfPayload {
  name?: string;
  visibility?: ShelfVisibility;
  order?: number;
}
