import cn from 'classnames';

import styles from './CopyButtonLabel.module.scss';

interface CopyButtonLabelProps {
  copied: boolean;
  label: string;
}

const CopyButtonLabel = ({ copied, label }: CopyButtonLabelProps) => (
  <span className={cn(styles.label, { [styles.copied]: copied })}>
    <span className={styles.normal} aria-hidden={copied}>
      {label}
    </span>
    <span className={styles.confirmation} aria-hidden={!copied}>
      Copied
    </span>
  </span>
);

export default CopyButtonLabel;
