export const addQuestionRequest = async (
  tags: number[],
  question: string,
  name: string,
  email: string,
) => {
  const body = JSON.stringify({
    data: { tags: JSON.stringify(tags), question, name, email },
  });

  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/new-questions`;

  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  }).then(data => data.json());
};
