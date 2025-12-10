import { FC, useContext } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { flushSync } from 'react-dom';

import { handleMixpanelClick } from '../../../lib/mixpanel';

import { GlobalContext } from '@components/Context/GlobalContext';

import styles from './ToolContainer.module.scss';

type ToolContainerProps = {
  size: 'small' | 'medium' | 'large';
  icon: any;
  japaneseName: string;
  url: string;
  description: string;
  name: string;
  darkTheme?: boolean;
  russianView?: boolean;
  id: string;
  inView?: boolean;
};
const ToolContainer: FC<ToolContainerProps> = ({
  size,
  icon,
  description,
  japaneseName,
  name,
  darkTheme,
  url,
  russianView,
  id,
  inView,
}) => {
  const router = useRouter();
  const { setShowLoader, videoRef } = useContext(GlobalContext);

  const handleClick = e => {
    e.preventDefault();
    if (id === 'company-management') {
      handleMixpanelClick(
        'Click',
        'Homepage > Tools > Pyramid',
        'Homepage',
        'Pyramid',
      );
      flushSync(() => {
        setShowLoader(true);
      });
      requestAnimationFrame(() => {
        videoRef.current?.play();
      });

      setTimeout(() => {
        router.push(url);
      }, 300);

      setTimeout(() => {
        videoRef.current?.pause();
        setShowLoader(false);
      }, 800);
    }
    if (id === 'bob') {
      handleMixpanelClick(
        'Bob Link Clicked',
        'Homepage > Tools > Bob',
        'Homepage',
        'Bob',
      );
      window.open(url, '_blank');
    }
    if (id === 'uxcore') {
      handleMixpanelClick(
        'UXCore Link Clicked',
        'Homepage > Tools > UXC',
        'Homepage',
        'UXCore',
      );
      router.push(url);
    }
  };

  return (
    <div
      className={cn(styles.tool, {
        [styles.toolDarkTheme]: darkTheme,
        [styles.smallWrapper]: size === 'small',
        [styles.mediumWrapper]: size === 'medium',
        [styles.largeWrapper]: size === 'large',
        [styles.inViewSmall]: inView && size === 'small',
        [styles.inViewMedium]: inView && size === 'medium',
        [styles.inViewLarge]: inView && size === 'large',
      })}
      data-test-id="tool"
      onClick={e => handleClick(e)}
    >
      <div
        className={cn(styles.wrapper, {
          [styles.small]: size === 'small',
          [styles.medium]: size === 'medium',
          [styles.large]: size === 'large',
          [styles.darkTheme]: darkTheme,
          [styles.russianView]: russianView,
        })}
      >
        <div className={styles.mainContent}>
          <div className={styles.iconWrapper}>
            {icon}
            <h3 className={styles.japaneseName}> {japaneseName}</h3>{' '}
          </div>
          <h4 className={styles.name}>{name}</h4>
          <div
            className={styles.quote}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToolContainer;
