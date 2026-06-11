import type { IMedia } from '@local-types/library/media';
import type { IObject, IObjectAttributes } from '@local-types/library/object';
import type { IStrapiRelation } from '@local-types/library/strapi';

// The GET /api/share-links/:token payload's object shape isn't pinned yet:
// Strapi may hand back the standard nested entity (`{ id, attributes }`) — the
// same form `getSingleLibrary` returns — or a flattened record. Normalize either
// into the nested IObject the card components read.
// TODO(backend): pin the response shape and drop the flat-record fallback.
export function mapSharedObject(raw: unknown): IObject | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;

  const id = typeof record.id === 'number' ? record.id : Number(record.id);
  if (!Number.isFinite(id)) return null;

  // Already nested (`{ id, attributes }`) — the cards consume this directly.
  if (record.attributes && typeof record.attributes === 'object') {
    return raw as IObject;
  }

  // Flat record — lift the scalar fields under `attributes` and rewrap the cover
  // image into the `{ data: { attributes: { url } } }` relation the cards read.
  const { coverImage, ...rest } = record;
  const attributes = {
    ...(rest as Partial<IObjectAttributes>),
    coverImage: wrapCoverImage(coverImage),
  } as IObjectAttributes;

  return { id, attributes };
}

// Accept either a bare URL string or a media-like object and produce the Strapi
// relation envelope `{ data: { id, attributes: { url, … } } }`. Returns
// undefined when there's no usable cover.
function wrapCoverImage(value: unknown): IStrapiRelation<IMedia> | undefined {
  if (!value) return undefined;

  if (typeof value === 'string') {
    return { data: media(0, value) };
  }

  if (typeof value === 'object') {
    const v = value as Record<string, unknown>;
    // Already a Strapi relation — pass through untouched.
    if ('data' in v) {
      return value as IStrapiRelation<IMedia>;
    }
    if (typeof v.url === 'string') {
      const innerId = typeof v.id === 'number' ? v.id : 0;
      return { data: media(innerId, v.url, v) };
    }
  }

  return undefined;
}

function media(
  id: number,
  url: string,
  source: Record<string, unknown> = {},
): IMedia {
  return {
    id,
    attributes: {
      url,
      name: String(source.name ?? ''),
      mime: String(source.mime ?? ''),
      size: Number(source.size ?? 0),
    },
  };
}
