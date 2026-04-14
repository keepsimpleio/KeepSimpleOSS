export const userInfoUpdate = async (
  token: string,
  username?: string,
  linkedIn?: string,
  isEmailPublic?: boolean,
  isLinkedinPublic?: boolean,
  title?: string,
  gender?: string,
  npsScore?: number,
  isModalShown?: boolean,
) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/user/me`;
  const body = JSON.stringify({
    ...(username !== undefined && { username }),
    ...(linkedIn !== undefined && { linkedIn }),
    ...(isEmailPublic !== undefined && { isEmailPublic }),
    ...(isLinkedinPublic !== undefined && { isLinkedinPublic }),
    ...(title !== undefined && { title }),
    ...(gender !== undefined && { gender }),
    ...(npsScore !== undefined && { npsScore }),
    ...(isModalShown !== undefined && { isModalShown }),
  });
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update user info:', error);
    throw error;
  }
};
