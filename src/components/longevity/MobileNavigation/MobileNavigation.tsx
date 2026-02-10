import { FC, useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/router';
import cn from 'classnames';

import { LifestyleIcon } from '@icons/longevity/LifestyleIcon';
import { StudyIcon } from '@icons/longevity/StudyIcon';
import { DietIcon } from '@icons/longevity/DietIcon';
import { WorkoutIcon } from '@icons/longevity/WorkoutIcon';
import { SleepIcon } from '@icons/longevity/SleepIcon';
import { SupplementsIcon } from '@icons/longevity/SupplementsIcon';
import { TomIcon } from '@icons/longevity/TomIcon';
import NewPageIcon from '@icons/longevity/NewPageIocn';

import styles from './MobileNavigation.module.scss';
import NavigationIcon from '@icons/longevity/NavigationIcon';
import Divider from '@icons/longevity/Divider';
import { useClickOutside } from '@lib/useClickOutside';

const MobileNavigation: FC = () => {
  const router = useRouter();
  const [openNav, setOpenNav] = useState(false);
  const [openSubNav, setOpenSubNav] = useState(false);

  const toggleNavbar = () => {
    setOpenNav(false);
  };

  const ref = useClickOutside(toggleNavbar);

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
      name: 'Habits - Lifestyle',
      path: '/tools/longevity-protocol/habits/lifestyle',
      icon: <LifestyleIcon />,
    },
    {
      name: 'Habits - Study',
      path: '/tools/longevity-protocol/habits/study',
      icon: <StudyIcon />,
    },
    {
      name: 'Habits - Diet',
      path: '/tools/longevity-protocol/habits/diet',
      icon: <DietIcon />,
    },
    {
      name: 'Habits - Workout',
      path: '/tools/longevity-protocol/habits/workout',
      icon: <WorkoutIcon />,
    },
    {
      name: 'Habits - Sleep',
      path: '/tools/longevity-protocol/habits/sleep',
      icon: <SleepIcon />,
    },
    {
      name: 'Habits - Supplements',
      path: '/tools/longevity-protocol/habits/supplements',
      icon: <SupplementsIcon />,
    },
  ];
  const getActiveNavItemName = (nav1, nav2) => {
    const active =
      nav1.find(i => i.path === router.pathname) ??
      nav2.find(i => i.path === router.pathname);

    return active?.name ?? '';
  };
  // TODO - Get back to this
  // const getNextNavItemName = (nav1, nav2) => {
  //   const allNavItems = [...nav1, ...nav2];
  //   const currentIndex = allNavItems.findIndex(i => i.path === router.pathname);
  //   const nextItem = allNavItems[currentIndex + 1];
  //
  //   if (currentIndex === -1) return '';
  //   if (currentIndex === allNavItems.length - 1) {
  //     return allNavItems[0].name;
  //   }
  //   return nextItem ? nextItem.name : '';
  // };
  // const nextPathname = getNextNavItemName(navItems, subNavItems);

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
              Contents
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
                [styles.habitsLi]: item.name === 'Habits',
              })}
              onClick={() => {
                if (item.name === 'Habits') {
                  setOpenSubNav(!openSubNav);
                } else {
                  setOpenNav(!openNav);
                }
              }}
            >
              <span
                className={cn(styles.txtAndIcon, {
                  [styles.habitsTxtAndIcon]: item.name === 'Habits',
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
                    target={item.name === 'AI Assistant' ? '_blank' : '_self'}
                  >
                    {item.name}
                  </Link>
                )}
                {item.name === 'Habits' && (
                  <NavigationIcon
                    className={cn(styles.habitsArrow, {
                      [styles.openHabitsArrow]: openSubNav,
                    })}
                  />
                )}
              </span>
              {item.icon && <NewPageIcon />}

              <Divider className={styles.divider} />
              {item.name === 'Habits' && (
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
      {/*<button className={styles.nextPageBtn}> Next: {nextPathname}</button>*/}
    </>
  );
};

export default MobileNavigation;
