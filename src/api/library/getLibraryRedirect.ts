import { libraryPath } from '@lib/library/libraryPath';

import { getSingleLibrary } from './getSingleLibrary';

/** Preserve object paths and query strings when replacing a legacy library URL. */
export const getLibraryRedirect = async (
  username: string,
  resolvedUrl: string,
): Promise<string | null> => {
  let owner = username;
  if (/^\d+$/.test(username)) {
    try {
      const library = await getSingleLibrary(username);
      owner = library?.data.attributes.user?.data?.attributes.username;
      if (!owner) return null;
    } catch {
      // Let the page show its retry state if the CMS is unavailable.
      return null;
    }
  }
  const canonical = libraryPath(owner);
  const destination = resolvedUrl.replace(/\/library\/[^/?#]+/, canonical);
  return destination === resolvedUrl ? null : destination;
};
