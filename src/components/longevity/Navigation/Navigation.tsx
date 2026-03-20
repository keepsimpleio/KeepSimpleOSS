import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { TRouter } from '@local-types/global';

import longevityData from '@data/longevity';

import { DietIcon } from '@icons/longevity/DietIcon';
import { LifestyleIcon } from '@icons/longevity/LifestyleIcon';
import NewPageIcon from '@icons/longevity/NewPageIocn';
import { SleepIcon } from '@icons/longevity/SleepIcon';
import { StudyIcon } from '@icons/longevity/StudyIcon';
import { SupplementsIcon } from '@icons/longevity/SupplementsIcon';
import { TomIcon } from '@icons/longevity/TomIcon';
import { WorkoutIcon } from '@icons/longevity/WorkoutIcon';

import styles from './Navigation.module.scss';

const Navigation: FC = () => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { navigationItems, subNavigationItems } = longevityData[locale];

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

  return (
    <nav className={styles.nav}>
      <ul className={styles.ul}>
        {navItems.map((item, key) => {
          return (
            <Link
              key={key}
              scroll={false}
              className={cn(styles.item, {
                [styles.itemActive]:
                  router.pathname === item.path ||
                  (router.pathname.includes('habits') && item.hasNoUrl),
              })}
              href={item.path}
              target={item.path.startsWith('https://') ? '_blank' : '_self'}
            >
              <li className={styles.link}>
                {item.icon && item.icon}
                {item.name}
                {key === 4 && <NewPageIcon />}
              </li>
            </Link>
          );
        })}
      </ul>
      <div className={styles.subNav}>
        <Image
          src={'/keepsimple_/assets/longevity/curtains.png'}
          alt={'Curtains'}
          width={1140}
          height={83}
          className={cn(styles.curtains, {
            [styles.curtainsOpen]: !router.asPath.includes('about-project'),
          })}
        />
        <ul className={styles.subUl}>
          {subNavItems.map(item => (
            <li
              key={item.path}
              className={cn(styles.subItem, {
                [styles.subItemActive]: router.pathname === item.path,
              })}
            >
              <Link href={item.path} className={styles.subLink} scroll={false}>
                {item.icon && item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
