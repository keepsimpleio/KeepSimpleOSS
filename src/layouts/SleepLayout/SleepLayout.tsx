import { FC, useState } from 'react';
import Image from 'next/image';

import Modal from '@components/Modal';
import Table from '@components/longevity/Table';
import Supplement from '@components/longevity/Supplement';
import MainInfoSection from '@components/longevity/MainInfoSection';
import LongevitySubSection from '@components/longevity/LongevitySubSection';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import { SleepLayoutProps } from './SleepLayout.types';

import styles from './SleepLayout.module.scss';

const SleepLayout: FC<SleepLayoutProps> = ({ locale, data, supplements }) => {
  const isMobile = useIsWidthLessThan(1140);
  // TODO: move to constants
  const imgPath = '/keepsimple_/assets/longevity/sleep/';

  const [open, setOpen] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
  };

  // TODO: move to constants
  const tableKeys = [
    'key brain rules',
    'no structure',
    'my structure',
    'fully optimized',
  ];

  return (
    <>
      <MainInfoSection
        title={data?.title}
        description={data?.description}
        basicStats={data?.basicStats}
        locale={locale}
        japaneseText={data['japanese title']}
        backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data['background image']?.data?.attributes.url}`}
      />
      <LongevitySubSection
        locale={locale}
        title={data['supplement headline']}
        headlineBackgroundImageUrl={`${imgPath}supplements-header.png`}
      >
        {supplements.map((supplementItem, index) => (
          <Supplement
            key={index}
            name={supplementItem['product name']}
            description={supplementItem['product benefits']}
            categories={supplementItem.supplements}
          />
        ))}
      </LongevitySubSection>
      <LongevitySubSection
        locale={locale}
        title={'Key Brain Rules'}
        description={data['key brain rules']}
        headlineBackgroundImageUrl={`${imgPath}key-brain-rules-header.png`}
      />
      <LongevitySubSection
        locale={locale}
        title={'Used devices'}
        description={data['used devices']}
        headlineBackgroundImageUrl={`${imgPath}used-devices-header.png`}
      />
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
            <Modal onClick={() => setOpen(false)} fullSizeMobile>
              <Table
                headerRows={tableKeys}
                rows={data['key brain rules section']}
              />
            </Modal>
          )}
        </>
      )}
      {!isMobile && (
        <Table headerRows={tableKeys} rows={data['key brain rules section']} />
      )}
      <LongevitySubSection
        locale={locale}
        title={'Hacks'}
        isHacks
        description={data.hacks}
        headlineBackgroundImageUrl={`${imgPath}sleep-hacks.png`}
      />
    </>
  );
};

export default SleepLayout;
