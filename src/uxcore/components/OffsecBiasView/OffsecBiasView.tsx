import { OffsecBiasContent } from '@uxcore/data/biasOffsec';

import styles from './OffsecBiasView.module.scss';

interface OffsecBiasViewProps {
  content: OffsecBiasContent;
}

const OffsecBiasView = ({ content }: OffsecBiasViewProps) => {
  const { before, after } = content.visual;

  return (
    <div className={styles.root}>
      <div className={styles.visualBlock}>
        <span className={styles.eyebrow}>{content.visualLabel}</span>
        <p className={styles.scenario}>{content.scenario}</p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardTag}>{before.tag}</div>
            <div className={styles.cardSender}>{before.sender}</div>
            <div className={styles.cardSubject}>{before.subject}</div>
            <div className={styles.cardPreview}>{before.preview}</div>
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
          </div>
        </div>
      </div>

      <div className={styles.proseBlock}>
        <span className={styles.eyebrow}>{content.whyItWorksLabel}</span>
        <p>{content.whyItWorks}</p>
      </div>

      <div className={`${styles.proseBlock} ${styles.defenderBlock}`}>
        <span className={styles.eyebrow}>{content.blueTeamLabel}</span>
        <p className={styles.defenderLede}>{content.blueTeam.lede}</p>
        <ul className={styles.defenderMoves}>
          {content.blueTeam.moves.map((move, i) => (
            <li key={i}>{move}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OffsecBiasView;
