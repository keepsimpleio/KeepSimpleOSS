export async function sendRef(url: string, token: string) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accessToken: token,
    },
    body: JSON.stringify({
      timestamp: Date.now(),
    }),
  });

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await res.json();
  return data;
}
