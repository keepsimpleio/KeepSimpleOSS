import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getUserInfo = async (token = '') => {
  const url = `${UxCatRoute}users/me`;
  const accessToken = token ? token : localStorage?.getItem('accessToken');
  if (accessToken) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        accessToken: accessToken,
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
  }
};
