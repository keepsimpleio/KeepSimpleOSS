import { FC, useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/router';
import cn from 'classnames';

import BorderedPill from '@components/longevity/BorderedPill';

import { TRouter } from '@local-types/global';

import longevityData from '@data/longevity';

import { LifestyleIcon } from '@icons/longevity/LifestyleIcon';
import { StudyIcon } from '@icons/longevity/StudyIcon';
import { DietIcon } from '@icons/longevity/DietIcon';
import { WorkoutIcon } from '@icons/longevity/WorkoutIcon';
import { SleepIcon } from '@icons/longevity/SleepIcon';
import { SupplementsIcon } from '@icons/longevity/SupplementsIcon';
import { TomIcon } from '@icons/longevity/TomIcon';
import NewPageIcon from '@icons/longevity/NewPageIocn';
import Divider from '@icons/longevity/Divider';
import NavigationIcon from '@icons/longevity/NavigationIcon';

import { useClickOutside } from '@lib/useClickOutside';

import styles from './MobileNavigation.module.scss';

const MobileNavigation: FC = () => {
  const router = useRouter();
  const { locale } = router as TRouter;

  const { navigationItems, subNavigationItems, nextBtn, contentsTxt } =
    longevityData[locale];
  const [openNav, setOpenNav] = useState(false);
  const [openSubNav, setOpenSubNav] = useState(false);

  const isInternal = (path: string) => path.startsWith('/');

  const toggleNavbar = () => {
    setOpenNav(false);
  };

  const ref = useClickOutside(toggleNavbar);

  // TODO: Move nav items
  const navItems = [
    {
      name: navigationItems?.aboutProject,
      path: '/tools/longevity-protocol/about-project',
    },
    {
      name: navigationItems?.habits,
      path: '/tools/longevity-protocol/habits/lifestyle',
      hasNoUrl: true,
    },
    {
      name: navigationItems?.environment,
      path: '/tools/longevity-protocol/environment',
    },
    {
      name: navigationItems?.results,
      path: '/tools/longevity-protocol/results',
    },
    {
      name: navigationItems?.aiAssistant,
      path: 'https://chatgpt.com/g/g-6952e0caa7c88191b1ba18e63b36dd69-tom-longevity-and-food-guide-by-keepsimple-io',
      icon: <TomIcon />,
    },
  ];

  // TODO: Move sub nav items
  const subNavItems = [
    {
      name: subNavigationItems?.lifestyle,
      path: '/tools/longevity-protocol/habits/lifestyle',
      icon: <LifestyleIcon />,
    },
    {
      name: subNavigationItems?.study,
      path: '/tools/longevity-protocol/habits/study',
      icon: <StudyIcon />,
    },
    {
      name: subNavigationItems?.diet,
      path: '/tools/longevity-protocol/habits/diet',
      icon: <DietIcon />,
    },
    {
      name: subNavigationItems?.workout,
      path: '/tools/longevity-protocol/habits/workout',
      icon: <WorkoutIcon />,
    },
    {
      name: subNavigationItems?.sleep,
      path: '/tools/longevity-protocol/habits/sleep',
      icon: <SleepIcon />,
    },
    {
      name: subNavigationItems?.supplements,
      path: '/tools/longevity-protocol/habits/supplements',
      icon: <SupplementsIcon />,
    },
  ];
  const getActiveNavItemName = (nav1, nav2 = []) => {
    const pathname = router.pathname;

    const active =
      nav1.find(i => !i.hasNoUrl && i.path === pathname) ??
      nav2.find(i => i.path === pathname);

    return active?.name ?? '';
  };

  // TODO - Get back to this

  const buildNavOrder = (nav1: any[], nav2: any[]) => {
    const out: any[] = [];

    for (const item of nav1) {
      if (item.hasNoUrl) {
        out.push(...nav2);
        continue;
      }

      if (!isInternal(item.path)) continue;
      out.push(item);
    }
    return out;
  };

  const getNextNavItem = (nav1: any[], nav2: any[] = []) => {
    const pathname = router.pathname;
    const ordered = buildNavOrder(nav1, nav2);

    const currentIndex = ordered.findIndex(i => i.path === pathname);
    if (currentIndex === -1) return null;

    const nextIndex = (currentIndex + 1) % ordered.length;
    const next = ordered[nextIndex];

    return next ? { name: next.name, path: next.path } : null;
  };

  const isHabitsItem = (item: { hasNoUrl?: boolean }) => Boolean(item.hasNoUrl);

  const nextPathname = getNextNavItem(navItems, subNavItems);

  return (
    <>
      <nav className={styles.nav} ref={ref}>
        <button
          className={styles.activePage}
          onClick={() => setOpenNav(!openNav)}
        >
          {getActiveNavItemName(navItems, subNavItems)}
          <span className={styles.txtAndIcon}>
            <span
              className={cn(styles.contentsTxt, {
                [styles.disableContentsTxt]: openNav,
              })}
            >
              {contentsTxt}
            </span>
            <NavigationIcon
              className={cn(styles.arrow, {
                [styles.openArrow]: openNav,
              })}
            />
          </span>
        </button>
        <ul className={cn(styles.navList, { [styles.open]: openNav })}>
          {navItems.map(item => (
            <li
              key={item.path}
              className={cn(styles.li, {
                [styles.active]: router.pathname === item.path,
                [styles.habitsLi]: isHabitsItem(item),
              })}
              onClick={() => {
                if (isHabitsItem(item)) {
                  setOpenSubNav(!openSubNav);
                } else {
                  setOpenNav(!openNav);
                }
              }}
            >
              <span
                className={cn(styles.txtAndIcon, {
                  [styles.habitsTxtAndIcon]: isHabitsItem(item),
                })}
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                {item.hasNoUrl ? (
                  <span className={styles.link}>{item.name}</span>
                ) : (
                  <Link
                    href={item.path}
                    passHref
                    className={styles.link}
                    target={isInternal(item.path) ? '_self' : '_blank'}
                  >
                    {item.name}
                  </Link>
                )}
                {isHabitsItem(item) && (
                  <NavigationIcon
                    className={cn(styles.habitsArrow, {
                      [styles.openHabitsArrow]: openSubNav,
                    })}
                  />
                )}
              </span>
              {item.icon && <NewPageIcon />}

              <Divider className={styles.divider} />
              {isHabitsItem(item) && (
                <ul
                  className={cn(styles.subNav, {
                    [styles.openSubNav]:
                      openSubNav || router.pathname.includes('habits'),
                  })}
                >
                  {subNavItems.map(subItem => (
                    <li
                      key={subItem.path}
                      className={cn(styles.subLi, {
                        [styles.active]: router.pathname === subItem.path,
                      })}
                      onClick={() => setOpenNav(!openNav)}
                    >
                      <span className={styles.icon}>{subItem.icon}</span>
                      <Link
                        href={subItem.path}
                        passHref
                        className={styles.link}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <BorderedPill
        className={styles.nextButton}
        onClick={() => nextPathname && router.push(nextPathname.path)}
      >
        <span className={styles.nextStaticTxt}>{nextBtn}</span>{' '}
        <span className={styles.nextPage}> {nextPathname.name}</span>
      </BorderedPill>
    </>
  );
};

export default MobileNavigation;
