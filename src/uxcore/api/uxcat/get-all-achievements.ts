import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export async function getAllAchievements(locale, perPage) {
  const baseURL = `${UxCatRoute}achievements`;

  const url = `${baseURL}?page=1&perPage=${perPage}&locale=${locale}&sortOrder=ASC`;
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.status) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
