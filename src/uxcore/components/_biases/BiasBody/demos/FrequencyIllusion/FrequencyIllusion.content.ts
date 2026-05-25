const content = {
  en: {
    heading: 'Your brand across surfaces',
    surfaces: ['Homepage', 'Help Center', 'In-App Banner', 'Email Footer'],
    before: {
      messages: {
        Homepage: 'Simple invoicing for everyone',
        'Help Center': 'Manage your business better',
        'In-App Banner': 'Dashboard',
        'Email Footer': 'Your freelance finance tool',
      } as Record<string, string>,
      note: 'Different messages — no recognition builds up',
    },
    after: {
      message: 'Fastest payouts for freelancers',
      note: 'Consistent tagline — repetition feels like universal truth',
    },
  },
  ru: {
    heading: 'Ваш бренд на разных поверхностях',
    surfaces: [
      'Главная',
      'Справочный центр',
      'Баннер в приложении',
      'Футер письма',
    ],
    before: {
      messages: {
        Главная: 'Простое выставление счетов для всех',
        'Справочный центр': 'Управляйте бизнесом лучше',
        'Баннер в приложении': 'Дашборд',
        'Футер письма': 'Ваш инструмент финансов для фриланса',
      } as Record<string, string>,
      note: 'Разные сообщения — узнавание не накапливается',
    },
    after: {
      message: 'Самые быстрые выплаты для фрилансеров',
      note: 'Один слоган — повторение ощущается как общепризнанная истина',
    },
  },
  hy: {
    heading: 'Ձեր ապրանքանիշը տարբեր մակերևույթներում',
    surfaces: [
      'Գլխավոր էջ',
      'Օգնության կենտրոն',
      'Հավելվածի բաններ',
      'Էլ. փոստի ստորագիր',
    ],
    before: {
      messages: {
        'Գլխավոր էջ': 'Պարզ հաշիվների դուրս գրում բոլորի համար',
        'Օգնության կենտրոն': 'Կառավարեք ձեր բիզնեսն ավելի լավ',
        'Հավելվածի բաններ': 'Վահանակ',
        'Էլ. փոստի ստորագիր': 'Ձեր ֆրիլանս ֆինանսական գործիքը',
      } as Record<string, string>,
      note: 'Տարբեր հաղորդագրություններ — ճանաչելիությունը չի կուտակվում',
    },
    after: {
      message: 'Ամենաարագ վճարումները ֆրիլանսերների համար',
      note: 'Հետևողական կարգախոս — կրկնությունն ընկալվում է որպես ընդհանուր ճշմարտություն',
    },
  },
};

export default content;
