import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export const getUXCatStatistics = async token => {
  const url = `${UxCatRoute}tests/statistics`;

  const headers = {
    'Content-Type': 'application/json',
    accessToken: token,
  };
  return await fetch(url, {
    method: 'GET',
    headers,
  }).then(data => data.json());
};
