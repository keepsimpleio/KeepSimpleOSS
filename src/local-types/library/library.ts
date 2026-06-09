/** Strapi REST shapes for `/api/libraries` with populated relations */

import type { IObject } from '@local-types/library/object';

export interface StrapiPaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiLibrariesMeta {
  pagination: StrapiPaginationMeta;
}

export interface StrapiMediaAttributes {
  url: string;
  alternativeText?: string | null;
}

export interface StrapiMediaEntity {
  id: number;
  attributes: StrapiMediaAttributes;
}

export interface StrapiAvatarField {
  data: StrapiMediaEntity | null;
}

export interface StrapiUserRelation {
  data: {
    id: number;
    // Backend restricts the populated owner to a public allowlist on
    // /api/libraries — only username, name, and picture come back here.
    attributes: { username: string; name?: string; picture?: string };
  } | null;
}

/**
 * Owner profile of the library currently being viewed, published to
 * GlobalState for the Sidebar's Author panel. Sourced from the populated
 * `user` relation (public allowlist above) plus the library's own `aboutMe`.
 */
export interface LibraryOwner {
  /** Numeric id of the owning account from the populated `user` relation.
   * The reliable signal for "is this my library" — compare to accountData.id
   * instead of matching usernames, which the public role can't always read. */
  id?: number;
  username?: string;
  name?: string;
  /** Account OAuth photo from the populated `user` relation (auth role only). */
  picture?: string;
  /** The library's own uploaded avatar — readable by the public role, so this
   * is what a logged-out visitor sees. Raw Strapi URL; resolve before use. */
  avatar?: string;
  aboutMe?: string;
}

export interface StrapiLibraryDetailsComponent {
  id: number;
  aboutLibrary: string;
}

export interface StrapiShelfObjectsRelation {
  data: IObject[];
}

export interface StrapiSingleShelfAttributes {
  name: string;
  visibility: string;
  type: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  objects?: StrapiShelfObjectsRelation;
}

export interface StrapiSingleShelfEntry {
  id: number;
  attributes: StrapiSingleShelfAttributes;
}

export interface StrapiSingleShelvesRelation {
  data: StrapiSingleShelfEntry[];
}

export interface StrapiLibraryAttributes {
  aboutMe: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name?: string;
  avatar: StrapiAvatarField;
  user?: StrapiUserRelation;
  libraryDetails: StrapiLibraryDetailsComponent | null;
  singleShelves: StrapiSingleShelvesRelation;
}

export interface StrapiLibraryEntry {
  id: number;
  attributes: StrapiLibraryAttributes;
}

export interface StrapiLibrariesResponse {
  data: StrapiLibraryEntry[];
  meta: StrapiLibrariesMeta;
}

/** Strapi REST shape for `GET /api/libraries/:id` */
export interface StrapiSingleLibraryResponse {
  data: StrapiLibraryEntry;
  meta?: Record<string, unknown>;
}

/** A single populated library entry. */
export type ILibrary = StrapiLibraryEntry;

/** Strapi REST shape for a single-library mutation response (`PUT /api/libraries/:id`). */
export type ILibrarySingleResponse = StrapiSingleLibraryResponse;

/** Partial payload for `PUT /api/libraries/:id` — only changed keys are sent. */
export interface IUpdateLibraryPayload {
  aboutMe?: string;
  libraryDetails?: { aboutLibrary: string };
  avatar?: number | null;
}

/** Mapped row for `LibraryCard` on the home page */
export interface HomeLibraryCardView {
  id: number;
  username?: string;
  libraryName: string;
  description: string;
  bookCount: number;
  videoCount: number;
  songCount: number;
  avatar?: string;
}
