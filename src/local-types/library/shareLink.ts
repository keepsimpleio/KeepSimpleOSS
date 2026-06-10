import type { IObject } from '@local-types/library/object';

// Owner-side request to mint a share link. The backend reads `objectIds` (and
// optional `shelfIds`), expands them, caps the total at 21, and rejects
// non-public items. We only send `objectIds` — never shelf ids: the backend
// appends a shelf's contents after the explicit ids, which would fight the
// owner-chosen sequence.
export interface ICreateShareLinkPayload {
  objectIds: number[];
}

// Normalized result of a successful POST /api/share-links. The raw Strapi
// response shape is wrapper-dependent, so `createShareLink` flattens it down to
// the one field the UI needs: the opaque token that addresses the link.
export interface IShareLinkResult {
  token: string;
}

// Recipient-side outcome of opening a share link by token. The backend tells
// expired (410) and unknown/bad token (404 or 400) apart from a transport/parse
// failure, and the recipient UI shows a distinct message for each:
//   ok       — render the shared objects in array order
//   expired  — 410, the 7-day TTL elapsed
//   notFound — 404, the token doesn't address a live link
//   invalid  — 400, the token is malformed
//   error    — network/parse failure (retryable)
export type ShareLinkStatus =
  | 'ok'
  | 'expired'
  | 'notFound'
  | 'invalid'
  | 'error';

export interface IShareLinkView {
  status: ShareLinkStatus;
  // Populated only when status === 'ok'; ordered as the owner sequenced them.
  objects: IObject[];
}
