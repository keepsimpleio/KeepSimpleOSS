import Image from 'next/image';
import { FC, useState } from 'react';

import { images, longevityDietPath, scaleLevels } from '@constants/longevity';

import longevityData from '@data/longevity';

import DietResults from '@components/longevity/DietResults';
import LongevitySubSection from '@components/longevity/LongevitySubSection';
import MainInfoSection from '@components/longevity/MainInfoSection';
import WhatToEatOrAvoid from '@components/longevity/WhatToEatOrAvoid';
import YourDiet from '@components/longevity/YourDiet';

import { DietLayoutProps } from '@layouts/DietLayout/DietLayout.types';

import styles from './DietLayout.module.scss';

const DietLayout: FC<DietLayoutProps> = ({ locale, data }) => {
  const firstItemIndex = 1;
  const [selectedHealthyOptionId, setSelectedHealthyOptionId] =
    useState(firstItemIndex);
  const [isIconClicked, setIsIconClicked] = useState(false);
  const foodFacts =
    data?.['food science facts that most influenced my choices'];
  const items = data?.['what not to eat'];
  const {
    foodScienceFactsTitle,
    whatToEatTitle,
    whatNotToEatTitle,
    genericRulesTitle,
    healthChoicesTitle,
    hacksTitle,
    tooltipSubText,
    whatTOEatOrAvoidContent,
  } = longevityData[locale];

  const getSelectedHealthOptionName = (index: number) => {
    const selectedOption = data?.['what to eat']?.[index - 1];
    return selectedOption ? selectedOption['product name'] : null;
  };

  const whatToEatItemNamesAndIds = () => {
    return (
      data?.['what to eat']?.map((option: any, index: number) => ({
        id: index + 1,
        name: option['product name'],
      })) || []
    );
  };

  const selectedHealthOption = {
    id: selectedHealthyOptionId,
    name: getSelectedHealthOptionName(selectedHealthyOptionId),
  };
  const whatNotToEat = items?.map((item, index) => ({
    ...item,
    imageUrl: images[index] ?? null,
  }));

  return (
    <div>
      <MainInfoSection
        title={data?.title}
        description={data?.description}
        basicStats={data?.basicStats}
        locale={locale}
        japaneseText={data['japanese title']}
        backgroundImageUrl={`${process.env.NEXT_PUBLIC_STRAPI}${data['background image']?.data?.attributes.url}`}
      />
      <LongevitySubSection
        locale={locale}
        title={foodScienceFactsTitle}
        description={foodFacts}
        headlineBackgroundImageUrl={`${longevityDietPath}/food-facts-headline.png`}
      />
      <LongevitySubSection
        title={whatNotToEatTitle}
        locale={locale}
        headlineBackgroundImageUrl={`${longevityDietPath}/what-not-to-eat.png`}
      >
        {whatNotToEat?.map((item, index) => (
          <WhatToEatOrAvoid
            key={index}
            className={'mb-8'}
            damageIndex={item['damage index']}
            info={item.info}
            examples={item.examples}
            title={item['product name']}
            imageUrl={item?.imageUrl}
            tooltipContent={item['tooltip content']}
            tooltipSubText={tooltipSubText}
            locale={locale}
          />
        ))}
        <div className={styles.imageWrapper}>
          <Image
            src={
              locale === 'ru'
                ? `${longevityDietPath}/diet-results-ru.png`
                : `${longevityDietPath}/diet-results.png`
            }
            alt={'This diet results'}
            width={424}
            height={353}
            unoptimized
          />
          {/*TODO change all of them to longevityDietPath*/}
          <Image
            src={
              locale === 'ru'
                ? '/keepsimple_/assets/longevity/diet/diet-smoke-and-drink-results-ru.png'
                : '/keepsimple_/assets/longevity/diet/diet-smoke-and-drink-results.png'
            }
            alt={'This diet results'}
            width={424}
            height={353}
            unoptimized
          />
        </div>
      </LongevitySubSection>
      <LongevitySubSection
        title={whatToEatTitle}
        locale={locale}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/what-not-to-eat.png'
        }
      >
        {data?.['what to eat']?.map((item, index) => (
          <WhatToEatOrAvoid
            key={index}
            className={'mb-8'}
            damageIndex={item['damage index']}
            info={item.info}
            examples={item.examples}
            title={item['product name']}
            setSelectedHealthyOptionId={setSelectedHealthyOptionId}
            selectedHealthyOptionId={selectedHealthyOptionId}
            id={index + 1}
            locale={locale}
          />
        ))}
        <DietResults
          scaleLevels={scaleLevels}
          id={selectedHealthyOptionId}
          setSelectedHealthyOptionId={setSelectedHealthyOptionId}
          selectedHealthOption={selectedHealthOption}
          whatToEatItemNamesAndIds={whatToEatItemNamesAndIds()}
          setIsIconClicked={setIsIconClicked}
          dietTxt={whatTOEatOrAvoidContent.yourDietTxt}
          locale={locale}
        />
        <YourDiet
          id={selectedHealthyOptionId}
          scaleLevels={scaleLevels}
          selectedHealthOptionName={selectedHealthOption.name}
          isIconClicked={isIconClicked}
          locale={locale}
        />
      </LongevitySubSection>
      <LongevitySubSection
        locale={locale}
        title={genericRulesTitle}
        description={data?.['generic rules']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/generic-rules-headline.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        title={healthChoicesTitle}
        description={data?.['food choices for Armenia']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/generic-rules-headline.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        title={hacksTitle}
        description={data?.hacks}
        isHacks={true}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/hacks-headline.png'
        }
      />
    </div>
  );
};

export default DietLayout;
