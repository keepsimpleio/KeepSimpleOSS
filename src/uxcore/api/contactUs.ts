export const contactUsRequest = async (feedback: string, email: string) => {
  const body = JSON.stringify({ data: { Text: feedback, Email: email } });

  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/feed-backs`;

  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  }).then(data => data.json());
};
