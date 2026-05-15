import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getForceStop = async token => {
  const url = `${UxCatRoute}tests/force-stop`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken: token,
      },
    });
    if (!response.ok) throw new Error('Request failed: ' + response.statusText);

    return { success: true, status: response.status };
  } catch (error) {
    throw new Error('Failed to post data: ' + error.message);
  }
};
