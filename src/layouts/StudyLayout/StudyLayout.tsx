import { FC } from 'react';

import MainInfoSection from '@components/longevity/MainInfoSection';
import StudySection from '@components/longevity/StudySection/StudySection';

import { StudyLayoutProps } from '@layouts/StudyLayout/StudyLayout.types';

const StudyLayout: FC<StudyLayoutProps> = ({ data, locale }) => {
  return (
    <div>
      <MainInfoSection
        title={data?.title}
        description={data?.description}
        basicStats={data?.basicStats}
        locale={locale}
        japaneseText={data?.['japanese title']}
        backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data['background image']?.data?.attributes?.url}`}
      />
      <StudySection
        title={data.books?.title}
        description={data.books?.description}
        flippedCardChartTitle={data.books?.['flipped card chart title']}
        flippedCardSubText={data.books?.['flipped card subtext']}
        flippedCardHeadline={data.books?.['flipped card headline']}
        flippedCardPainText={data.books?.['flipped card pain caption']}
        flippedCardChart={
          locale === 'ru'
            ? '/keepsimple_/assets/longevity/study/charts/what-to-read-ru.png'
            : `${process.env.NEXT_PUBLIC_STRAPI}${data?.['books flipped card image']?.data?.attributes?.url}`
        }
        chartWidth={387}
        locale={locale}
      />
      <StudySection
        title={data['book notes']?.title}
        description={data['book notes']?.description}
        flippedCardChartTitle={data['book notes']?.['flipped card chart title']}
        flippedCardSubText={data['book notes']?.['flipped card subtext']}
        flippedCardHeadline={data['book notes']?.['flipped card headline']}
        flippedCardPainText={data['book notes']?.['flipped card pain caption']}
        flippedCardChart={
          locale === 'ru'
            ? '/keepsimple_/assets/longevity/study/charts/book-notes-ru.png'
            : `${process.env.NEXT_PUBLIC_STRAPI}${data?.['books notes flipped card image']?.data?.attributes?.url}`
        }
        chartWidth={387}
        flippedCardChartMobile={
          locale === 'ru'
            ? '/keepsimple_/assets/longevity/study/charts/book-notes-ru-mobile.png'
            : '/keepsimple_/assets/longevity/study/mobile-charts/book-notes-chart.webp'
        }
        locale={locale}
      />
      <StudySection
        title={data['daily work']?.title}
        description={data['daily work']?.description}
        flippedCardChartTitle={data['daily work']?.['flipped card chart title']}
        flippedCardSubText={data['daily work']?.['flipped card subtext']}
        flippedCardHeadline={data['daily work']?.['flipped card headline']}
        flippedCardPainText={data['daily work']?.['flipped card pain caption']}
        flippedCardChart={
          locale === 'ru'
            ? '/keepsimple_/assets/longevity/study/charts/daily-work-ru.png'
            : `${process.env.NEXT_PUBLIC_STRAPI}${data?.['daily work flipped card image']?.data?.attributes?.url}`
        }
        flippedCardChartMobile={
          locale === 'ru'
            ? '/keepsimple_/assets/longevity/study/charts/daily-work-ru-mobile.png'
            : '/keepsimple_/assets/longevity/study/mobile-charts/daily-work.webp'
        }
        chartWidth={810}
        locale={locale}
      />
      <StudySection
        title={data?.['explain to learn title']}
        description={data?.['explain to learn description']}
        locale={locale}
      />
      <StudySection
        title={data['research tasks']?.title}
        description={data['research tasks']?.description}
        flippedCardChartTitle={
          data['research tasks']?.['flipped card chart title']
        }
        flippedCardSubText={data['research tasks']?.['flipped card subtext']}
        flippedCardHeadline={data['research tasks']?.['flipped card headline']}
        flippedCardPainText={
          data['research tasks']?.['flipped card pain caption']
        }
        flippedCardChart={
          locale === 'ru'
            ? '/keepsimple_/assets/longevity/study/charts/research-tasks-ru.png'
            : `${process.env.NEXT_PUBLIC_STRAPI}${data?.['research tasks flipped card image']?.data?.attributes?.url}`
        }
        chartWidth={590}
        flippedCardChartMobile={
          locale === 'ru'
            ? '/keepsimple_/assets/longevity/study/charts/research-tasks-ru-mobile.png'
            : '/keepsimple_/assets/longevity/study/mobile-charts/research-task-mobile.webp'
        }
        locale={locale}
      />
      <StudySection
        title={data.data?.title}
        description={data.data?.description}
        flippedCardChartTitle={data.data?.['flipped card chart title']}
        flippedCardSubText={data.data?.['flipped card subtext']}
        flippedCardHeadline={data.data?.['flipped card headline']}
        flippedCardPainText={data.data?.['flipped card pain caption']}
        flippedCardChart={
          locale === 'ru'
            ? '/keepsimple_/assets/longevity/study/charts/data-ru.png'
            : `${process.env.NEXT_PUBLIC_STRAPI}${data?.['data flipped card image']?.data?.attributes?.url}`
        }
        chartWidth={390}
        flippedCardChartMobile={
          locale === 'ru'
            ? '/keepsimple_/assets/longevity/study/charts/data-ru-mobile.png'
            : '/keepsimple_/assets/longevity/study/mobile-charts/data-mobile.webp'
        }
        locale={locale}
      />
      <StudySection
        title={data.hacks?.title}
        description={data.hacks?.content}
        isHacks
        hacksQuote={data.hacks?.['hacks card quote']}
        quoteAuthor={data.hacks?.['hacks card quote author']}
        flippedCardChart={`${process.env.NEXT_PUBLIC_STRAPI}${data?.['hacks flipped card image']?.data?.attributes?.url}`}
        backsBackgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data?.['hacks flipped card image']?.data?.attributes?.url}`}
        chartWidth={390}
        locale={locale}
      />
    </div>
  );
};
export default StudyLayout;
