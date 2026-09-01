import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';

import { isLibraryEnabled } from '@constants/library/common';

import type { TRouter } from '@local-types/global';

import useGlobals from '@hooks/useGlobals';
import { useIsWidthLessThan } from '@hooks/useScreenSize';

import navbar from '@data/navbar';

import ArticlesDarkIcon from '@icons/ArticlesDarkIcon';
import ArticlesIcon from '@icons/ArticlesIcon';
import AiAtlasIcon from '@icons/navbar/ai-atlas.svg';
import AiAtlasDarkIcon from '@icons/navbar/ai-atlas-dark.svg';
import LibraryIcon from '@icons/navbar/library.svg';
import LongevityIcon from '@icons/navbar/longevity.svg';
import LongevityDarkIcon from '@icons/navbar/longevity-dark.svg';
import ToolsIcon from '@icons/navbar/tools.svg';
import ToolsDarkIcon from '@icons/navbar/tools-dark.svg';
import UXCoreIcon from '@icons/UXCoreIcon';

import { GlobalContext } from '@components/Context/GlobalContext';

import styles from './Navbar.module.scss';

type NavbarProps = {
  handleToggleSidebar?: () => void;
  handleClick?: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
};

const Navbar: FC<NavbarProps> = ({ handleToggleSidebar, handleClick }) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const isSmallScreen = useIsWidthLessThan(1141);

  const { isDarkTheme, isOpenedSidebar } = useGlobals()[1];
  const { accountData } = useContext(GlobalContext);

  const { articles, contributorsTxt, tools, library, longevity, aiAtlas } =
    navbar[locale];

  const normalizePath = (p: string) => {
    const noQueryOrHash = p.split('?')[0].split('#')[0];
    if (noQueryOrHash.length > 1 && noQueryOrHash.endsWith('/')) {
      return noQueryOrHash.slice(0, -1);
    }
    return noQueryOrHash;
  };

  const routes = [
    {
      name: 'UX Core',
      path: '/uxcore',
      logo: <UXCoreIcon />,
      target: '_blank',
      id: 'uxcore',
    },
    {
      name: longevity,
      path: '/tools/longevity-protocol/about-project',
      logo: isDarkTheme ? <LongevityDarkIcon /> : <LongevityIcon />,
      target: '',
      id: 'longevity',
      activeMatch: '/tools/longevity-protocol',
    },
    {
      name: tools,
      path: '/tools',
      logo: isDarkTheme ? <ToolsIcon /> : <ToolsDarkIcon />,
      target: '',
      id: 'tools',
      activeMatch: '/tools',
      exact: true,
    },
    {
      name: library,
      path: '/library',
      logo: <LibraryIcon className={styles.libraryIcon} />,
      target: '',
      id: 'library',
      activeMatch: '/library',
    },
    {
      name: aiAtlas,
      path: '/ai-atlas',
      logo: isDarkTheme ? <AiAtlasIcon /> : <AiAtlasDarkIcon />,
      target: '',
      id: 'aiAtlas',
    },
    {
      name: articles,
      path: '/articles',
      logo: isDarkTheme ? <ArticlesDarkIcon /> : <ArticlesIcon />,
      target: '',
      id: 'articles',
    },
  ];

  return (
    <aside
      className={cn(styles.aside, {
        [styles.darkTheme]: isDarkTheme,
        [styles.openedSidebar]: isOpenedSidebar,
      })}
    >
      <div
        className={cn(styles.menu, {
          [styles.authorized]: !!accountData,
        })}
      >
        {routes
          .filter(route => route.id !== 'library' || isLibraryEnabled())
          .map(
            ({ name, path, target, logo, id, activeMatch, exact }, index) => {
              const match = activeMatch ?? path;
              const currentPath = normalizePath(router.asPath);
              const matchPath = normalizePath(match);

              const isActive =
                matchPath === '/'
                  ? currentPath === '/'
                  : exact
                    ? currentPath === matchPath
                    : currentPath.startsWith(matchPath);

              return (
                <a
                  key={index}
                  href={path}
                  target={target}
                  onClick={e => {
                    if (target === '_blank') return;
                    e.preventDefault();
                    if (isSmallScreen) handleToggleSidebar();
                    handleClick(e, path);
                  }}
                  className={cn(styles.url, {
                    [styles.active]: isActive,
                    [styles.uxcoreIcon]: id === 'uxcore',
                    [styles.companyManagementIcon]: id === 'companyManagement',
                    [styles.articlesIcon]: id === 'articles',
                    [styles.ruUrl]: locale === 'ru',
                  })}
                >
                  {logo} {name}
                </a>
              );
            },
          )}

        <a
          href={'/contributors'}
          onClick={e => {
            e.preventDefault();
            if (isSmallScreen) handleToggleSidebar();
            handleClick(e, 'contributors');
          }}
          className={styles.contributors}
        >
          {contributorsTxt}
        </a>
      </div>
    </aside>
  );
};

export default Navbar;
