import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getUXCatLastTest = async token => {
  const url = `${UxCatRoute}tests/last-test?system=uxcat`;

  const headers = {
    'Content-Type': 'application/json',
    accessToken: token,
  };

  return await fetch(url, {
    method: 'GET',
    headers,
  }).then(data => data.json());
};
