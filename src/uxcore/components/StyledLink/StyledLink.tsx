import { FC } from 'react';

import styles from './StyledLink.module.scss';

type TStyledLink = {
  href: string;
  title: string;
  target?: '_self' | '_blank';
};

const StyledLink: FC<TStyledLink> = ({ href, title, target = '_self' }) => {
  return (
    <a
      className={styles.StyledLink}
      href={href}
      target={target}
      rel="noopener noreferrer"
    >
      {title}
    </a>
  );
};

export default StyledLink;
