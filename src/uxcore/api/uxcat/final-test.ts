import { requestBody, UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getFinalTest = async (token: string) => {
  const url = `${UxCatRoute}tests/final-test`;

  const headers = {
    'Content-Type': 'application/json',
    accessToken: token,
  };

  return await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  }).then(data => data.json());
};
