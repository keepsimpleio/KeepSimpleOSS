import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

import type { TagType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';

import useMobile from '@uxcore/hooks/useMobile';

import { calculatePercentage } from '@uxcore/lib/uxcp-helpers';

import uxcpLocalization from '@uxcore/data/uxcp';

import PieLegend from '@uxcore/components/_uxcp/PieChartSection/PieLegend';
import PieTooltip from '@uxcore/components/_uxcp/PieChartSection/PieTooltip';
import Section from '@uxcore/components/Section';

import styles from './PieChartSection.module.scss';

const gapSize = 6;
const radius = 125 + gapSize;
const width = radius * 2;
const height = radius * 2;

const pieConfig = {
  viewBoxSize: [width, height],
  center: [radius, radius],
  radius: radius - gapSize,
  style: {
    width: 'auto',
    height: 'auto',
  },
  animate: true,
  labelStyle: {
    fill: '#fff',
    transition: '.3s',
    fontSize: 18,
    fontFamily: 'Lato',
    pointerEvents: 'none',
  },
};

type PieChartSectionProps = {
  stageIndex: null | number;
  onStageChange: (newStageIndex: null | number) => void;
  tagRelevancy: { [key: string]: number };
  tags: TagType[];
};

const PieChartSection: FC<PieChartSectionProps> = ({
  stageIndex,
  onStageChange,
  tagRelevancy,
  tags,
}) => {
  const { isMobile } = useMobile()[1];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { locale } = useRouter() as TRouter;
  const { pieChartSectionTitle } = uxcpLocalization[locale];

  const handleActive = useCallback(
    index => {
      const newStageIndex = stageIndex === index ? null : index;
      onStageChange(newStageIndex);
    },
    [stageIndex],
  );

  const { data, isDefault } = useMemo(() => {
    const percentage = calculatePercentage(tagRelevancy);
    let isDefault = true;
    let data = [{ name: '', value: 100, color: '#D9D9D9' }];

    if (percentage) {
      isDefault = false;
      data = tags.map(({ title, styles: { backgroundColor } }, index) => ({
        name: title[locale],
        value: percentage[index],
        color: backgroundColor,
      }));
    }

    return { data, isDefault };
  }, [tagRelevancy]);

  const handleClick = useCallback(
    (_, index) => {
      !isDefault && handleActive(index);
    },
    [isDefault, handleActive],
  );

  const handleMouseOver = useCallback(
    (e, index) => {
      !isDefault && setHoveredIndex(index);
    },
    [isDefault],
  );

  const handleMouseOut = useCallback(() => {
    !isDefault && setHoveredIndex(null);
  }, [isDefault]);

  useEffect(() => {
    if (stageIndex !== null) {
      if (data[0].name === '' || data[stageIndex].value === 0) {
        onStageChange(null);
      }
    }
  }, [data, stageIndex, onStageChange]);

  const sectionStyles = useMemo(() => {
    return {
      padding: '16px 16px 34px',
      marginRight: isMobile ? 0 : 10,
      marginBottom: isMobile ? 30 : 0,
      minWidth: isMobile ? 'auto' : 306,
      boxSizing: 'border-box',
    };
  }, [isMobile]);

  return (
    <Section style={sectionStyles}>
      <div className={styles.SectionTitle}>{pieChartSectionTitle}</div>
      <PieLegend tagRelevancy={tagRelevancy} tags={tags} />
      {/* @ts-ignore */}
      <PieChart
        {...pieConfig}
        labelPosition={data.length === 1 ? 0 : radius / 2}
        label={({ dataEntry }: any) =>
          dataEntry.percentage < 3 ? '' : Math.round(dataEntry.percentage) + '%'
        }
        segmentsStyle={{
          transition: 'stroke .3s',
          cursor: isDefault ? 'default' : 'pointer',
        }}
        data={data}
        segmentsShift={index => (index === stageIndex ? gapSize : 0)}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
      <PieTooltip data={data} hoveredIndex={hoveredIndex} />
    </Section>
  );
};

export default PieChartSection;
