import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHtml = (dirty: string | null | undefined): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  });
};
