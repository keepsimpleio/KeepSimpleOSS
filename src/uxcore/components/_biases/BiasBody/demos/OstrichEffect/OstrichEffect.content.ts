const content = {
  en: {
    header: 'Financial Dashboard',
    before: {
      metrics: [
        {
          label: 'Credit Utilization',
          value: '78%',
          sub: 'Recommended: below 30%',
        },
        {
          label: 'Monthly Budget',
          value: '+$340 over',
          sub: 'Budget: $2,000 / Spent: $2,340',
        },
      ],
      alertText: 'Budget overage alert — 3rd month in a row',
    },
    after: {
      metrics: [
        {
          label: 'Credit Status',
          value: 'On Track',
          link: 'View credit details ›',
        },
        {
          label: 'Spending',
          value: 'Optimization Opportunity',
          link: 'See breakdown ›',
        },
      ],
      softTitle: 'Monthly Insights Ready',
      softSub: 'A few areas where small tweaks could help.',
    },
  },
  ru: {
    header: 'Финансовая панель',
    before: {
      metrics: [
        {
          label: 'Использование кредита',
          value: '78%',
          sub: 'Рекомендуется: ниже 30%',
        },
        {
          label: 'Месячный бюджет',
          value: '+$340 сверх',
          sub: 'Бюджет: $2 000 / Потрачено: $2 340',
        },
      ],
      alertText: 'Перерасход бюджета — 3-й месяц подряд',
    },
    after: {
      metrics: [
        {
          label: 'Кредитный статус',
          value: 'В порядке',
          link: 'Посмотреть детали ›',
        },
        {
          label: 'Расходы',
          value: 'Есть, что улучшить',
          link: 'Посмотреть разбивку ›',
        },
      ],
      softTitle: 'Инсайты месяца готовы',
      softSub: 'Несколько мест, где мелкие изменения помогут.',
    },
  },
  hy: {
    header: 'Ֆինանսական վահանակ',
    before: {
      metrics: [
        {
          label: 'Վարկի օգտագործում',
          value: '78%',
          sub: 'Առաջարկվում է՝ 30%-ից ցածր',
        },
        {
          label: 'Ամսական բյուջե',
          value: '+$340 գերազանցում',
          sub: 'Բյուջե՝ $2,000 / Ծախս՝ $2,340',
        },
      ],
      alertText: 'Բյուջեի գերազանցման ահազանգ — անընդմեջ 3-րդ ամիսն է',
    },
    after: {
      metrics: [
        {
          label: 'Վարկի կարգավիճակ',
          value: 'Կարգին է',
          link: 'Դիտել վարկի մանրամասները ›',
        },
        {
          label: 'Ծախսեր',
          value: 'Օպտիմալացման հնարավորություն',
          link: 'Տեսնել մանրամասները ›',
        },
      ],
      softTitle: 'Ամսական ներթափանցումները պատրաստ են',
      softSub: 'Մի քանի ոլորտ, որտեղ փոքր ճշգրտումները կարող են օգնել։',
    },
  },
};

export default content;
