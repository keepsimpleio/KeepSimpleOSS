import { DietLayoutProps } from '@layouts/DietLayout/DietLayout.types';
import { FC, useState } from 'react';
import MainInfoSection from '@components/longevity/MainInfoSection';
import LongevitySubSection from '@components/longevity/LongevitySubSection';
import WhatToEatOrAvoid from '@components/longevity/WhatToEatOrAvoid';
import DietResults from '@components/longevity/DietResults';

const DietLayout: FC<DietLayoutProps> = ({ locale, data }) => {
  const [selectedHealthyOptionId, setSelectedHealthyOptionId] = useState(3);
  const foodFacts = data['food science facts that most influenced my choices'];
  const imgPath = '/keepsimple_/assets/longevity/diet/hearts/';
  const items = data['what not to eat'];
  const images = [
    `${imgPath}sugar.svg`,
    `${imgPath}seed-oil.svg`,
    `${imgPath}sugary-drinks.svg`,
    `${imgPath}ultra-porcessed-food.svg`,
    `${imgPath}white-flour.svg`,
    `${imgPath}deceptive-food.svg`,
  ];

  const whatNotToEat = items.map((item, index) => ({
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
        // todo add russian
        title={'Food-science facts that most influenced my choices'}
        description={foodFacts}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/food-facts-headline.png'
        }
      />
      <LongevitySubSection
        title={'What not to eat'}
        locale={locale}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/what-not-to-eat.png'
        }
      >
        {whatNotToEat.map((item, index) => (
          <WhatToEatOrAvoid
            key={index}
            className={'mb-8'}
            damageIndex={item['damage index']}
            info={item.info}
            examples={item.examples}
            title={item['product name']}
            imageUrl={item.imageUrl}
            tooltipContent={item['tooltip content']}
          />
        ))}
      </LongevitySubSection>
      <LongevitySubSection
        title={'What to eat'}
        locale={locale}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/what-not-to-eat.png'
        }
      >
        {data['what to eat'].map((item, index) => (
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
      </LongevitySubSection>
      <DietResults id={selectedHealthyOptionId} />

      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Generic rules'}
        description={data['generic rules']}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/generic-rules-headline.png'
        }
      />
      <LongevitySubSection
        locale={locale}
        // todo add russian
        title={'Hacks'}
        description={data.hacks}
        isHacks={true}
        headlineBackgroundImageUrl={
          '/keepsimple_/assets/longevity/diet/hacks-headline.png'
        }
      />
    </div>
  );
};

export default DietLayout;
