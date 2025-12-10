import { FC, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import cn from 'classnames';

import { TRouter } from '@local-types/global';

const PyramidTooltip = dynamic(
  () => import('@components/_company-management/PyramidTooltip'),
  {
    ssr: false,
  },
);
import styles from './Triangle.module.scss';

interface TriangleProps {
  pyramidStatistics: any;
  selectedPyramidColor: string;
  setStatisticsInfo: any;
  className?: string;
  findMatchingSummaryItem: any;
  setCurrentIcon?: (icon: string) => void;
  activePyramid: boolean;
  setElementId: any;
  elementId?: any;
  setHoverActive: any;
  hoverActive: any;
  icons: any;
  onChange: any;
  isPyramidOnFront: boolean;
  setContentChanged?: (changed: boolean) => void;
  setSelectedUrl?: (url: string) => void;
  setCurrentHashItem?: (item: any) => void;
  defaultSelectedItem?: any;
  removeDefaultSelectedItem?: any;
  setDefaultSelectedIcon?: any;
  setRemoveHash?: any;
  setDefaultIcon?: (icon: boolean) => void;
  dataCy?: string;
}

const Triangle: FC<TriangleProps> = ({
  pyramidStatistics,
  selectedPyramidColor,
  setStatisticsInfo,
  className,
  findMatchingSummaryItem,
  setSelectedUrl,
  setCurrentHashItem,
  defaultSelectedItem,
  setHoverActive,
  removeDefaultSelectedItem,
  hoverActive,
  setCurrentIcon,
  activePyramid,
  setElementId,
  elementId,
  isPyramidOnFront,
  setDefaultSelectedIcon,
  icons,
  setDefaultIcon,
  onChange,
  setRemoveHash,
  setContentChanged,
  dataCy,
}) => {
  const router = useRouter();
  const pyramidRef = useRef(null);
  const parentRef = useRef(null);
  const { locale } = router as TRouter;

  const isBlue = selectedPyramidColor === 'blue';
  const isOrange = selectedPyramidColor === 'orange';
  const isPurple = selectedPyramidColor === 'purple';
  const firstStatistics = pyramidStatistics.attributes.statistics[0].title;
  const secondStatistic = pyramidStatistics.attributes.statistics[1].title;
  const thirdStatistic = pyramidStatistics.attributes.statistics[2].title;
  const fourthStatistic = pyramidStatistics.attributes.statistics[3].title;
  const fifthStatistic = pyramidStatistics.attributes.statistics[4].title;
  const sixthStatistic = pyramidStatistics.attributes.statistics[5].title;
  const seventhStatistic = pyramidStatistics.attributes.statistics[6].title;
  const eighthStatistic = pyramidStatistics.attributes.statistics[7].title;
  const ninthStatistic = pyramidStatistics.attributes.statistics[8].title;
  const tenthStatistic = pyramidStatistics.attributes.statistics[9].title;

  // For setting urls
  const firstStatisticsSlug = pyramidStatistics.attributes.statistics[0].slug;
  const secondStatisticSlug = pyramidStatistics.attributes.statistics[1].slug;
  const thirdStatisticEn = pyramidStatistics.attributes.statistics[2].slug;
  const fourthStatisticEn = pyramidStatistics.attributes.statistics[3].slug;
  const fifthStatisticEn = pyramidStatistics.attributes.statistics[4].slug;
  const sixthStatisticEn = pyramidStatistics.attributes.statistics[5].slug;
  const seventhStatisticEn = pyramidStatistics.attributes.statistics[6].slug;
  const eighthStatisticEn = pyramidStatistics.attributes.statistics[7].slug;
  const ninthStatisticEn = pyramidStatistics.attributes.statistics[8].slug;
  const tenthStatisticEn = pyramidStatistics.attributes.statistics[9].slug;

  const firstImg = icons[0];
  const secondImg = icons[1];
  const thirdImg = icons[2];
  const fourthImg = icons[3];
  const fifthImg = icons[4];
  const sixthImg = icons[5];
  const seventhImg = icons[6];
  const eighthImg = icons[7];
  const ninthImg = icons[8];
  const tenthImg = icons[9];

  const showSecondRow =
    selectedPyramidColor === 'purple' || selectedPyramidColor === 'blue';

  const selectedElement = (icon, id, title) => {
    setDefaultIcon(false);
    setDefaultSelectedIcon(null);
    if (defaultSelectedItem?.title !== title) {
      removeDefaultSelectedItem(null);
      if (activePyramid) setElementId(id);
      setCurrentIcon(icon);
      setRemoveHash(false);
    }
    if (defaultSelectedItem?.title === title) {
      setStatisticsInfo(null);
      setElementId(null);
      setCurrentIcon('');
      removeDefaultSelectedItem(null);
      setRemoveHash(true);
    }
    if (!defaultSelectedItem) {
      if (elementId === id) {
        setStatisticsInfo(null);
        removeDefaultSelectedItem(null);
        setElementId(null);
        setCurrentIcon('');
      } else {
        setCurrentIcon(icon);
        setRemoveHash(false);
        if (activePyramid) setElementId(id);
      }
    }
  };

  const handlePyramidChange = () => {
    onChange();
  };

  const defaultSelectedBlue = activePyramid && isBlue && defaultSelectedItem;
  const defaultSelectedOrange =
    activePyramid && isOrange && defaultSelectedItem;
  const defaultSelectedPurple =
    activePyramid && isPurple && defaultSelectedItem;

  return (
    <div
      className={cn(styles.triangle, className, {
        [styles.blueTriangle]: !hoverActive && isBlue && elementId === null,
        [styles.blueTriangleBack]: isBlue && !isPyramidOnFront,
        [styles.removeBlueTriangle]: defaultSelectedBlue,

        [styles.orangeTriangle]: !hoverActive && isOrange && elementId === null,
        [styles.removeOrangeTriangle]: defaultSelectedOrange,
        [styles.orangeTriangleBak]: isOrange && !isPyramidOnFront,

        [styles.purpleTriangle]: !hoverActive && isPurple && elementId === null,
        [styles.purpleTriangleBack]: isPurple && !isPyramidOnFront,
        [styles.removePurpleTriangle]: defaultSelectedPurple,
      })}
      ref={parentRef}
      onClick={() => {
        handlePyramidChange();
      }}
      data-cy={dataCy}
    >
      <div
        className={cn(styles.wrapper, {
          [styles.activeBlue]: isBlue && hoverActive,

          [styles.activeOrange]: isOrange && hoverActive,

          [styles.activePurple]: isPurple && hoverActive,

          [styles.staticBlue]: isBlue && elementId === null && !hoverActive,
          [styles.staticBlueBack]: isBlue && !isPyramidOnFront,
          [styles.removeStaticBlue]: defaultSelectedBlue,

          [styles.staticOrange]: isOrange && elementId === null && !hoverActive,
          [styles.staticOrangeBack]: isOrange && !isPyramidOnFront,
          [styles.removeStaticOrange]: defaultSelectedOrange,

          [styles.purple]: isPurple && elementId === null && !hoverActive,
          [styles.staticPurpleBack]: isPurple && !isPyramidOnFront,
          [styles.removeStaticPurple]: defaultSelectedPurple,

          [styles.clickedStateBlue]:
            ((elementId || elementId === 0) && isBlue) || defaultSelectedBlue,
          [styles.clickedStateOrange]:
            ((elementId || elementId === 0) && isOrange) ||
            defaultSelectedOrange,

          [styles.clickedStatePurple]:
            ((elementId || elementId === 0) && isPurple) ||
            defaultSelectedPurple,

          [styles.ruVersionBlue]: locale === 'ru' && isBlue,
          [styles.ruVersionOrange]: locale === 'ru' && isOrange,
          [styles.ruVersionPurple]: locale === 'ru' && isPurple,
        })}
        ref={pyramidRef}
      >
        <div
          className={cn(styles.layer, styles.firstLayer)}
          onMouseEnter={() => {
            setHoverActive(true);
          }}
        >
          <PyramidTooltip
            parentClassName={cn(styles['spanWrapper'], {
              [styles.clicked]:
                (elementId === 0 && activePyramid) ||
                (activePyramid &&
                  firstStatistics === defaultSelectedItem?.title),
            })}
            title={firstStatistics}
            tooltipContent={pyramidStatistics.attributes.statistics[0].tooltip}
            onClick={() => {
              selectedElement(firstImg, 0, firstStatistics);
              setContentChanged(true);
              setSelectedUrl(firstStatisticsSlug);
            }}
            tooltipImg={firstImg}
            onMouseEnter={() => {
              setHoverActive(true);
            }}
            onMouseLeave={() => {
              setHoverActive(false);
            }}
          >
            <span
              className={cn(styles.first, {
                [styles.textShadowActive]: findMatchingSummaryItem(0),
              })}
            >
              {firstStatistics}
            </span>
          </PyramidTooltip>
        </div>
        <hr
          className={styles.liner}
          onMouseEnter={() => {
            setHoverActive(true);
          }}
        />
        <div
          className={cn(styles.layer, styles.secondLayer, {
            [styles.clickedOrangeLayer]:
              (elementId === 1 && isOrange && activePyramid) ||
              (activePyramid && secondStatistic === defaultSelectedItem?.title),
          })}
          onMouseEnter={() => {
            setHoverActive(true);
          }}
        >
          <PyramidTooltip
            onMouseEnter={() => {
              setHoverActive(true);
            }}
            onMouseLeave={() => {
              setHoverActive(false);
            }}
            parentClassName={cn(styles['spanWrapper'], styles.secondWrapper, {
              [styles.clicked]:
                (elementId === 1 && activePyramid) ||
                (activePyramid &&
                  secondStatistic === defaultSelectedItem?.title),
            })}
            onClick={() => {
              selectedElement(secondImg, 1, secondStatistic);
              setContentChanged(true);
              setSelectedUrl(secondStatisticSlug);
              setCurrentHashItem(null);
            }}
            title={secondStatistic}
            tooltipContent={pyramidStatistics.attributes.statistics[1].tooltip}
            tooltipImg={secondImg}
          >
            <span
              className={cn(styles.second, {
                [styles.textShadowActive]: findMatchingSummaryItem(1),
              })}
            >
              {secondStatistic}
            </span>
          </PyramidTooltip>
          {showSecondRow && (
            <PyramidTooltip
              parentClassName={cn(styles['spanWrapper'], styles.thirdWrapper, {
                [styles.clicked]:
                  (elementId === 2 && activePyramid) ||
                  (activePyramid &&
                    thirdStatistic === defaultSelectedItem?.title),
              })}
              onClick={() => {
                selectedElement(thirdImg, 2, thirdStatistic);
                setContentChanged(true);
                setSelectedUrl(thirdStatisticEn);
              }}
              title={thirdStatistic}
              tooltipContent={
                pyramidStatistics.attributes.statistics[2].tooltip
              }
              tooltipImg={thirdImg}
              onMouseEnter={() => {
                setHoverActive(true);
              }}
              onMouseLeave={() => {
                setHoverActive(false);
              }}
            >
              <span
                className={cn(styles.third, {
                  [styles.textShadowActive]: findMatchingSummaryItem(2),
                })}
              >
                {thirdStatistic}
              </span>
            </PyramidTooltip>
          )}
        </div>
        <hr
          className={styles.liner}
          onMouseEnter={() => {
            setHoverActive(true);
          }}
        />
        <div
          className={cn(styles.layer, styles.thirdLayer)}
          onMouseEnter={() => {
            setHoverActive(true);
          }}
        >
          <PyramidTooltip
            parentClassName={cn(styles.spanWrapper, styles.forthWrapper, {
              [styles.clicked]:
                (elementId === 3 && activePyramid) ||
                (activePyramid &&
                  fourthStatistic === defaultSelectedItem?.title),
            })}
            onClick={() => {
              selectedElement(fourthImg, 3, fourthStatistic);
              setContentChanged(true);
              setSelectedUrl(fourthStatisticEn);
            }}
            title={fourthStatistic}
            tooltipContent={pyramidStatistics.attributes.statistics[3].tooltip}
            tooltipImg={fourthImg}
            onMouseEnter={() => {
              setHoverActive(true);
            }}
            onMouseLeave={() => {
              setHoverActive(false);
            }}
          >
            <span
              className={cn(styles.forth, {
                [styles.textShadowActive]: findMatchingSummaryItem(3),
              })}
            >
              {fourthStatistic}
            </span>
          </PyramidTooltip>

          <PyramidTooltip
            parentClassName={cn(styles.spanWrapper, styles.fifthWrapper, {
              [styles.clicked]:
                (elementId === 4 && activePyramid) ||
                (activePyramid &&
                  fifthStatistic === defaultSelectedItem?.title),
            })}
            onClick={() => {
              selectedElement(fifthImg, 4, fifthStatistic);
              setContentChanged(true);
              setSelectedUrl(fifthStatisticEn);
            }}
            title={fifthStatistic}
            tooltipContent={pyramidStatistics.attributes.statistics[4].tooltip}
            tooltipImg={fifthImg}
            onMouseEnter={() => {
              setHoverActive(true);
            }}
            onMouseLeave={() => {
              setHoverActive(false);
            }}
          >
            <span
              className={cn(styles.fifth, {
                [styles.textShadowActive]: findMatchingSummaryItem(4),
              })}
            >
              {fifthStatistic}
            </span>
          </PyramidTooltip>
        </div>
        <hr
          className={styles.liner}
          onMouseEnter={() => {
            setHoverActive(true);
          }}
        />
        <div
          className={cn(styles.layer, styles.forthLayer)}
          onMouseEnter={() => {
            setHoverActive(true);
          }}
        >
          {selectedPyramidColor === 'orange' && (
            <PyramidTooltip
              parentClassName={cn(styles.spanWrapper, styles.sixthWrapper, {
                [styles.clicked]:
                  (elementId === 2 && activePyramid) ||
                  (activePyramid &&
                    thirdStatistic === defaultSelectedItem?.title),
              })}
              onClick={() => {
                selectedElement(thirdImg, 2, thirdStatistic);
                setContentChanged(true);
                setSelectedUrl(thirdStatisticEn);
              }}
              title={thirdStatistic}
              tooltipContent={
                pyramidStatistics.attributes.statistics[2].tooltip
              }
              tooltipImg={thirdImg}
              onMouseEnter={() => {
                setHoverActive(true);
              }}
              onMouseLeave={() => {
                setHoverActive(false);
              }}
            >
              <span
                className={cn(styles.sixth, {
                  [styles.textShadowActive]: findMatchingSummaryItem(2),
                })}
              >
                {thirdStatistic}
              </span>
            </PyramidTooltip>
          )}
          <PyramidTooltip
            parentClassName={cn(
              styles.spanWrapper,
              styles.sixthWrapper,
              styles.extraWrapper,
              {
                [styles.clicked]:
                  (elementId === 5 && activePyramid) ||
                  (activePyramid &&
                    sixthStatistic === defaultSelectedItem?.title),
              },
            )}
            onClick={() => {
              selectedElement(sixthImg, 5, sixthStatistic);
              setContentChanged(true);
              setSelectedUrl(sixthStatisticEn);
            }}
            title={sixthStatistic}
            tooltipContent={pyramidStatistics.attributes.statistics[5].tooltip}
            tooltipImg={sixthImg}
            onMouseEnter={() => {
              setHoverActive(true);
            }}
            onMouseLeave={() => {
              setHoverActive(false);
            }}
          >
            <span
              className={cn(styles.sixth, {
                [styles.textShadowActive]: findMatchingSummaryItem(5),
              })}
            >
              {sixthStatistic}
            </span>
          </PyramidTooltip>
          <PyramidTooltip
            title={seventhStatistic}
            parentClassName={cn(styles.spanWrapper, styles.seventhWrapper, {
              [styles.clicked]:
                (elementId === 6 && activePyramid) ||
                (activePyramid &&
                  seventhStatistic === defaultSelectedItem?.title),
            })}
            onClick={() => {
              selectedElement(seventhImg, 6, seventhStatistic);
              setContentChanged(true);
              setSelectedUrl(seventhStatisticEn);
            }}
            tooltipContent={pyramidStatistics.attributes.statistics[6].tooltip}
            tooltipImg={seventhImg}
            onMouseEnter={() => {
              setHoverActive(true);
            }}
            onMouseLeave={() => {
              setHoverActive(false);
            }}
          >
            <span
              className={cn(styles.seventh, {
                [styles.textShadowActive]: findMatchingSummaryItem(6),
              })}
            >
              {seventhStatistic}
            </span>
          </PyramidTooltip>
        </div>
        <hr
          className={styles.liner}
          onMouseEnter={() => {
            setHoverActive(true);
          }}
        />
        <div
          className={cn(styles.layer, styles.fifthLayer)}
          onMouseEnter={() => {
            setHoverActive(true);
          }}
        >
          <PyramidTooltip
            parentClassName={cn(styles.spanWrapper, styles.eighthWrapper, {
              [styles.clicked]:
                (elementId === 7 && activePyramid) ||
                (activePyramid &&
                  eighthStatistic === defaultSelectedItem?.title),
            })}
            onClick={() => {
              selectedElement(eighthImg, 7, eighthStatistic);
              setContentChanged(true);
              setSelectedUrl(eighthStatisticEn);
            }}
            title={eighthStatistic}
            tooltipContent={pyramidStatistics.attributes.statistics[7].tooltip}
            tooltipImg={eighthImg}
            onMouseEnter={() => {
              setHoverActive(true);
            }}
            onMouseLeave={() => {
              setHoverActive(false);
            }}
          >
            <span
              className={cn(styles.eight, {
                [styles.textShadowActive]: findMatchingSummaryItem(7),
              })}
            >
              {eighthStatistic}
            </span>
          </PyramidTooltip>

          <PyramidTooltip
            parentClassName={cn(styles.spanWrapper, styles.ninthWrapper, {
              [styles.clicked]:
                (elementId === 8 && activePyramid) ||
                (activePyramid &&
                  ninthStatistic === defaultSelectedItem?.title),
            })}
            onClick={() => {
              selectedElement(ninthImg, 8, ninthStatistic);
              setContentChanged(true);
              setSelectedUrl(ninthStatisticEn);
            }}
            title={ninthStatistic}
            tooltipContent={pyramidStatistics.attributes.statistics[8].tooltip}
            tooltipImg={ninthImg}
            onMouseEnter={() => {
              setHoverActive(true);
            }}
            onMouseLeave={() => {
              setHoverActive(false);
            }}
          >
            <span
              className={cn(styles.ninth, {
                [styles.textShadowActive]: findMatchingSummaryItem(8),
              })}
            >
              {ninthStatistic}
            </span>
          </PyramidTooltip>

          <PyramidTooltip
            parentClassName={cn(styles.spanWrapper, styles.tenthWrapper, {
              [styles.clicked]:
                (elementId === 9 && activePyramid) ||
                (activePyramid &&
                  tenthStatistic === defaultSelectedItem?.title),
            })}
            onClick={() => {
              selectedElement(tenthImg, 9, tenthStatistic);
              setContentChanged(true);
              setSelectedUrl(tenthStatisticEn);
            }}
            title={tenthStatistic}
            tooltipContent={pyramidStatistics.attributes.statistics[9].tooltip}
            tooltipImg={tenthImg}
            onMouseEnter={() => {
              setHoverActive(true);
            }}
            onMouseLeave={() => {
              setHoverActive(false);
            }}
          >
            <span
              className={cn({
                [styles.textShadowActive]: findMatchingSummaryItem(9),
              })}
            >
              {tenthStatistic}
            </span>
          </PyramidTooltip>
        </div>
      </div>
    </div>
  );
};

export default Triangle;
