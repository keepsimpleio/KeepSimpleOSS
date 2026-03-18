import html2canvas from 'html2canvas';
import Image from 'next/image';
import { FC, useRef, useState } from 'react';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import longevityData from '@data/longevity';

import LongevitySubSection from '@components/longevity/LongevitySubSection';
import MainInfoSection from '@components/longevity/MainInfoSection';
import Table from '@components/longevity/Table';
import Modal from '@components/Modal';

import { SupplementsProps } from './Supplements.types';

import styles from './Supplements.module.scss';

const SupplementsLayout: FC<SupplementsProps> = ({ locale, data }) => {
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  const isMobile = useIsWidthLessThan(1140);
  const {
    supplementsHeadlines,
    hacksTitle,
    supplementsTableHeadlines,
    viewSupplementsChart,
  } = longevityData[locale];

  // TODO: Image paths to constants

  const tableRef = useRef(null);

  const makeTableImage = async () => {
    if (!tableRef.current) return;

    await new Promise(r => setTimeout(r, 50));

    const canvas = await html2canvas(tableRef.current, {
      backgroundColor: '#fff',
      scale: Math.min(2, window.devicePixelRatio || 1),
      useCORS: true,
    });

    setImgSrc(canvas.toDataURL('image/png'));
  };

  const handleOpen = async () => {
    setOpen(true);
    await makeTableImage();
  };

  return (
    <>
      <MainInfoSection
        title={data?.title}
        description={data?.description}
        basicStats={data?.basicStats}
        locale={locale}
        japaneseText={data['japanese title']}
        backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data['image']?.data?.attributes.url}`}
      />
      <LongevitySubSection
        locale={locale}
        title={supplementsHeadlines.foundational}
        description={data.foundational}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/foundational.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        title={supplementsHeadlines.longevity}
        description={data['longevity and cellular health']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/longevity.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // TODO: add russian
        title={supplementsHeadlines.performance}
        description={data['performance and recovery']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/performance.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // TODO: add russian
        title={supplementsHeadlines.situational}
        description={data['situational']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/situational.png'
        }
      />
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            left: -99999,
            top: 0,
            width: 900,
            background: '#fff',
          }}
        >
          <div ref={tableRef}>
            <Table
              headerRows={supplementsTableHeadlines}
              rows={data['situational section']}
              isSupplementTable
              locale={locale}
            />
          </div>
        </div>
      )}
      {isMobile && (
        <>
          <button
            type="button"
            onClick={handleOpen}
            className={styles.openChartBtn}
            data-cy="open-chart-btn"
          >
            <Image
              src={
                '/keepsimple_/assets/longevity/shared-assets/small-table.svg'
              }
              alt={'view cart'}
              width={22}
              height={24}
            />
            {viewSupplementsChart}
            <Image
              src={
                '/keepsimple_/assets/longevity/shared-assets/right-arrow.svg'
              }
              alt={'view cart'}
              width={16}
              height={16}
            />
          </button>

          {open && (
            <Modal
              onClick={() => setOpen(false)}
              dataCy="supplements-chart-modal"
            >
              <Image
                src={imgSrc}
                alt="Table"
                width={540}
                height={600}
                className={styles.img}
                data-cy="supplements-chart-img"
              />
            </Modal>
          )}
        </>
      )}
      {!isMobile && (
        <Table
          headerRows={supplementsTableHeadlines}
          rows={data['situational section']}
          isSupplementTable
          locale={locale}
        />
      )}
      <LongevitySubSection
        locale={locale}
        title={hacksTitle}
        description={data.hacks}
        isHacks
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/hacks.png'
        }
      />
    </>
  );
};

export default SupplementsLayout;
