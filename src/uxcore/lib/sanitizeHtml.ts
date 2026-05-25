import DOMPurify from 'isomorphic-dompurify';

export const sanitizeHtml = (dirty: unknown): string => {
  if (dirty == null || dirty === '') return '';
  return DOMPurify.sanitize(String(dirty), {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  });
};
