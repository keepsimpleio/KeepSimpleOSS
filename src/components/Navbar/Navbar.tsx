import React, { FC, useContext } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import type { TRouter } from '@local-types/global';

import useGlobals from '@hooks/useGlobals';
import { GlobalContext } from '@components/Context/GlobalContext';

import navbar from '@data/navbar';

import { useIsWidthLessThan } from '@hooks/useScreenSize';

import UXCoreIcon from '@icons/UXCoreIcon';
import CompanyManagementIcon from '@icons/CompanyManagementIcon';
import ArticlesIcon from '@icons/ArticlesIcon';
import ArticlesDarkIcon from '@icons/ArticlesDarkIcon';

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

  const { about, companyManagement, articles, contributorsTxt } =
    navbar[locale];

  const routes = [
    { name: about, path: '/', logo: '', target: '' },
    {
      name: 'UX Core',
      path: '/uxcore',
      logo: <UXCoreIcon />,
      target: '_blank',
      id: 'uxcore',
    },
    {
      name: companyManagement,
      path: '/company-management',
      logo: <CompanyManagementIcon />,
      target: '',
      id: 'companyManagement',
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
        {routes.map(({ name, path, target, logo, id }, index) => (
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
              [styles.active]:
                path === '/'
                  ? router.asPath === '/'
                  : router.asPath.startsWith(path),
              [styles.uxcoreIcon]: id === 'uxcore',
              [styles.companyManagementIcon]: id === 'companyManagement',
              [styles.articlesIcon]: id === 'articles',
              [styles.ruUrl]: locale === 'ru',
            })}
          >
            {logo} {name}
          </a>
        ))}
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
