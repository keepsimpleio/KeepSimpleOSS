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
          <div className={styles.cardWrap}>
            <span className={styles.cardCaption}>{before.tag}</span>
            <div className={styles.card}>
              <div className={styles.emailHeader}>
                <span className={styles.cardSender}>{before.sender}</span>
                {before.timestamp && (
                  <span className={styles.cardTimestamp}>
                    {before.timestamp}
                  </span>
                )}
              </div>
              <div className={styles.cardSubject}>{before.subject}</div>
              <div className={styles.cardRule} />
              <div className={styles.cardPreview}>{before.preview}</div>
              {before.attachment && (
                <div className={styles.cardAttachment}>
                  <span className={styles.cardAttachmentIcon}>📎</span>
                  {before.attachment}
                </div>
              )}
            </div>
          </div>

          <div className={styles.cardDivider}>
            <span className={styles.cardArrow}>→</span>
          </div>

          <div className={styles.cardWrap}>
            <span
              className={`${styles.cardCaption} ${styles.cardCaptionFlagged}`}
            >
              {after.tag}
            </span>
            <div className={`${styles.card} ${styles.cardFlagged}`}>
              <div className={styles.emailHeader}>
                <span className={styles.cardSender}>{after.sender}</span>
                {after.timestamp && (
                  <span className={styles.cardTimestamp}>
                    {after.timestamp}
                  </span>
                )}
              </div>
              <div className={styles.cardSubject}>
                <span className={styles.cardUrgencyDot} />
                {after.subject}
              </div>
              <div className={styles.cardRule} />
              <div className={styles.cardPreview}>{after.preview}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.proseBlock} ${styles.whyBlock}`}>
        <span className={styles.eyebrow}>{content.whyItWorksLabel}</span>
        <p>{content.whyItWorks}</p>
      </div>

      <div className={`${styles.proseBlock} ${styles.defenderBlock}`}>
        <span className={styles.eyebrow}>{content.defenseLabel}</span>
        <p className={styles.defenderLede}>{content.defense.lede}</p>
        <ul className={styles.defenderMoves}>
          {content.defense.moves.map((move, i) => (
            <li key={i}>{move}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OffsecBiasView;
