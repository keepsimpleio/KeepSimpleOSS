import { FC, useState } from 'react';
import Image from 'next/image';

import MainInfoSection from '@components/longevity/MainInfoSection';
import LongevitySubSection from '@components/longevity/LongevitySubSection';
import WhatToEatOrAvoid from '@components/longevity/WhatToEatOrAvoid';
import DietResults from '@components/longevity/DietResults';
import YourDiet from '@components/longevity/YourDiet';

import { DietLayoutProps } from '@layouts/DietLayout/DietLayout.types';

import { images, longevityDietPath, scaleLevels } from '@constants/longevity';

import styles from './DietLayout.module.scss';

const DietLayout: FC<DietLayoutProps> = ({ locale, data }) => {
  const [selectedHealthyOptionId, setSelectedHealthyOptionId] = useState(1);
  const [isIconClicked, setIsIconClicked] = useState(false);
  const foodFacts = data['food science facts that most influenced my choices'];
  const items = data['what not to eat'];
  const getSelectedHealthOptionName = (id: number) => {
    const selectedOption = data?.['what to eat']?.find(
      (option: any) => option.id === id,
    );
    return selectedOption ? selectedOption['product name'] : null;
  };
  const whatToEatItemNamesAndIds = () => {
    return (
      data?.['what to eat']?.map((option: any) => ({
        id: option.id,
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
        // TODO add russian
        title={'Food-science facts that most influenced my choices'}
        description={foodFacts}
        headlineBackgroundImageUrl={`${longevityDietPath}/food-facts-headline.png`}
      />
      <LongevitySubSection
        title={'What not to eat'}
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
          />
        ))}
        <div className={styles.imageWrapper}>
          <Image
            src={`${longevityDietPath}/diet-results.png`}
            alt={'This diet results'}
            width={424}
            height={403}
          />
          {/*TODO change all of them to longevityDietPath*/}
          <Image
            src={
              '/keepsimple_/assets/longevity/diet/diet-smoke-and-drink-results.png'
            }
            alt={'This diet results'}
            width={424}
            height={403}
          />
        </div>
      </LongevitySubSection>
      <LongevitySubSection
        title={'What to eat'}
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
            id={item.id}
          />
        ))}
        <DietResults
          scaleLevels={scaleLevels}
          id={selectedHealthyOptionId}
          setSelectedHealthyOptionId={setSelectedHealthyOptionId}
          selectedHealthOption={selectedHealthOption}
          whatToEatItemNamesAndIds={whatToEatItemNamesAndIds()}
          setIsIconClicked={setIsIconClicked}
        />
        <YourDiet
          id={selectedHealthyOptionId}
          scaleLevels={scaleLevels}
          selectedHealthOptionName={selectedHealthOption.name}
          isIconClicked={isIconClicked}
        />
      </LongevitySubSection>
      <LongevitySubSection
        locale={locale}
        // TODO add russian
        title={'Generic rules'}
        description={data?.['generic rules']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/generic-rules-headline.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // TODO add russian
        title={'Hacks'}
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
