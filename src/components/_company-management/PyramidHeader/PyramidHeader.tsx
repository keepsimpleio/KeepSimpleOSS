import { type FC, type MouseEvent } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import { TRouter } from '@local-types/global';

import useMobile from '@hooks/useMobile';

import { handleMixpanelClick } from '../../../../lib/mixpanel';

import AudioPlayer from '@components/AudioPlayer';

import staticData from '@data/companyManagement';

import styles from './PyramidHeader.module.scss';

type SwitchItemTypes = {
  attributes: {
    pyramidColor: string;
    title: string;
  };
};

interface PyramidHeaderProps {
  active: number;
  onChange: (pyramidId: number) => void;
  switchItems: SwitchItemTypes[];
  setSelectedPyramidColor: (color: string) => void;
  setStatisticsInfo?: (info: any) => void;
  setCurrentIcon?: (icon: string) => void;
  setElementId?: (id: string | number) => void;
  setSelectedUrl?: (url: any) => void;
  setDefaultIcon?: (icon: boolean) => void;
  setDefaultSelectedIcon?: (icon: string) => void;
}

const PyramidHeader: FC<PyramidHeaderProps> = ({
  active,
  onChange,
  switchItems,
  setSelectedPyramidColor,
  setStatisticsInfo,
  setElementId,
  setCurrentIcon,
  setSelectedUrl,
  setDefaultIcon,
  setDefaultSelectedIcon,
}) => {
  const { isMobile } = useMobile()[1];
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const { sectionTitle } = staticData[currentLocale];

  const handleChange = (e: MouseEvent<HTMLDivElement>) => {
    const { id } = e.currentTarget.dataset;
    onChange(Number(id));
    if (id === '0') {
      handleMixpanelClick(
        'Blue Pyramid Clicked',
        'Company Management > Blue',
        'Company Management',
        'Blue Pyramid',
      );
    }
  };

  const handleSelectedColor = (color: string) => {
    setSelectedPyramidColor(color);
  };

  return (
    <div
      className={cn(styles.container, {
        [styles.ruVersion]: locale === 'ru',
      })}
    >
      <h1>{sectionTitle}</h1>
      <div className={styles.switchContainer}>
        <div className={styles.switch}>
          {switchItems.map((attributes, index) => {
            const item = attributes.attributes;
            return (
              <div
                suppressHydrationWarning
                key={index}
                data-id={index}
                onClick={e => {
                  handleChange(e);
                  handleSelectedColor(item.pyramidColor);
                  setStatisticsInfo(null);
                  setCurrentIcon('');
                  setElementId(null);
                  setSelectedUrl(null);
                  setDefaultIcon(false);
                  setDefaultSelectedIcon('');
                }}
                className={cn(styles.switchItem, {
                  [styles.active]: active === index,
                })}
                data-cy={`company-management-switch-item-${index + 1}`}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </div>
      {!isMobile && (
        <div className={styles.play}>
          <AudioPlayer
            isCompanyManagementPage
            audioSrc={'/keepsimple_/audio/synthwave.mp4'}
            playIcon={'/keepsimple_/assets/company-management/play-button.svg'}
            pauseIcon={
              '/keepsimple_/assets/company-management/pause-button.svg'
            }
          />
        </div>
      )}
    </div>
  );
};

export default PyramidHeader;
