import { type FC, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import staticData from '@data/companyManagement';

import Triangle from '@components/_company-management/Pyramid/Triangle';

import { TRouter } from '@local-types/global';

import styles from './Pyramid.module.scss';

interface PyramidProps {
  active: number;
  onClick: () => void;
  data: any;
  selectedPyramidColor: string;
  pyramidStatistics: any;
  setSelectedPyramidColor: any;
  setStatisticsInfo: any;
  orangeData: any;
  purpleData: any;
  selectedSummaryItem: any;
  setCurrentIcon?: (icon: string) => void;
  setElementId: any;
  elementId: any;
  icons: any;
  setPyramidHovered?: any;
  pyramidHovered?: any;
  onChange?: (pyramidId: number) => void;
  setContentChanged?: (changed: boolean) => void;
  setSelectedUrl?: (url: any) => void;
  setCurrentHashItem?: (item: any) => void;
  removeDefaultSelectedItem?: any;
  defaultSelectedItem?: any;
  setRemoveHash?: any;
  setDefaultSelectedIcon?: any;
  defaultIcon?: boolean;
  setShowModal?: (show: boolean) => void;
  setDefaultIcon?: (icon: boolean) => void;
}

const Pyramid: FC<PyramidProps> = ({
  active,
  onClick,
  data,
  setSelectedUrl,
  setCurrentHashItem,
  removeDefaultSelectedItem,
  defaultSelectedItem,
  setRemoveHash,
  setDefaultSelectedIcon,
  defaultIcon,
  setShowModal,
  icons,
  setDefaultIcon,
  selectedPyramidColor,
  pyramidStatistics,
  orangeData,
  setStatisticsInfo,
  purpleData,
  selectedSummaryItem,
  setPyramidHovered,
  pyramidHovered,
  onChange,
  setCurrentIcon,
  setSelectedPyramidColor,
  elementId,
  setElementId,
  setContentChanged,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const { niceToHaveTxt, mustHaveTxt } = staticData[currentLocale];

  const colorOrder = {
    blue: 1,
    orange: 2,
    purple: 3,
  };

  data.sort((a, b) => {
    const colorA = colorOrder[a.attributes.pyramidColor] || Infinity;
    const colorB = colorOrder[b.attributes.pyramidColor] || Infinity;

    return colorA - colorB;
  });

  const classNamesInOrder = useMemo(() => {
    let loops = active;
    const result = [styles.one, styles.two, styles.three];

    // Animation
    function rotateToRight(arr: any[]) {
      const lastEl = arr.splice(-1, 1);

      arr.unshift(lastEl[0]);
    }

    // Turning right
    while (loops !== 0) {
      rotateToRight(result);
      loops--;
    }

    return result;
  }, [active]);

  const normalizeContent = content => {
    const mapping = {
      'Operational performance increase': 'Performance increase',
      'Personnel loyalty increase': 'Loyalty increase',
      'Операционная производительность': 'Повышение производительности',
      'Снижение текучести кадров': 'Снижение уровня текучести кадров',
      'Лояльность сотрудников': 'Повышение лояльности сотрудников',
      'Operational efficiency increase': 'Efficiency increase',
      'Operational waste elimination': 'Waste elimination',
      'Operational bottleneck elimination': 'Bottleneck elimination',
      'Прозрачность в компании': 'Повышение прозрачности в компании',
      'Повышение операционной эффективности': 'Повышение эффективности',
      'Утилизация операционных отходов': 'Утилизация отходов',
      'Устранение узких мест в процессах': 'Устранение узких мест',
      'Data safety increase': 'Data Safety',
      'Company security increase': 'Security increase',
      'Personnel competence increase': 'Personnel Competence',
      'Повышение безопасности данных': 'Безопасность данных',
      'Повышение безопасности компании': 'Безопасность компании',
      'Data access management efficiency (DAME) Increase': 'DAME increase',
      'Повышение компетентности персонала': 'Компетентность персонала',
      'Повышение эффективности управления доступом к данным (ЭУДД)':
        'Повышение ЭУДД',
    };
    return mapping[content] || content;
  };

  const findMatchingSummaryItem = number => {
    const result = pyramidStatistics.attributes.statistics[number].tooltip.find(
      stat =>
        normalizeContent(stat.content.trim()) ===
        normalizeContent(selectedSummaryItem?.trim()),
    );

    return result;
  };

  const openModal = (index, slug) => {
    setShowModal(!!slug);
    setSelectedUrl(slug);
    setElementId(index);
    onClick();
  };

  const handleApplyOnChange = (index, color) => {
    if (active === index) {
      return;
    }

    if (active !== index) {
      onChange(index);
      setStatisticsInfo(null);
      setCurrentIcon('');
      setSelectedPyramidColor(color);
      setElementId(null);
      setDefaultIcon(false);
      setDefaultSelectedIcon(null);
      setStatisticsInfo(null);
      removeDefaultSelectedItem(null);
      setRemoveHash(true);
    }
  };

  useEffect(() => {
    if (defaultIcon) {
      const statisticsMap = {
        [pyramidStatistics.attributes.statistics[0].title]:
          icons[selectedPyramidColor][0],
        [pyramidStatistics.attributes.statistics[1].title]:
          icons[selectedPyramidColor][1],
        [pyramidStatistics.attributes.statistics[2].title]:
          icons[selectedPyramidColor][2],
        [pyramidStatistics.attributes.statistics[3].title]:
          icons[selectedPyramidColor][3],
        [pyramidStatistics.attributes.statistics[4].title]:
          icons[selectedPyramidColor][4],
        [pyramidStatistics.attributes.statistics[5].title]:
          icons[selectedPyramidColor][5],
        [pyramidStatistics.attributes.statistics[6].title]:
          icons[selectedPyramidColor][6],
        [pyramidStatistics.attributes.statistics[7].title]:
          icons[selectedPyramidColor][7],
        [pyramidStatistics.attributes.statistics[8].title]:
          icons[selectedPyramidColor][8],
        [pyramidStatistics.attributes.statistics[9].title]:
          icons[selectedPyramidColor][9],
      };

      const selectedIcon = statisticsMap[defaultSelectedItem?.title];
      if (selectedIcon) {
        setDefaultSelectedIcon(selectedIcon);
      }
    }
  }, [defaultSelectedItem]);

  return (
    <div className={styles.container}>
      <div className={styles.mobileView}>
        <div
          className={cn(styles.column, styles[selectedPyramidColor], {
            [styles.blueShadow]: selectedPyramidColor === 'blue',
          })}
        >
          {pyramidStatistics.attributes.statistics.map((item, index) => (
            <span
              key={index}
              onClick={() => {
                openModal(index, item.slug);
                setCurrentIcon(icons[selectedPyramidColor][index]);
              }}
            >
              {item.title}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.slider}>
        <>
          <Triangle
            isPyramidOnFront={active === 0}
            onChange={() => {
              handleApplyOnChange(0, 'blue');
            }}
            key={0}
            pyramidStatistics={pyramidStatistics}
            className={cn(styles.slide, classNamesInOrder[0])}
            selectedPyramidColor={'blue'}
            setStatisticsInfo={setStatisticsInfo}
            findMatchingSummaryItem={findMatchingSummaryItem}
            activePyramid={selectedPyramidColor === 'blue'}
            setCurrentIcon={setCurrentIcon}
            setElementId={active === 0 && setElementId}
            elementId={active === 0 && elementId}
            setHoverActive={active === 0 && setPyramidHovered}
            hoverActive={active === 0 && pyramidHovered}
            setContentChanged={setContentChanged}
            setSelectedUrl={setSelectedUrl}
            setCurrentHashItem={setCurrentHashItem}
            defaultSelectedItem={defaultSelectedItem}
            removeDefaultSelectedItem={removeDefaultSelectedItem}
            setRemoveHash={setRemoveHash}
            setDefaultSelectedIcon={setDefaultSelectedIcon}
            setDefaultIcon={setDefaultIcon}
            icons={icons['blue']}
            dataCy={'blue-pyramid'}
          />
          <Triangle
            isPyramidOnFront={active === 1}
            onChange={() => {
              handleApplyOnChange(1, 'orange');
            }}
            key={1}
            pyramidStatistics={orangeData}
            className={cn(styles.slide, classNamesInOrder[1])}
            selectedPyramidColor={'orange'}
            setStatisticsInfo={setStatisticsInfo}
            findMatchingSummaryItem={findMatchingSummaryItem}
            activePyramid={selectedPyramidColor === 'orange'}
            setCurrentIcon={setCurrentIcon}
            elementId={active === 1 && elementId}
            setElementId={active === 1 && setElementId}
            setHoverActive={active === 1 && setPyramidHovered}
            hoverActive={active === 1 && pyramidHovered}
            setContentChanged={setContentChanged}
            setSelectedUrl={setSelectedUrl}
            setCurrentHashItem={setCurrentHashItem}
            defaultSelectedItem={defaultSelectedItem}
            removeDefaultSelectedItem={removeDefaultSelectedItem}
            setRemoveHash={setRemoveHash}
            setDefaultSelectedIcon={setDefaultSelectedIcon}
            setDefaultIcon={setDefaultIcon}
            icons={icons['orange']}
            dataCy={'orange-pyramid'}
          />
          <Triangle
            isPyramidOnFront={active === 2}
            onChange={() => {
              handleApplyOnChange(2, 'purple');
            }}
            key={2}
            pyramidStatistics={purpleData}
            className={cn(styles.slide, classNamesInOrder[2])}
            selectedPyramidColor={'purple'}
            findMatchingSummaryItem={findMatchingSummaryItem}
            setStatisticsInfo={setStatisticsInfo}
            activePyramid={selectedPyramidColor === 'purple'}
            setCurrentIcon={setCurrentIcon}
            setElementId={active === 2 && setElementId}
            elementId={active === 2 && elementId}
            setHoverActive={active === 2 && setPyramidHovered}
            hoverActive={active === 2 && pyramidHovered}
            setContentChanged={setContentChanged}
            setSelectedUrl={setSelectedUrl}
            setCurrentHashItem={setCurrentHashItem}
            defaultSelectedItem={defaultSelectedItem}
            removeDefaultSelectedItem={removeDefaultSelectedItem}
            setRemoveHash={setRemoveHash}
            setDefaultSelectedIcon={setDefaultSelectedIcon}
            setDefaultIcon={setDefaultIcon}
            icons={icons['purple']}
            dataCy={'purple-pyramid'}
          />
        </>
      </div>
      <div
        className={cn(styles.legend, {
          [styles.legendRu]: locale === 'ru',
        })}
      >
        <div className={cn(styles.scale, styles[selectedPyramidColor])}>
          <span className={styles.scaleText}>{niceToHaveTxt}</span>
          <span className={styles.scaleText}>{mustHaveTxt}</span>
        </div>
      </div>
    </div>
  );
};

export default Pyramid;
