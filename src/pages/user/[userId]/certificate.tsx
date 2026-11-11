import { getCertificate } from '@uxcore/api/uxcat/certificate';
import Spinner from '@uxcore/components/Spinner';
import pageNotFoundData from '@uxcore/data/404';
import CertificateLayout from '@uxcore/layouts/CertificateLayout';
import type { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import React from 'react';

import NotFoundPage from '../../404';

const Certificate = ({ userId, certificate }) => {
  const router = useRouter();
  const { locale } = router as TRouter;

  // One holder asked for the full legal name on the certificate. It is tied to
  // the certificate's own address, so every viewer reads the same name and no
  // other certificate carries it.
  const name =
    String(userId).toLowerCase() === 'tufuka48'
      ? 'Кузнецов Тимофей Юрьевич'
      : `${certificate?.name} ${certificate?.surname}`;
  const date = new Date(certificate?.certificatedAt);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  const link = `${process.env.NEXT_PUBLIC_DOMAIN}/user/${userId}/certificate`;

  if (!certificate) {
    return <NotFoundPage intl={pageNotFoundData[locale]} locale={locale} />;
  }

  return !certificate?.certificatedAt ? (
    <Spinner />
  ) : (
    <CertificateLayout
      name={name || ''}
      userId={certificate?.id || ''}
      link={link}
      receivedDate={`${day}.${month}.${year}`}
      locale={locale}
      username={userId}
    />
  );
};

export default Certificate;

export async function getServerSideProps(context) {
  const userId = context.params.userId;
  const certificate = await getCertificate(userId);
  if (!certificate) context.res.statusCode = 404;
  return {
    props: {
      certificate,
      userId,
    },
  };
}
