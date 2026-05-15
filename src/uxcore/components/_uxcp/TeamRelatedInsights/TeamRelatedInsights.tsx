import BiasActionCell from '@uxcore/components/_uxcp/BiasActionCell';
import Section from '@uxcore/components/Section';
import uxcpLocalization from '@uxcore/data/uxcp';
import useMobile from '@uxcore/hooks/useMobile';
import { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';

import styles from './TeamRelatedInsights.module.scss';

type TeamRelatedInsightsProps = {
  personaName: string;
  insights: StrapiBiasType[];
  setRemovableBiasId: (removableBiasId: number) => void;
};

const TeamRelatedInsights: FC<TeamRelatedInsightsProps> = ({
  personaName,
  insights,
  setRemovableBiasId,
}) => {
  const { isMobile } = useMobile()[1];
  const { locale } = useRouter() as TRouter;
  const {
    teamRelatedInsightsTitle,
    teamRelatedInsightsDescription1,
    teamRelatedInsightsDescription2,
    noData,
  } = uxcpLocalization[locale];

  const sectionStyles = useMemo(() => {
    return {
      padding: isMobile ? '10px 0px 0px' : '10px 24px 24px',
      marginTop: 10,
    };
  }, [isMobile]);

  return (
    <Section style={sectionStyles}>
      <div className={styles.SectionTitle}>{teamRelatedInsightsTitle}</div>
      <div className={styles.SectionDescription}>
        {teamRelatedInsightsDescription1}
        <b>&quot;{personaName}&quot;</b>
        {teamRelatedInsightsDescription2}
      </div>
      <div className={styles.BiasList}>
        {insights.length === 0 && <div className={styles.NoData}>{noData}</div>}
        {insights.map(bias => (
          <BiasActionCell
            key={bias.number}
            bias={bias}
            viewOnly
            setRemovableBiasId={setRemovableBiasId}
          />
        ))}
      </div>
    </Section>
  );
};

export default TeamRelatedInsights;
