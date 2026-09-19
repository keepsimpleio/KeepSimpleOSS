/** Public library links use the owner's username; database ids stay in API calls. */
export const libraryPath = (username?: string | null): string => {
  const owner = username?.trim().toLowerCase();
  return owner ? `/library/${encodeURIComponent(owner)}` : '/library';
};
