export const updateLearnedSkills = async (learnedSkills: string[]) => {
  const token: string = localStorage?.getItem('accessToken');
  if (!token) return;

  const url = `${process.env.NEXT_PUBLIC_STRAPI}/api/user/learned-skills`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ learnedSkills }),
  });

  if (!res.ok) {
    throw new Error('Failed to update learned skills');
  }

  return res.json();
};
