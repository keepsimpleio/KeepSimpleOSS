import cn from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';

import Checkmark from '@icons/Checkmark';
import CopyIcon from '@icons/CopyIcon';

import styles from './CodeSnippet.module.scss';

interface CodeSnippetProps {
  code: string;
}

const CodeSnippet: FC<CodeSnippetProps> = ({ code }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const copyCodeRef = useRef(null);

  function copyToClipboard() {
    const { selectionStart, selectionEnd } = copyCodeRef.current;
    copyCodeRef.current.select();
    document.execCommand('copy');

    copyCodeRef.current.setSelectionRange(selectionStart, selectionEnd);
    setCopySuccess(!copySuccess);
  }

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  return (
    <div className={styles.codeSnippet}>
      <div className={styles.copyField}>
        <div
          className={cn(styles.copy, {
            [styles.copied]: copySuccess,
            [styles.notCopied]: !copySuccess,
          })}
        >
          {copySuccess ? <Checkmark /> : <CopyIcon />}
          <span
            onClick={copyToClipboard}
            className={styles.copyText}
            data-cy={'copy-code'}
            data-copied={
              process.env.NEXT_PUBLIC_ENV === 'prod'
                ? undefined
                : copyCodeRef.current?.value || ''
            }
          >
            {copySuccess ? 'Copied!' : 'Copy code'}
          </span>
        </div>
      </div>
      <div className={styles.copyCode}>
        <textarea
          readOnly
          ref={copyCodeRef}
          value={code}
          className={styles.code}
        />
      </div>
    </div>
  );
};

export default CodeSnippet;
