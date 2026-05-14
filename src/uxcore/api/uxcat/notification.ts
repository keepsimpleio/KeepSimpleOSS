import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export const SendNotification = async (
  token: string,
  id: string,
  achievementName: string,
  isSeen: boolean,
) => {
  const url = `${UxCatRoute}notifications`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        accessToken: token,
      },
      body: JSON.stringify({
        id,
        achievementName,
        isSeen,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};
