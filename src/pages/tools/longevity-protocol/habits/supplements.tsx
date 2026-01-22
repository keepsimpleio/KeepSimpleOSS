import { getSupplements } from '@api/longevity/supplements';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import SupplementsLayout from '@layouts/Supplements';

const Supplements = ({ supplements }) => {
  const router = useRouter();
  const { locale } = router;
  return <SupplementsLayout data={supplements[locale]} locale={locale} />;
};
export default Supplements;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const supplements = await getSupplements(locale);

  return {
    props: { supplements },
  };
};
