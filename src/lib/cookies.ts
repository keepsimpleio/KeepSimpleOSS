export const setRedirectCookie = (url: string) => {
  document.cookie = `redirectAfterLogin=${encodeURIComponent(url)}; path=/; max-age=600`;
};

export const getRedirectCookie = (): string | null => {
  const match = document.cookie.match(/(^| )redirectAfterLogin=([^;]+)/);
  return match ? decodeURIComponent(match[2]) : null;
};

export const deleteRedirectCookie = () => {
  document.cookie = 'redirectAfterLogin=; path=/; max-age=0';
};
