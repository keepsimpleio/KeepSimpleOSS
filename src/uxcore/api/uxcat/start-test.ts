import { requestBody, UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getUXCatStartTest = async token => {
  const url = `${UxCatRoute}tests/start`;
  const headers = token
    ? {
        'Content-Type': 'application/json',
        accessToken: token,
      }
    : null;

  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  }).then(data => data.json());
};
