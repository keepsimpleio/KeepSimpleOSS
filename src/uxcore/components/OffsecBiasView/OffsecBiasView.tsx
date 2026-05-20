import { OffSecIcon } from '@uxcore/assets/icons/OffSecIcon';
import { OffsecBiasContent } from '@uxcore/data/biasOffsec';

import styles from './OffsecBiasView.module.scss';

interface OffsecBiasViewProps {
  content: OffsecBiasContent;
}

const OffsecBiasView = ({ content }: OffsecBiasViewProps) => {
  const { before, after } = content.visual;

  return (
    <div className={styles.root}>
      <p className={styles.intro}>{content.intro}</p>

      <div className={styles.scenarioBlock}>
        <span className={styles.eyebrow}>{content.scenarioLabel}</span>
        <p className={styles.scenario}>{content.scenario}</p>
      </div>

      <div className={styles.visualBlock}>
        <div className={styles.visualHeader}>
          <span className={styles.markWrap}>
            <OffSecIcon />
          </span>
          <span className={styles.eyebrow}>{content.visualLabel}</span>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardTag}>{before.tag}</div>
            <div className={styles.cardSender}>{before.sender}</div>
            <div className={styles.cardSubject}>{before.subject}</div>
            <div className={styles.cardPreview}>{before.preview}</div>
            <div className={styles.cardStat}>
              <span className={styles.cardStatValue}>{before.stat.value}</span>
              <span className={styles.cardStatLabel}>{before.stat.label}</span>
            </div>
          </div>

          <div className={styles.cardDivider}>
            <span className={styles.cardArrow}>→</span>
          </div>

          <div className={`${styles.card} ${styles.cardFlagged}`}>
            <div className={styles.cardTag}>{after.tag}</div>
            <div className={styles.cardSender}>{after.sender}</div>
            <div className={styles.cardSubject}>
              <span className={styles.cardUrgencyDot} />
              {after.subject}
            </div>
            <div className={styles.cardPreview}>{after.preview}</div>
            <div className={styles.cardStat}>
              <span className={styles.cardStatValue}>{after.stat.value}</span>
              <span className={styles.cardStatLabel}>{after.stat.label}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.outcomeBlock}>
        <div className={styles.outcomeRow}>
          <span className={styles.outcomeKey}>
            {content.outcome.withoutLabel}
          </span>
          <span className={styles.outcomeValue}>
            {content.outcome.withoutText}
          </span>
        </div>
        <div className={`${styles.outcomeRow} ${styles.outcomeRowAccent}`}>
          <span className={styles.outcomeKey}>{content.outcome.withLabel}</span>
          <span className={styles.outcomeValue}>
            {content.outcome.withText}
          </span>
        </div>
      </div>

      <div className={styles.proseBlock}>
        <span className={styles.eyebrow}>{content.whyItWorksLabel}</span>
        <p>{content.whyItWorks}</p>
      </div>

      <div className={`${styles.proseBlock} ${styles.defenderBlock}`}>
        <span className={styles.eyebrow}>{content.blueTeamLabel}</span>
        <p>{content.blueTeam}</p>
      </div>
    </div>
  );
};

export default OffsecBiasView;
