/**
 * Account feature flags, as `GET /api/users/me` reports them in
 * `featureNames`. One pure check, shared by the page (what is drawn) and the
 * API routes (what is allowed), so the two cannot disagree.
 */
export const holdsFlag = (
  me: { featureNames?: unknown } | null | undefined,
  flag: string,
): boolean => Array.isArray(me?.featureNames) && me.featureNames.includes(flag);
