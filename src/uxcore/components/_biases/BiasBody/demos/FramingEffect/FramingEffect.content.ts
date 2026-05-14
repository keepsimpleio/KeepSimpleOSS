const content = {
  en: {
    title: 'System Update Available',
    body: 'This update will migrate your database to the new schema.',
    primaryBtn: 'Update Now',
    before: {
      iconWarning: '!',
      riskLabel: 'Risk:',
      riskValue: '1% chance of data loss during migration',
      sub: 'Back up your data before proceeding.',
      secondaryBtn: 'Back Up First',
      label: 'Negative frame — triggers anxiety',
    },
    after: {
      iconSuccess: '✓',
      successLabel: 'Safety:',
      successValue: '99% probability the operation succeeds',
      sub: 'Automatic backup runs before migration starts.',
      secondaryBtn: 'View Details',
      label: 'Positive frame — same odds, more confidence',
    },
  },
  ru: {
    title: 'Доступно обновление системы',
    body: 'Это обновление перенесёт вашу базу данных на новую схему.',
    primaryBtn: 'Обновить сейчас',
    before: {
      iconWarning: '!',
      riskLabel: 'Риск:',
      riskValue: '1% вероятность потери данных при миграции',
      sub: 'Сделайте резервную копию перед продолжением.',
      secondaryBtn: 'Сначала резервная копия',
      label: 'Негативная подача — вызывает тревогу',
    },
    after: {
      iconSuccess: '✓',
      successLabel: 'Безопасность:',
      successValue: '99% вероятность успешного выполнения',
      sub: 'Автоматическая резервная копия создаётся перед миграцией.',
      secondaryBtn: 'Подробнее',
      label: 'Позитивная подача — те же шансы, больше уверенности',
    },
  },
  hy: {
    title: 'Հասանելի է համակարգի թարմացում',
    body: 'Այս թարմացումը կտեղափոխի ձեր տվյալների բազան նոր սխեմայի։',
    primaryBtn: 'Թարմացնել հիմա',
    before: {
      iconWarning: '!',
      riskLabel: 'Ռիսկ՝',
      riskValue: 'Միգրացիայի ընթացքում տվյալների կորստի 1% հավանականություն',
      sub: 'Պահեստավորեք ձեր տվյալները շարունակելուց առաջ։',
      secondaryBtn: 'Նախ պահեստավորել',
      label: 'Բացասական ձևակերպում — առաջացնում է անհանգստություն',
    },
    after: {
      iconSuccess: '✓',
      successLabel: 'Անվտանգություն՝',
      successValue: 'Գործողությունը կկատարվի 99% հավանականությամբ',
      sub: 'Ավտոմատ պահեստավորում է կատարվում միգրացիայից առաջ։',
      secondaryBtn: 'Մանրամասներ',
      label:
        'Դրական ձևակերպում — նույն հավանականությունը, ավելի շատ վստահություն',
    },
  },
};

export default content;
