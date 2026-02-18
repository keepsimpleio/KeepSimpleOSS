import { FC } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/router';
import Image from 'next/image';
import cn from 'classnames';

import { LifestyleIcon } from '@icons/longevity/LifestyleIcon';
import { StudyIcon } from '@icons/longevity/StudyIcon';
import { DietIcon } from '@icons/longevity/DietIcon';
import { WorkoutIcon } from '@icons/longevity/WorkoutIcon';
import { SleepIcon } from '@icons/longevity/SleepIcon';
import { SupplementsIcon } from '@icons/longevity/SupplementsIcon';
import { TomIcon } from '@icons/longevity/TomIcon';
import NewPageIcon from '@icons/longevity/NewPageIocn';

import styles from './Navigation.module.scss';

const Navigation: FC = () => {
  const router = useRouter();

  // TODO: Move nav items
  const navItems = [
    { name: 'About Project', path: '/tools/longevity-protocol/about-project' },
    {
      name: 'Habits',
      path: '/tools/longevity-protocol/habits/lifestyle',
      hasNoUrl: true,
    },
    {
      name: 'Environment',
      path: '/tools/longevity-protocol/environment',
    },
    { name: 'Results', path: '/tools/longevity-protocol/results' },
    {
      name: 'AI Assistant',
      path: 'https://chatgpt.com/g/g-6952e0caa7c88191b1ba18e63b36dd69-tom-longevity-and-food-guide-by-keepsimple-io',
      icon: <TomIcon />,
    },
  ];

  // TODO: Move sub nav items
  const subNavItems = [
    {
      name: 'Lifestyle',
      path: '/tools/longevity-protocol/habits/lifestyle',
      icon: <LifestyleIcon />,
    },
    {
      name: 'Study',
      path: '/tools/longevity-protocol/habits/study',
      icon: <StudyIcon />,
    },
    {
      name: 'Diet',
      path: '/tools/longevity-protocol/habits/diet',
      icon: <DietIcon />,
    },
    {
      name: 'Workout',
      path: '/tools/longevity-protocol/habits/workout',
      icon: <WorkoutIcon />,
    },
    {
      name: 'Sleep',
      path: '/tools/longevity-protocol/habits/sleep',
      icon: <SleepIcon />,
    },
    {
      name: 'Supplements',
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
              className={cn(styles.item, {
                [styles.itemActive]:
                  router.pathname === item.path ||
                  (router.pathname.includes('habits') && item.hasNoUrl),
              })}
              href={item.path}
              target={item.name.includes('AI Assistant') ? '_blank' : '_self'}
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
              <Link href={item.path} className={styles.subLink}>
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
