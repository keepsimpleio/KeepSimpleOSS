import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getNotifications = async (token: string) => {
  const url = `${UxCatRoute}notifications`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accessToken: token,
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
