import React, { forwardRef, useEffect } from 'react';
import { useRouter } from 'next/router';

import type { ContributorsLayoutProps } from './ContributorsLayout.types';

import useMobile from '@hooks/useMobile';

import { TRouter } from '@local-types/global';

import contributors from '@data/contributors';

import Contributor from '@components/contributors/Contributor/Contributor';
import ContributorsLabel from '@components/contributors/ContributorsLabel';
import ContributorsSlider from '@components/contributors/ContributorsSlider';
import Heading from '@components/Heading';

import styles from './ContributorsLayout.module.scss';

// eslint-disable-next-line react/display-name
const ContributorsLayout = forwardRef<HTMLElement, ContributorsLayoutProps>(
  ({ contributorsData, isDarkTheme }, ref) => {
    const router = useRouter();
    const { locale } = router as TRouter;
    const { isMobile } = useMobile()[1];
    const [contributorsChangedOrder, setContributorsChangedOrder] =
      React.useState(contributorsData);
    const { activeHeroes, heroes, socialLinkTxt } = contributors[locale];

    useEffect(() => {
      const contributorChild = contributorsData.contributors?.data.find(
        contributor => contributor.attributes.japaneseLetter === '子供たち',
      );
      const filteredContributors = contributorsData.contributors?.data.filter(
        contributor => contributor.attributes.japaneseLetter !== '子供たち',
      );

      if (contributorChild) {
        filteredContributors.push(contributorChild);
      }

      setContributorsChangedOrder({
        ...contributorsData,
        contributors: { data: filteredContributors },
      });
    }, [contributorsData]);

    return (
      <section className={styles.section} ref={ref}>
        <Heading
          isDarkTheme={isDarkTheme}
          text={contributorsData.title}
          showLeftIcon
          showRightIcon
          textAlign={'center'}
          className={styles['title']}
          locale={locale}
        />
        <div
          dangerouslySetInnerHTML={{ __html: contributorsData.description }}
          className={styles.description}
        />
        {!isMobile && (
          <ContributorsSlider
            contributors={contributorsData.contributors}
            isDarkTheme={isDarkTheme}
            socialLinkTxt={socialLinkTxt}
          />
        )}
        <section>
          <ContributorsLabel isDarkTheme={isDarkTheme} text={activeHeroes} />
          <Heading
            text={heroes}
            Tag={'h2'}
            hasUnderline
            showLeftIcon={false}
            showRightIcon={false}
            isDarkTheme={isDarkTheme}
            locale={locale}
          />
          <div className={styles.list}>
            {contributorsChangedOrder.contributors?.data.map(
              (contributor, index) => {
                const { name, japaneseLetter, role, socialLink, isActive } =
                  contributor.attributes;
                return (
                  <Contributor
                    key={index}
                    name={name}
                    role={role}
                    japaneseLetter={japaneseLetter}
                    isActive={isActive}
                    socialLink={socialLink}
                    isDarkTheme={isDarkTheme}
                    isMobile={isMobile}
                    socialLinkTxt={socialLinkTxt}
                  />
                );
              },
            )}
          </div>
        </section>
      </section>
    );
  },
);

export default ContributorsLayout;
