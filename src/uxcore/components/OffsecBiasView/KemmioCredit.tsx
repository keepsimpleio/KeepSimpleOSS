import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './KemmioCredit.module.scss';

const KemmioCredit = () => {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Capture phase + stopImmediatePropagation so the parent bias modal
      // doesn't also close on the same Escape press.
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') {
        e.stopImmediatePropagation();
      }
      setOpen(false);
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open]);

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  return (
    <>
      <p className={styles.credit}>
        Examples co-authored with{' '}
        <button
          type="button"
          className={styles.kemmioLink}
          onClick={() => setOpen(true)}
        >
          kemmio
        </button>
        .
      </p>

      {open &&
        portalTarget &&
        createPortal(
          <div
            className={styles.backdrop}
            role="presentation"
            onClick={handleClose}
          >
            <div
              className={styles.dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="kemmio-title"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.closeBtn}
                aria-label="Close"
                onClick={handleClose}
              >
                ×
              </button>

              <h3 id="kemmio-title" className={styles.title}>
                kemmio
                <span className={styles.realName}>
                  {' '}
                  · Vahe Karapetyan{' '}
                  <span
                    className={styles.flagAM}
                    role="img"
                    aria-label="Armenia"
                    title="Armenia"
                  >
                    <svg viewBox="0 0 18 11" width="16" height="10">
                      <rect
                        x="0"
                        y="0"
                        width="18"
                        height="3.67"
                        fill="#D90012"
                      />
                      <rect
                        x="0"
                        y="3.67"
                        width="18"
                        height="3.67"
                        fill="#0033A0"
                      />
                      <rect
                        x="0"
                        y="7.34"
                        width="18"
                        height="3.66"
                        fill="#F2A800"
                      />
                    </svg>
                  </span>
                </span>
              </h3>

              <p className={styles.tagline}>
                Among the most consequential whitehat hackers alive.
              </p>

              <p className={styles.lead}>
                Co-founder of{' '}
                <a
                  href="https://hexens.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.hexensLink}
                >
                  <strong>Hexens</strong>
                </a>
                , the cybersecurity firm whose audits have safeguarded over
                $125B in assets.
              </p>

              <ul className={styles.facts}>
                <li>
                  Made the largest security finding in the history of digital
                  finance: one bug put $70B+ in crypto at risk, confirmed by
                  international experts and covered by{' '}
                  <a
                    href="https://www.coindesk.com/tech/2026/07/04/how-ethical-hackers-with-just-a-usd3-000-server-found-a-flaw-that-could-ve-put-usd70-billion-in-crypto-at-risk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.researchLink}
                  >
                    CoinDesk
                  </a>
                  .
                </li>
                <li>
                  Uncovered the first critical Solidity compiler vulnerability
                  in over a decade: the{' '}
                  <a
                    href="https://hexens.io/research/solidity-compiler-bug-tstore-poison"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.researchLink}
                  >
                    TSTORE poison bug
                  </a>
                  .
                </li>
                <li>
                  Leads the only company in the Web3 space with zero post-audit
                  hacks across 300+ engagements.
                </li>
                <li>
                  Author of{' '}
                  <a
                    href="https://hexens.io/solutions/glider-monitor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.researchLink}
                  >
                    Glider
                  </a>
                  , the tech that has saved over $250M in real-world Web3
                  assets.
                </li>
              </ul>
            </div>
          </div>,
          portalTarget,
        )}
    </>
  );
};

export default KemmioCredit;
