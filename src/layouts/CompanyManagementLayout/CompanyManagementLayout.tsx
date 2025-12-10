import { type FC, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { UrlObject } from 'node:url';

import { TRouter } from '@local-types/global';

import Pyramid from '@components/_company-management/Pyramid';
import PyramidStats from '@components/_company-management/PyramidStats';
import PyramidHeader from '@components/_company-management/PyramidHeader';
import PyramidAuthors from '@components/_company-management/PyramidAuthors';
import PyramidInfoSection from '@components/_company-management/PyramidInfoSection';

// @ts-ignore
import icons from './icons.ts';

import styles from './CompanyManagementLayout.module.scss';

type PyramidTypes = {
  attributes: {
    pyramidColor: string;
    summary: string;
    title: string;
  };
};

interface CompanyManagementProps {
  pyramids: PyramidTypes[];
  contributors: string;
  pyramidStatistics: any;
}

const CompanyManagementLayout: FC<CompanyManagementProps> = ({
  pyramids,
  contributors,
  pyramidStatistics,
}) => {
  const router = useRouter();
  const hasMounted = useRef(false);
  const { locale } = router as TRouter;
  const [selectedView, setSelectedView] = useState(0);
  const [selectedPyramidColor, setSelectedPyramidColor] = useState('blue');
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [defaultIcon, setDefaultIcon] = useState(true);
  const [defaultSelectedIcon, setDefaultSelectedIcon] = useState(null);
  const [contentChanged, setContentChanged] = useState(false);
  const [removeHash, setRemoveHash] = useState(false);
  const [selectedSummaryItem, setSelectedSummaryItem] = useState(null);
  const [currentIcon, setCurrentIcon] = useState('');
  const [elementId, setElementId] = useState(null);
  const [pyramidHovered, setPyramidHovered] = useState(null);
  const [currentHashItem, setCurrentHashItem] = useState(null);
  const [statisticsInfo, setStatisticsInfo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setSelectedUrl('');
  };

  const selectedPyramid = pyramids.find(
    pyramid => pyramid.attributes.pyramidColor === selectedPyramidColor,
  );

  const selectedPyramidStatistics = pyramidStatistics.data.find(
    pyramid => pyramid.attributes.pyramidColor === selectedPyramidColor,
  );

  const orange = pyramidStatistics.data.find(
    pyramid => pyramid.attributes.pyramidColor === 'orange',
  );

  const purple = pyramidStatistics.data.find(
    pyramid => pyramid.attributes.pyramidColor === 'purple',
  );

  function findByIndex(index) {
    return selectedPyramidStatistics.attributes.statistics[index];
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1140);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const hashParts = hash.split('#');
    const firstHash = hashParts[0];
    const secondHash = hashParts[1] || '';

    if (firstHash === 'orange' || firstHash === 'purple') {
      setSelectedPyramidColor(firstHash);
      setSelectedUrl(secondHash);
      if (firstHash === 'orange') {
        setSelectedView(1);
      }
      if (firstHash === 'purple') {
        setSelectedView(2);
      }
    } else {
      setSelectedPyramidColor('blue');
      setSelectedUrl(firstHash);
    }
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const timeout = setTimeout(() => {
      if (selectedPyramidColor) {
        let pathname: string | UrlObject;
        if (selectedPyramidColor === 'blue') {
          pathname = selectedUrl
            ? `/company-management#${selectedUrl}`
            : '/company-management';
        } else {
          pathname = selectedUrl
            ? `/company-management#${selectedPyramidColor}#${selectedUrl}`
            : `/company-management#${selectedPyramidColor}`;
        }
        if (removeHash) {
          pathname =
            selectedPyramidColor === 'blue'
              ? '/company-management'
              : `/company-management#${selectedPyramidColor}`;
        }

        router.replace(pathname, undefined, { shallow: true, scroll: false });
      }
    }, 10);

    return () => clearTimeout(timeout);
  }, [selectedPyramidColor, selectedUrl, removeHash]);

  useEffect(() => {
    const elements = selectedPyramidStatistics?.attributes?.statistics || [];
    const hashParts = window.location.hash.replace('#', '').split('#');
    const firstHashPart = hashParts[0];
    const secondHashPart = hashParts[1] || '';
    const secondHash =
      selectedPyramidColor === 'blue' ? firstHashPart : secondHashPart;
    const matchingElement = elements.find(
      element => element.slug === secondHash,
    );
    setCurrentHashItem(matchingElement);
    setStatisticsInfo(matchingElement);
  }, [selectedPyramidStatistics, selectedPyramidColor, locale, router]);

  return (
    <section
      className={cn(styles.CompanyManagementNewPage, {
        [styles.ruView]: locale === 'ru',
      })}
    >
      <div className={styles.LeftSide}>
        <PyramidHeader
          active={selectedView}
          onChange={setSelectedView}
          switchItems={pyramids}
          setStatisticsInfo={setStatisticsInfo}
          setSelectedPyramidColor={setSelectedPyramidColor}
          setCurrentIcon={setCurrentIcon}
          setElementId={setElementId}
          setSelectedUrl={setSelectedUrl}
          setDefaultIcon={setDefaultIcon}
          setDefaultSelectedIcon={setDefaultSelectedIcon}
        />
        <div className={styles.infoSectionMobile}>
          <PyramidInfoSection
            type="main"
            selectedPyramid={selectedPyramid}
            color={selectedPyramidColor}
            onlyPyramidInfo
            statisticsInfo={statisticsInfo}
          />
        </div>
        <Pyramid
          setSelectedPyramidColor={setSelectedPyramidColor}
          onChange={setSelectedView}
          setCurrentIcon={setCurrentIcon}
          setPyramidHovered={setPyramidHovered}
          pyramidHovered={pyramidHovered}
          active={selectedView}
          onClick={() => setShowModal(true)}
          data={pyramids}
          selectedPyramidColor={selectedPyramidColor}
          pyramidStatistics={selectedPyramidStatistics}
          setStatisticsInfo={setStatisticsInfo}
          orangeData={orange}
          setSelectedUrl={setSelectedUrl}
          purpleData={purple}
          selectedSummaryItem={selectedSummaryItem}
          setElementId={setElementId}
          elementId={elementId}
          setContentChanged={setContentChanged}
          setCurrentHashItem={setCurrentHashItem}
          defaultSelectedItem={currentHashItem}
          removeDefaultSelectedItem={setCurrentHashItem}
          setRemoveHash={setRemoveHash}
          setDefaultSelectedIcon={setDefaultSelectedIcon}
          defaultIcon={defaultIcon}
          setDefaultIcon={setDefaultIcon}
          setShowModal={setShowModal}
          icons={icons}
        />
        <PyramidStats
          isPurple={
            selectedPyramidColor === 'purple' || selectedPyramidColor === 'blue'
          }
          summary={selectedPyramid.attributes.summary}
          setSelectedSummaryItem={setSelectedSummaryItem}
        />
      </div>
      <div className={styles.RightSide}>
        <PyramidInfoSection
          selectedPyramid={selectedPyramid}
          color={selectedPyramidColor}
          statisticsInfo={
            currentHashItem ? currentHashItem : findByIndex(elementId)
          }
          currentIcon={defaultSelectedIcon ? defaultSelectedIcon : currentIcon}
          contentChanged={contentChanged}
          setContentChanged={setContentChanged}
        />
        <PyramidAuthors contributors={contributors} />
      </div>
      {isMobile && (showModal || !!selectedUrl) && (
        <div>
          <PyramidInfoSection
            type="modal"
            onClose={handleClose}
            selectedPyramid={selectedPyramid}
            color={selectedPyramidColor}
            statisticsInfo={
              currentHashItem ? currentHashItem : findByIndex(elementId)
            }
            currentIcon={
              defaultSelectedIcon ? defaultSelectedIcon : currentIcon
            }
          />
        </div>
      )}
    </section>
  );
};

export default CompanyManagementLayout;
