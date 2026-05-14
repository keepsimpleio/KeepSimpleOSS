import { UxCatRoute } from '@uxcore/api/uxcat/configs';

export async function getAchievement(slug, locale) {
  const baseURL = `${UxCatRoute}achievements/`;

  const url = `${baseURL}${slug}?locale=${locale}`;
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.status) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
