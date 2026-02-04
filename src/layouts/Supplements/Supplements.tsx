import { FC, useRef, useState } from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';

import Modal from '@components/Modal';
import MainInfoSection from '@components/longevity/MainInfoSection';
import LongevitySubSection from '@components/longevity/LongevitySubSection';
import Table from '@components/longevity/Table';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import { SupplementsProps } from './Supplements.types';

// TODO: move supplements styles to its own file, currently it shares styles with sleep layout which is not ideal
import styles from '@layouts/SleepLayout/SleepLayout.module.scss';

const SupplementsLayout: FC<SupplementsProps> = ({ locale, data }) => {
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  const isMobile = useIsWidthLessThan(1140);

  // TODO: move to constants
  // TODO: Image paths to constants
  const tableKeys = [
    'Area',
    'No Supplements',
    'WITH SUPPLEMENTS (Generic)',
    'TAILORED OPTIMIZED (Bloodwork-driven)',
  ];
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
        // TODO: add russian
        title={'Foundational'}
        description={data.foundational}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/foundational.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // TODO: add russian
        title={'Longevity and Cellular Health'}
        description={data['longevity and cellular health']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/longevity.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // TODO: add russian
        title={'Performance and Recovery'}
        description={data['performance and recovery']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/supplements/performance.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // TODO: add russian
        title={'Situational'}
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
              headerRows={tableKeys}
              rows={data['key brain rules section']}
              isSupplementTable
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
          >
            <Image
              src={
                '/keepsimple_/assets/longevity/shared-assets/small-table.svg'
              }
              alt={'view cart'}
              width={22}
              height={24}
            />
            View sleep structure chart
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
            <Modal onClick={() => setOpen(false)}>
              <Image
                src={imgSrc}
                alt="Table"
                width={700}
                height={600}
                className={styles.img}
              />
            </Modal>
          )}
        </>
      )}
      {!isMobile && (
        <Table
          headerRows={tableKeys}
          rows={data['situational section']}
          isSupplementTable
        />
      )}
      <LongevitySubSection
        locale={locale}
        // TODO: add russian
        title={'Hacks'}
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
