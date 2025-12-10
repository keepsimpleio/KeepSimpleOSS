export const strapiUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_STRAPI;
  if (!base) throw new Error('NEXT_PUBLIC_STRAPI is not defined');

  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};
