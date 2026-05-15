import uxcpLocalization from '@uxcore/data/uxcp';
import type { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import styles from './UXCPDescription.module.scss';

const UXCPDescription: FC = () => {
  const { locale } = useRouter() as TRouter;
  const { welcome, description, descriptionLink } = uxcpLocalization[locale];

  const { info, title, href, target } = descriptionLink;

  return (
    <div className={styles.ContentTitle}>
      <p className={styles.ContentTitleDescription}>
        <b>{welcome}</b>
        {description}
        <br />
        <span>
          {info}
          <a href={href} target={target} className={styles.Link}>
            {title}
          </a>
        </span>
      </p>
    </div>
  );
};

export default UXCPDescription;
