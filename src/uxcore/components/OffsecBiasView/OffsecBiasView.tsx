import { OffsecBiasCard, OffsecBiasContent } from '@uxcore/data/biasOffsec';
import cn from 'classnames';

import KemmioCredit from './KemmioCredit';

import styles from './OffsecBiasView.module.scss';

interface OffsecBiasViewProps {
  content: OffsecBiasContent;
}

const CardBody = ({ card }: { card: OffsecBiasCard }) => {
  // Chat renders its own priorContext after the sender header; every
  // other surface shows it as a soft lead-in line at the top.
  const prior =
    card.kind !== 'chat' && card.priorContext ? (
      <div className={styles.cardPrior}>↳ {card.priorContext}</div>
    ) : null;

  if (card.kind === 'email') {
    return (
      <>
        {prior}
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

  if (card.kind === 'browser') {
    const protocol = card.protocol || 'https';
    return (
      <>
        {prior}
        <div className={styles.browserChrome}>
          <span className={styles.browserDots} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className={styles.browserUrlBar}>
            <span className={styles.browserPadlock} aria-hidden="true">
              <svg
                viewBox="0 0 14 14"
                width="11"
                height="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              >
                <rect x="2.5" y="6" width="9" height="6.5" rx="1" />
                <path d="M4.5 6 V4 a2.5 2.5 0 0 1 5 0 V6" />
              </svg>
            </span>
            <span className={styles.browserProtocol}>{protocol}://</span>
            <span className={styles.browserHost}>{card.host}</span>
            {card.path && (
              <span className={styles.browserPath}>{card.path}</span>
            )}
          </span>
        </div>
        <div className={styles.browserPageHeading}>
          {card.flagged && <span className={styles.cardUrgencyDot} />}
          {card.pageHeading}
        </div>
        <div className={styles.cardRule} />
        <div className={styles.browserPageBody}>{card.pageBody}</div>
        {card.cta && <div className={styles.browserCta}>{card.cta}</div>}
      </>
    );
  }

  if (card.kind === 'notification') {
    return (
      <>
        {prior}
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

  if (card.kind === 'call') {
    return (
      <>
        {prior}
        <div className={styles.callHeader}>
          <span className={styles.callIcon} aria-hidden="true">
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 2.5 L5.5 2 L7 5 L5.5 6.5 C6.2 8.2 7.8 9.8 9.5 10.5 L11 9 L14 10.5 L13.5 13 C13.2 13.8 12.4 14.2 11.6 14 C7 12.8 3.2 9 2 4.4 C1.8 3.6 2.2 2.8 3 2.5 Z" />
            </svg>
          </span>
          <div className={styles.callIdentity}>
            <span className={styles.callKicker}>Incoming call</span>
            <span className={styles.callName}>{card.callerName}</span>
            {card.callerLabel && (
              <span className={styles.callSub}>{card.callerLabel}</span>
            )}
          </div>
          {card.timestamp && (
            <span className={styles.cardTimestamp}>{card.timestamp}</span>
          )}
        </div>
        <div className={styles.cardRule} />
        <div className={styles.callTranscript}>
          {card.flagged && <span className={styles.cardUrgencyDot} />}
          <span>“{card.transcript}”</span>
        </div>
        <div className={styles.callActions} aria-hidden="true">
          <span className={styles.callDecline}>✕</span>
          <span className={styles.callAccept}>✓</span>
        </div>
      </>
    );
  }

  if (card.kind === 'document') {
    return (
      <>
        {prior}
        <div className={styles.docHeader}>
          {card.logo && (
            <span className={styles.docLogo} aria-hidden="true">
              {card.logo}
            </span>
          )}
          <span className={styles.docLabel}>{card.docLabel}</span>
        </div>
        <div className={styles.cardSubject}>
          {card.flagged && <span className={styles.cardUrgencyDot} />}
          {card.title}
        </div>
        {card.meta && <div className={styles.docMeta}>{card.meta}</div>}
        <div className={styles.cardRule} />
        <div className={styles.cardPreview}>{card.body}</div>
        {card.footer && <div className={styles.docFooter}>{card.footer}</div>}
      </>
    );
  }

  if (card.kind === 'poster') {
    return (
      <>
        {prior}
        <div className={styles.posterTape} aria-hidden="true" />
        <div className={styles.posterHeading}>
          {card.flagged && <span className={styles.cardUrgencyDot} />}
          {card.heading}
        </div>
        <div className={styles.posterBody}>{card.body}</div>
        <div className={styles.posterQr} aria-hidden="true">
          <svg viewBox="0 0 29 29" width="72" height="72">
            <rect
              x="0"
              y="0"
              width="29"
              height="29"
              fill="currentColor"
              opacity="0.06"
            />
            <g fill="currentColor">
              <path d="M2 2h7v7H2zM4 4h3v3H4z" fillRule="evenodd" />
              <path d="M20 2h7v7h-7zM22 4h3v3h-3z" fillRule="evenodd" />
              <path d="M2 20h7v7H2zM4 22h3v3H4z" fillRule="evenodd" />
              <path d="M12 2h2v2h-2zM16 3h2v2h-2zM12 6h3v2h-3zM11 11h2v3h-2zM15 12h4v2h-4zM21 12h2v2h-2zM25 11h2v2h-2zM3 12h3v2H3zM7 15h3v2H7zM2 16h2v2H2zM12 16h2v2h-2zM17 16h2v3h-2zM21 17h3v2h-3zM25 16h2v2h-2zM12 20h2v3h-2zM15 21h2v2h-2zM20 21h2v2h-2zM24 20h3v2h-3zM12 25h3v2h-3zM18 24h2v3h-2zM22 25h2v2h-2zM25 24h2v3h-2z" />
            </g>
          </svg>
        </div>
        {card.qrCaption && (
          <div className={styles.posterCaption}>{card.qrCaption}</div>
        )}
      </>
    );
  }

  if (card.kind === 'timeline') {
    return (
      <>
        {prior}
        <div className={styles.timeline}>
          {card.items.map((item, i) => (
            <div
              key={i}
              className={cn(styles.timelineItem, {
                [styles.timelineItemFlagged]: item.flagged,
              })}
            >
              <span className={styles.timelineLabel}>
                {item.flagged && <span className={styles.cardUrgencyDot} />}
                {item.label}
              </span>
              <div className={styles.timelineBody}>
                <span className={styles.timelineSource}>{item.source}</span>
                <span className={styles.timelineText}>{item.text}</span>
              </div>
            </div>
          ))}
        </div>
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
      {card.attachment && (
        <div className={styles.cardAttachment}>
          <span className={styles.cardAttachmentIcon}>📎</span>
          {card.attachment}
        </div>
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
    // The global ks-offsec class opts this subtree out of the modal's
    // dark-theme span neutralizer (see UXCoreModal.module.scss), so the
    // card icons and badges keep their own backgrounds and colors.
    <div className={cn(styles.root, 'ks-offsec')}>
      <div className={styles.visualBlock}>
        {content.tell && (
          <div className={styles.tell}>
            <span className={styles.tellKey}>The tell</span>
            <span className={styles.tellText}>{content.tell}</span>
          </div>
        )}
        <span className={styles.eyebrow}>{content.visualLabel}</span>
        <p className={styles.scenario}>{content.scenario}</p>

        <div className={styles.cards}>
          <div className={styles.cardWrap}>
            <span className={styles.cardCaption}>{before.tag}</span>
            <div className={cn(styles.card, styles[`card_${before.kind}`])}>
              <CardBody card={before} />
            </div>
          </div>

          <div className={styles.cardDivider}>
            <span className={styles.cardArrow}>→</span>
          </div>

          <div className={styles.cardWrap}>
            <span className={cn(styles.cardCaption, styles.cardCaptionFlagged)}>
              {after.tag}
            </span>
            <div
              className={cn(
                styles.card,
                styles[`card_${after.kind}`],
                styles.cardFlagged,
              )}
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
