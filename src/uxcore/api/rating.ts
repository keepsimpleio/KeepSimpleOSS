export const rateRequest = async (
  id: number,
  rating: number,
  type: 'bias' | 'question',
) => {
  try {
    // TODO: keep data as it will be sent to avoid multiple requests
    const userData = await fetch('/api/user').then(data => data.json());
    const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/ratings`;
    const headers = { 'Content-Type': 'application/json' };

    const { country, region, city, ip } = userData;

    const body = JSON.stringify({
      data: { elemId: `${id}`, rating, country, region, city, ip, type },
    });
    return await fetch(url, {
      method: 'POST',
      headers,
      body,
    }).then(data => data.json());
  } catch (err) {
    throw new Error('Error occured while sending rating request.');
  }
};
