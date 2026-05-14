export const getMyInfo = async () => {
  const myInfoUrl: string = `${process.env.NEXT_PUBLIC_STRAPI}/api/users/me`;
  const token: string = localStorage?.getItem('accessToken');
  if (token) {
    try {
      const data = await fetch(myInfoUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(resp => resp.json());

      if (data.error) {
        const { status, message } = data.error;
        throw new Error(`Error ${status} \n ${message}`);
      }

      return data;
    } catch (e) {
      console.error(e);
      window.localStorage.removeItem('accessToken');
    }
  }
};

export const getSettings = async () => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/setting`;

  return await fetch(url, {
    method: 'GET',
  })
    .then(data => data.json())
    .then(data => data?.data?.attributes);
};

export const getCoverImages = async (token: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/cover-images?populate=*`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return await fetch(url, {
    headers,
    method: 'GET',
  }).then(data => data.json());
};

export const updateCoverImage = async (token, imgUrl) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/user/update-cover`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    coverUrl: imgUrl,
  });
  return await fetch(url, {
    method: 'PUT',
    headers,
    body,
  }).then(data => data.json());
};

export const getBackgroundImages = async (token: string) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/bg-images?populate=*`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return await fetch(url, {
    headers,
    method: 'GET',
  }).then(data => data.json());
};

export const updateBackgroundImage = async (token, imgUrl) => {
  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/user/update-bg`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    bgUrl: imgUrl,
  });
  return await fetch(url, {
    method: 'PUT',
    headers,
    body,
  }).then(data => data.json());
};
