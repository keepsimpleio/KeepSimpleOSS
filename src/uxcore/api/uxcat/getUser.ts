import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getPublicUserInfo = async (username: string | string[]) => {
  const url = `${UxCatRoute}users/${username}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        response: {
          status: response.status,
          statusText: response.statusText,
        },
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching public user info:', error);
    throw error;
  }
};
