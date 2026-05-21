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
                <span className={styles.realName}> — Vahe Karapetyan 🇦🇲</span>
              </h3>

              <p className={styles.lead}>
                Co-founder of <strong>Hexens</strong> — the cybersecurity firm
                whose audits have safeguarded over $125B in assets.
              </p>

              <ul className={styles.facts}>
                <li>
                  Authored the Aptos critical-vulnerability research —
                  unpatched, the flaw would have erased over $1T from Web3.
                </li>
                <li>
                  Authored the disclosure behind the largest critical
                  vulnerability in Web3 history — $500M of instant loss and
                  $1.7T of cascade-effect damage on the table. Caught in private
                  disclosure; exploitation never landed.
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
