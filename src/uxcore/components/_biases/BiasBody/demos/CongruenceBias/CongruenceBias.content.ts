const content = {
  en: {
    hypothesis: 'Hypothesis',
    testing: 'Variants Tested',
    before: {
      h: 'A green CTA will convert better than the current grey one.',
      variants: [
        { label: 'A', desc: 'Current grey button' },
        { label: 'B', desc: 'Green button (predicted winner)' },
      ],
      verdict: 'B wins by 3% — hypothesis "confirmed", ship it.',
    },
    after: {
      h: 'A green CTA will convert better than the current grey one.',
      variants: [
        {
          label: 'A',
          desc: 'Current grey button',
          kind: 'baseline',
          kindLabel: 'baseline',
        },
        {
          label: 'B',
          desc: 'Green button',
          kind: 'confirm',
          kindLabel: 'confirms',
        },
        {
          label: 'C',
          desc: 'Red button — should lose if green is the answer',
          kind: 'disconfirm',
          kindLabel: 'disconfirms',
        },
        {
          label: 'D',
          desc: 'No CTA — does color even matter?',
          kind: 'disconfirm',
          kindLabel: 'disconfirms',
        },
      ],
      verdict: 'C wins. Color hypothesis was wrong — placement did the work.',
    },
  },
  ru: {
    hypothesis: 'Гипотеза',
    testing: 'Протестированные варианты',
    before: {
      h: 'Зелёный CTA будет конвертировать лучше нынешнего серого.',
      variants: [
        { label: 'A', desc: 'Текущая серая кнопка' },
        { label: 'B', desc: 'Зелёная кнопка (предполагаемый победитель)' },
      ],
      verdict: 'B выигрывает на 3% — гипотеза «подтверждена», запускаем.',
    },
    after: {
      h: 'Зелёный CTA будет конвертировать лучше нынешнего серого.',
      variants: [
        {
          label: 'A',
          desc: 'Текущая серая кнопка',
          kind: 'baseline',
          kindLabel: 'базовая',
        },
        {
          label: 'B',
          desc: 'Зелёная кнопка',
          kind: 'confirm',
          kindLabel: 'подтверждает',
        },
        {
          label: 'C',
          desc: 'Красная кнопка — должна проиграть, если дело в зелёном',
          kind: 'disconfirm',
          kindLabel: 'опровергает',
        },
        {
          label: 'D',
          desc: 'Без CTA — а цвет вообще важен?',
          kind: 'disconfirm',
          kindLabel: 'опровергает',
        },
      ],
      verdict:
        'C выиграл. Гипотеза о цвете не подтвердилась — дело было в расположении.',
    },
  },
  hy: {
    hypothesis: 'Վարկած',
    testing: 'Փորձարկված տարբերակներ',
    before: {
      h: 'Կանաչ CTA-ն ավելի լավ կկոնվերտացնի, քան ներկայիս մոխրագույնը։',
      variants: [
        { label: 'A', desc: 'Ներկայիս մոխրագույն կոճակ' },
        { label: 'B', desc: 'Կանաչ կոճակ (ենթադրյալ հաղթող)' },
      ],
      verdict: 'B-ն հաղթում է 3%-ով — վարկածը «հաստատված է», թողարկում ենք։',
    },
    after: {
      h: 'Կանաչ CTA-ն ավելի լավ կկոնվերտացնի, քան ներկայիս մոխրագույնը։',
      variants: [
        {
          label: 'A',
          desc: 'Ներկայիս մոխրագույն կոճակ',
          kind: 'baseline',
          kindLabel: 'բազային',
        },
        {
          label: 'B',
          desc: 'Կանաչ կոճակ',
          kind: 'confirm',
          kindLabel: 'հաստատում է',
        },
        {
          label: 'C',
          desc: 'Կարմիր կոճակ — պետք է պարտվի, եթե կանաչն է պատասխանը',
          kind: 'disconfirm',
          kindLabel: 'հերքում է',
        },
        {
          label: 'D',
          desc: 'Առանց CTA-ի — իսկ գույնն ընդհանրապես կարևոր է՞',
          kind: 'disconfirm',
          kindLabel: 'հերքում է',
        },
      ],
      verdict: 'C-ն հաղթեց։ Գույնի վարկածը սխալ էր — դերը խաղաց դիրքավորումը։',
    },
  },
};

export default content;
