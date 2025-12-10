import { type FC } from 'react';
import cn from 'classnames';

import useMobile from '@hooks/useMobile';

import styles from './PyramidAuthors.module.scss';

interface PyramidAuthorsProps {
  contributors: string;
}

const PyramidAuthors: FC<PyramidAuthorsProps> = ({ contributors }) => {
  const { isMobile } = useMobile()[1];

  return (
    <div className={cn(styles.container, { [styles.mobile]: isMobile })}>
      <div dangerouslySetInnerHTML={{ __html: contributors }} />
    </div>
  );
};

export default PyramidAuthors;
