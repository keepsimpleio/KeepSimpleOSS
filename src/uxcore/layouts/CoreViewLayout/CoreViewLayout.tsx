import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, memo, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';

import useBiasSearch from '@uxcore/hooks/useBiasSearch';
import { useBrowserScale } from '@uxcore/hooks/useBrowserScale';

import { copyToClipboard } from '@uxcore/lib/helpers';

import biasesLocalization from '@uxcore/data/biases';
import copyButtonData from '@uxcore/data/copyButton';

import BiasEnvironment from '@uxcore/components/_biases/BiasEnvironment/BiasEnvironment';
import BiasLabel from '@uxcore/components/_biases/BiasLabel';
import UXCoreLines from '@uxcore/components/_biases/UXCoreLines/UXCoreLines';

import styles from './CoreViewLayout.module.scss';

type TDesktopView = {
  biases: StrapiBiasType[];
};

const CoreViewLayout: FC<TDesktopView> = ({ biases }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { searchResults } = useBiasSearch()[1];

  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);

  const [pathGeometryFirst, setPathGeometryFirst] = useState([]);
  const [pathGeometrySecond, setPathGeometrySecond] = useState([]);
  const [pathGeometryThird, setPathGeometryThird] = useState([]);
  const [pathGeometryForth, setPathGeometryForth] = useState([]);

  const [hovered, setHovered] = useState(null);
  const [svgSize, setSvgSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const scaleDetector = useBrowserScale();
  const isScaleMoreThanOne = scaleDetector > 1;
  const data = biasesLocalization[locale];
  const {
    mainTitle,
    sectionTitles,
    heading,
    link,
    explanationLink,
    description,
    moto,
  } = data;
  const { copied, copyButton } = copyButtonData[locale];

  const ranges = [
    {
      start: 0,
      end: 26,
      getCategory: i => 'blue',
    },
    {
      start: 26,
      end: 52,
      getCategory: i => (i <= 18 ? 'green' : 'blue'),
    },
    {
      start: 52,
      end: 78,
      getCategory: i => (i <= 15 ? 'green' : 'pink'),
    },
    {
      start: 78,
      end: 105,
      getCategory: i => (i <= 7 ? 'purple' : 'pink'),
    },
  ];

  const handleCopy = () => {
    copyToClipboard(link);
    setCopyTooltipOpen(true);

    setTimeout(() => {
      setCopyTooltipOpen(false);
    }, 2000);
  };

  const svgToScreen = (g, fallback) => {
    const x = (g?.x / 353) * svgSize?.width;
    const y = (g?.y / 322) * svgSize?.height;
    return !!g ? { x, y } : fallback;
  };

  const filterBiases = (
    biases: StrapiBiasType[],
    start: number,
    end: number,
    searchResults = [],
    isReversed: boolean,
  ) => {
    const sliced = !!biases && biases.slice(start, end);
    const finalSliced = sliced && isReversed ? sliced?.reverse() : sliced;
    const withIndex =
      !!finalSliced &&
      finalSliced?.map((item, index) => ({
        ...item,
        index,
      }));

    return searchResults.length
      ? withIndex.filter(bias => searchResults.includes(bias.attributes.number))
      : biases;
  };

  return (
    <section className={cn(styles.coreView, {})}>
      <BiasEnvironment
        title={mainTitle}
        names={sectionTitles}
        link={explanationLink.link}
        linkTitle={explanationLink.title}
        locale={locale}
      />
      <div
        className={cn(styles.svgWrap, {
          [styles.scaled]: isScaleMoreThanOne,
        })}
      >
        <div className={styles.hexagonWrapper}>
          <div className={styles.hexagon}>
            <h1 className={styles.heading}>{heading}</h1>
            <div>
              <ReactTooltip
                id={'copyLink'}
                place="top"
                opacity={1}
                className={styles.copyTooltip}
              >
                <span> {copyTooltipOpen ? copied : copyButton} </span>
              </ReactTooltip>
              <span
                className={styles.link}
                onClick={handleCopy}
                data-tooltip-id={'copyLink'}
              >
                {' '}
                {link}{' '}
              </span>
            </div>
            <p className={styles.description}> {description}</p>
            <span className={styles.moto}> {moto} </span>
          </div>
          <div className={cn(styles.biasListWrapper, {})}>
            {/* First parent: ranges 0 & 1 */}
            {ranges
              ?.slice(0, 1)
              ?.map(({ start, end, getCategory }, rangeIndex) => {
                const searchedBiases = filterBiases(
                  biases,
                  start,
                  end,
                  searchResults,
                  false,
                );
                return (
                  <div key={rangeIndex} className={cn(styles.biasList, {})}>
                    <UXCoreLines
                      setPathGeometry={setPathGeometryFirst}
                      setHovered={setHovered}
                      sectionId={1}
                      hovered={hovered}
                      pathName={'first'}
                      setSvgSize={setSvgSize}
                      searchResults={searchedBiases}
                    />
                    {biases?.slice(start, end).map((atr, index) => {
                      const g =
                        pathGeometryFirst[index] ??
                        pathGeometryFirst[pathGeometryFirst.length - 1];
                      const bias = atr.attributes;
                      return (
                        <BiasLabel
                          key={index}
                          index={index}
                          biasName={bias.title}
                          biasNumber={bias.number}
                          slug={bias.slug}
                          category={getCategory(index)}
                          biases={biases}
                          geometry={svgToScreen(g, pathGeometryFirst)}
                          setHovered={setHovered}
                          sectionId={1}
                          hovered={hovered}
                          searchResults={searchResults}
                        />
                      );
                    })}
                  </div>
                );
              })}
            {/* Second */}
            {ranges
              ?.slice(1, 2)
              ?.map(({ start, end, getCategory }, rangeIndex) => {
                const searchedBiases = filterBiases(
                  biases,
                  start,
                  end,
                  searchResults,
                  true,
                );
                return (
                  <div key={rangeIndex} className={styles.biasListSecond}>
                    <UXCoreLines
                      startGreen={18}
                      setPathGeometry={setPathGeometrySecond}
                      setHovered={setHovered}
                      sectionId={2}
                      hovered={hovered}
                      setSvgSize={setSvgSize}
                      pathName={'second'}
                      searchResults={searchedBiases}
                    />
                    {biases
                      ?.slice(start, end)
                      ?.reverse()
                      ?.map((atr, index) => {
                        const bias = atr.attributes;
                        const g = pathGeometrySecond[index];

                        return (
                          <>
                            <BiasLabel
                              key={index}
                              index={index}
                              slug={bias.slug}
                              category={getCategory(index)}
                              biasName={bias.title}
                              biasNumber={bias.number}
                              biases={biases}
                              geometry={
                                !svgSize
                                  ? g
                                  : svgToScreen(g, pathGeometrySecond)
                              }
                              setHovered={setHovered}
                              sectionId={2}
                              hovered={hovered}
                              searchResults={searchResults}
                            />
                          </>
                        );
                      })}
                  </div>
                );
              })}
            {/* Third */}
            {ranges
              ?.slice(3, 4)
              ?.map(({ start, end, getCategory }, rangeIndex) => {
                const searchedBiases = filterBiases(
                  biases,
                  start,
                  end,
                  searchResults,
                  true,
                );
                return (
                  <div
                    key={rangeIndex}
                    className={cn(styles.biasListThird, {})}
                  >
                    <UXCoreLines
                      startPurple={7}
                      startPink={8}
                      setPathGeometry={setPathGeometryThird}
                      isLeftSection
                      setHovered={setHovered}
                      sectionId={3}
                      hovered={hovered}
                      pathName={'third'}
                      setSvgSize={setSvgSize}
                      searchResults={searchedBiases}
                    />

                    {biases
                      ?.slice(start, end)
                      .reverse()
                      .map((atr, index) => {
                        const bias = atr.attributes;
                        const g = pathGeometryThird[index];
                        return (
                          <>
                            <BiasLabel
                              key={index}
                              index={index}
                              slug={bias.slug}
                              category={getCategory(index)}
                              biasName={bias.title}
                              biasNumber={bias.number}
                              biases={biases}
                              geometry={svgToScreen(g, pathGeometryThird)}
                              isLeftSection
                              setHovered={setHovered}
                              sectionId={3}
                              hovered={hovered}
                              searchResults={searchResults}
                            />
                          </>
                        );
                      })}
                  </div>
                );
              })}

            {/* Forth */}
            {ranges
              ?.slice(2, 3)
              ?.map(({ start, end, getCategory }, rangeIndex) => {
                const searchedBiases = filterBiases(
                  biases,
                  start,
                  end,
                  searchResults,
                  false,
                );
                return (
                  <div
                    key={rangeIndex}
                    className={cn(styles.biasListForth, {})}
                  >
                    <UXCoreLines
                      startPink={16}
                      startGreen={15}
                      setPathGeometry={setPathGeometryForth}
                      isThirdPaths
                      setHovered={setHovered}
                      sectionId={4}
                      hovered={hovered}
                      setSvgSize={setSvgSize}
                      pathName={'forth'}
                      isLeftSection
                      searchResults={searchedBiases}
                    />
                    {biases.slice(start, end).map((atr, index) => {
                      const bias = atr.attributes;
                      const g = pathGeometryForth[index];
                      return (
                        <BiasLabel
                          key={index}
                          index={index}
                          slug={bias.slug}
                          category={getCategory(index)}
                          biasName={bias.title}
                          biasNumber={bias.number}
                          biases={biases}
                          geometry={svgToScreen(g, pathGeometryForth)}
                          setHovered={setHovered}
                          sectionId={4}
                          hovered={hovered}
                          isLeftSection
                          searchResults={searchResults}
                        />
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(CoreViewLayout);
