const content = {
  en: {
    before: {
      icon: '💾',
      title: 'Backup Reminder',
      bodyStart:
        'The probability of permanent data loss for any given device is approximately',
      bodyStat: '0.01%',
      bodyEnd: 'per year.',
      bodySecond:
        'We recommend backing up your data regularly to minimize this risk.',
      cta: 'Enable Auto-Backup',
    },
    after: {
      alertIcon: '⚠️',
      alertTitle: 'Your data is at risk',
      daysNum: '571',
      daysLabel: 'days since your last backup',
      compRows: [
        { label: 'Most users back up every', value: '30 days', red: false },
        { label: 'You last backed up', value: '571 days ago', red: true },
      ],
      cta: 'Back Up Now',
    },
  },
  ru: {
    before: {
      icon: '💾',
      title: 'Напоминание о резервной копии',
      bodyStart:
        'Вероятность безвозвратной потери данных для любого устройства составляет примерно',
      bodyStat: '0,01%',
      bodyEnd: 'в год.',
      bodySecond:
        'Рекомендуем регулярно делать резервные копии, чтобы снизить этот риск.',
      cta: 'Включить автобэкап',
    },
    after: {
      alertIcon: '⚠️',
      alertTitle: 'Ваши данные под угрозой',
      daysNum: '571',
      daysLabel: 'дней с последнего бэкапа',
      compRows: [
        {
          label: 'Большинство делают бэкап каждые',
          value: '30 дней',
          red: false,
        },
        {
          label: 'Ваш последний бэкап был',
          value: '571 день назад',
          red: true,
        },
      ],
      cta: 'Сделать бэкап',
    },
  },
  hy: {
    before: {
      icon: '💾',
      title: 'Պահեստավորման հիշեցում',
      bodyStart:
        'Ցանկացած սարքի համար տվյալների մշտական կորստի հավանականությունը կազմում է մոտավորապես',
      bodyStat: '0.01%',
      bodyEnd: 'տարեկան։',
      bodySecond:
        'Խորհուրդ ենք տալիս կանոնավոր պահեստավորել ձեր տվյալները՝ այս ռիսկը նվազագույնի հասցնելու համար։',
      cta: 'Միացնել ավտոպահեստավորումը',
    },
    after: {
      alertIcon: '⚠️',
      alertTitle: 'Ձեր տվյալները ռիսկի տակ են',
      daysNum: '571',
      daysLabel: 'օր է ձեր վերջին պահեստավորումից',
      compRows: [
        {
          label: 'Շատ օգտատերեր պահեստավորում են ամեն',
          value: '30 օր',
          red: false,
        },
        {
          label: 'Ձեր վերջին պահեստավորումը',
          value: '571 օր առաջ էր',
          red: true,
        },
      ],
      cta: 'Պահեստավորել հիմա',
    },
  },
};

export default content;
