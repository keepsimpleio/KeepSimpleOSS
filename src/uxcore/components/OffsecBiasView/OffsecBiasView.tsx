import { OffsecBiasCard, OffsecBiasContent } from '@uxcore/data/biasOffsec';

import KemmioCredit from './KemmioCredit';

import styles from './OffsecBiasView.module.scss';

interface OffsecBiasViewProps {
  content: OffsecBiasContent;
}

const CardBody = ({ card }: { card: OffsecBiasCard }) => {
  if (card.kind === 'email') {
    return (
      <>
        <div className={styles.emailHeader}>
          <span className={styles.emailEnvelope} aria-hidden="true">
            <svg
              viewBox="0 0 20 16"
              width="18"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            >
              <rect x="1" y="1" width="18" height="14" rx="2" />
              <path d="M1.6 2.2 L10 9 L18.4 2.2" />
            </svg>
          </span>
          <span className={styles.emailFromLabel}>From</span>
          <span className={styles.cardSender}>{card.sender}</span>
          {card.timestamp && (
            <span className={styles.cardTimestamp}>{card.timestamp}</span>
          )}
        </div>
        <div className={styles.cardSubject}>
          {card.flagged && <span className={styles.cardUrgencyDot} />}
          {card.subject}
        </div>
        <div className={styles.cardRule} />
        <div className={styles.cardPreview}>{card.preview}</div>
        {card.attachment && (
          <div className={styles.cardAttachment}>
            <span className={styles.cardAttachmentIcon}>📎</span>
            {card.attachment}
          </div>
        )}
      </>
    );
  }

  if (card.kind === 'notification') {
    return (
      <>
        <div className={styles.notifHeader}>
          <span className={styles.notifAppIcon} aria-hidden="true" />
          <span className={styles.notifAppName}>{card.appName}</span>
          {card.timestamp && (
            <span className={styles.notifTimestamp}>{card.timestamp}</span>
          )}
        </div>
        <div className={styles.notifTitle}>
          {card.flagged && <span className={styles.cardUrgencyDot} />}
          {card.title}
        </div>
        <div className={styles.notifBody}>{card.body}</div>
      </>
    );
  }

  // kind === 'chat'
  return (
    <>
      <div className={styles.chatHeader}>
        <span className={styles.chatAvatar} aria-hidden="true">
          {card.senderName.charAt(0)}
        </span>
        <div className={styles.chatIdentity}>
          <span className={styles.chatSenderName}>{card.senderName}</span>
          {card.senderHandle && (
            <span className={styles.chatSenderHandle}>{card.senderHandle}</span>
          )}
        </div>
        {card.timestamp && (
          <span className={styles.chatTimestamp}>{card.timestamp}</span>
        )}
      </div>
      {card.priorContext && (
        <div className={styles.chatPrior}>↳ {card.priorContext}</div>
      )}
      <div className={styles.chatBubble}>
        {card.flagged && <span className={styles.cardUrgencyDot} />}
        <span>{card.body}</span>
      </div>
    </>
  );
};

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
            <div className={`${styles.card} ${styles[`card_${before.kind}`]}`}>
              <CardBody card={before} />
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
            <div
              className={`${styles.card} ${styles[`card_${after.kind}`]} ${styles.cardFlagged}`}
            >
              <CardBody card={after} />
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

      <KemmioCredit />
    </div>
  );
};

export default OffsecBiasView;
