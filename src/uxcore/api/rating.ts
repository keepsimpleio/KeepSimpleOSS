export const rateRequest = async (
  id: number,
  rating: number,
  type: 'bias' | 'question',
) => {
  // Geo enrichment is best-effort: a failed /api/user lookup must not
  // abort the vote itself.
  type TUserGeo = {
    country?: string;
    region?: string;
    city?: string;
    ip?: string;
  };
  let userData: TUserGeo = {};
  try {
    userData = await fetch('/api/user').then(data => data.json());
  } catch {
    userData = {};
  }

  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/ratings`;
  const headers = { 'Content-Type': 'application/json' };

  const { country, region, city, ip } = userData;

  const body = JSON.stringify({
    data: { elemId: `${id}`, rating, country, region, city, ip, type },
  });
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });
  // A 4xx/5xx from Strapi is a lost vote — surface it to the caller
  // instead of counting it as success.
  if (!response.ok) {
    throw new Error(`Rating request failed with status ${response.status}.`);
  }
  return response.json();
};
