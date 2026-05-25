const headers =
  typeof window !== 'undefined'
    ? {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          localStorage.getItem('accessToken') ||
          localStorage.getItem('googleToken')
        }`,
      }
    : null;

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
  if (!headers) {
    return;
  }
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/personas`;
  const body = JSON.stringify({
    data: { name, decisionTable, accountName },
  });

  return await fetch(url, {
    method: 'POST',
    headers,
    body,
  }).then(data => data.json());
};

export const updatePersona = async (
  entryId: number | string,
  name: string,
  decisionTable: string,
  accountName: string,
) => {
  if (!headers) {
    return;
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
  }).then(data => data.json());
};

export const deletePersona = async (entryId: number | string) => {
  if (!headers) {
    return;
  }
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/personas/${Number(
    String(entryId).slice(1),
  )}`;

  return await fetch(url, {
    method: 'DELETE',
    headers,
  }).then(data => data.json());
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
