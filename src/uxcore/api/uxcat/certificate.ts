import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getCertificate = async username => {
  const url = `${UxCatRoute}users/${username}/certificate`;

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching user info: ${response.status} - ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    return null;
  }
};
