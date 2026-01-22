import { FC } from 'react';
import Link from 'next/link';

import styles from './Navigation.module.scss';
import { useRouter } from 'next/router';
import Image from 'next/image';
import cn from 'classnames';
import { LifestyleIcon } from '@icons/longevity/LifestyleIcon';
import { StudyIcon } from '@icons/longevity/StudyIcon';
import { DietIcon } from '@icons/longevity/DietIcon';
import { WorkoutIcon } from '@icons/longevity/WorkoutIcon';
import { SleepIcon } from '@icons/longevity/SleepIcon';
import { SupplementsIcon } from '@icons/longevity/SupplementsIcon';
// import { TomIcon } from '@icons/longevity/TomIcon';

const Navigation: FC = () => {
  const router = useRouter();
  // const [openSubMenu, setOpenSubMenu] = useState(false);
  const navItems = [
    { name: 'What is this?', path: '/tools/longevity-protocol/what-is-this' },
    {
      name: '1.0 Habits (Protocols)',
      path: '/tools/longevity-protocol/habits',
      hasNoUrl: true,
    },
    {
      name: '2.0 Environment (Devices, other)',
      path: '/tools/longevity-protocol/environment',
    },
    { name: '3.0 Results', path: '/tools/longevity-protocol/results' },
    { name: 'AI Assistant', path: '/tools/longevity-protocol/environment' },
  ];

  const subNavItems = [
    {
      name: 'Lifestyle',
      path: '/tools/longevity-protocol/habits',
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
    <nav>
      <ul className={styles.ul}>
        {navItems.map(item => (
          <Link
            key={item.path}
            className={cn(styles.item, {
              [styles.subItemActive]: router.pathname === item.path,
              // (item.hasNoUrl &&
              //   (openSubMenu || router.pathname.includes('habits'))),
            })}
            href={item.path}
            onClick={e => {
              // if (item.hasNoUrl) {
              //   e.preventDefault();
              //   setOpenSubMenu(!openSubMenu);
              // }
            }}
          >
            {/*<li className={styles.link}>*/}
            {/*  {item.icon && item.icon}*/}
            {/*  {item.name}*/}
            {/*</li>*/}
          </Link>
        ))}
      </ul>
      <div className={styles.subNav}>
        <Image
          src={'/keepsimple_/assets/longevity/curtains.png'}
          alt={'Curtains'}
          width={1140}
          height={83}
          className={cn(styles.curtains, {
            [styles.curtainsOpen]: router.pathname.includes('habits'),
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
