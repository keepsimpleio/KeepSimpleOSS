export const getUXCatData = async () => {
  try {
    const responses = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_STRAPI}/api/ux-cat?locale=ru&populate[OGTags][populate]=ogImage`,
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_STRAPI}/api/ux-cat?locale=en&populate[OGTags][populate]=ogImage`,
      ),
    ]);

    const [ru, en] = await Promise.all(responses.map(resp => resp.json()));

    return { ru, en };
  } catch (error) {
    console.error('Error fetching locale data:', error);
  }
};
