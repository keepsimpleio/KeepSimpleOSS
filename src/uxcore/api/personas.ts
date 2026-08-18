// Auth headers are built per call: a module-level snapshot would freeze the
// token present at first page load, so a user who logs in afterwards would
// keep POSTing "Bearer null".
const getAuthHeaders = () => {
  if (typeof window === 'undefined') return null;
  const token =
    localStorage.getItem('accessToken') || localStorage.getItem('googleToken');
  if (!token) return null;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const parseOrThrow = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Persona request failed with status ${response.status}.`);
  }
  return response.json();
};

export const getPersonaList = async () => {
  const token =
    localStorage.getItem('accessToken') || localStorage.getItem('googleToken');
  if (!token) {
    return;
  }

  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/personas?sort=id`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { headers });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const addPersona = async (
  name: string,
  decisionTable: string,
  accountName: string,
) => {
  const headers = getAuthHeaders();
  if (!headers) {
    throw new Error('Not authorized: no access token for saving a persona.');
  }
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/personas`;
  const body = JSON.stringify({
    data: { name, decisionTable, accountName },
  });

  return await fetch(url, {
    method: 'POST',
    headers,
    body,
  }).then(parseOrThrow);
};

export const updatePersona = async (
  entryId: number | string,
  name: string,
  decisionTable: string,
  accountName: string,
) => {
  const headers = getAuthHeaders();
  if (!headers) {
    throw new Error('Not authorized: no access token for saving a persona.');
  }
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/personas/${Number(
    String(entryId).slice(1),
  )}`;
  const body = JSON.stringify({
    data: { name, decisionTable, accountName },
  });

  return await fetch(url, {
    method: 'PUT',
    headers,
    body,
  }).then(parseOrThrow);
};

export const deletePersona = async (entryId: number | string) => {
  const headers = getAuthHeaders();
  if (!headers) {
    throw new Error('Not authorized: no access token for deleting a persona.');
  }
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/personas/${Number(
    String(entryId).slice(1),
  )}`;

  return await fetch(url, {
    method: 'DELETE',
    headers,
  }).then(parseOrThrow);
};

export const getPersona = async (entryId: string, accountName: string) => {
  const headers = { 'Content-Type': 'application/json' };

  const url = `${
    process.env.NEXT_PUBLIC_STRAPI
  }/api/personas/?filters[id][$eq]=${Number(
    entryId.slice(1),
  )}&filters[accountName][$eq]=${accountName}`;
  const result = await fetch(url, { headers }).then(data => data.json());

  return result;
};
