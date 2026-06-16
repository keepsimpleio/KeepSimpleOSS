import type { ObjectType } from '@local-types/library/object';
import type { IStrapiSingleResponse } from '@local-types/library/strapi';

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

// Reorder endpoint takes a RAW body that is a bare array (no `{ data }`
// wrapper): each shelf's new position.
export interface IReorderShelfEntry {
  id: number;
  order: number;
}

export type IReorderShelvesPayload = IReorderShelfEntry[];
