const content = {
  en: {
    title: 'File Your Tax Return',
    before: {
      fields: [
        { label: 'First Name', placeholder: 'John', type: 'text' },
        { label: 'Last Name', placeholder: 'Smith', type: 'text' },
        { label: 'SSN / TIN', placeholder: 'XXX-XX-XXXX', type: 'text' },
        { label: 'Filing Status', placeholder: 'Single', type: 'select' },
        {
          label: 'Employer EIN',
          placeholder: 'XX-XXXXXXX',
          type: 'text',
          full: true,
        },
        { label: 'W-2 Wages (Box 1)', placeholder: '$0.00', type: 'text' },
        { label: 'Federal Tax Withheld', placeholder: '$0.00', type: 'text' },
        { label: 'State Tax Withheld', placeholder: '$0.00', type: 'text' },
        { label: 'State Wages', placeholder: '$0.00', type: 'text' },
        { label: 'Other Income', placeholder: '$0.00', type: 'text' },
        { label: 'Interest Income', placeholder: '$0.00', type: 'text' },
        { label: 'Deduction Type', placeholder: 'Standard', type: 'select' },
        { label: 'Dependents', placeholder: '0', type: 'number' },
        { label: 'Credits Claimed', placeholder: '$0.00', type: 'text' },
        { label: 'Estimated Tax Paid', placeholder: '$0.00', type: 'text' },
      ],
      cta: 'Submit Return',
    },
    after: {
      steps: [
        { label: '1 Personal', done: true, active: false },
        { label: '2 Income', done: false, active: true },
        { label: '3 Deductions', done: false, active: false },
        { label: '4 Review', done: false, active: false },
      ],
      stepLabel: 'Step 2 of 4 — Income Sources',
      stepHint: 'Enter your income from all employers this year.',
      fields: [
        {
          label: 'W-2 Wages (Box 1)',
          placeholder: '$0.00',
          tip: 'Found on your W-2 form',
        },
        {
          label: 'Federal Tax Withheld',
          placeholder: '$0.00',
          tip: 'Found in Box 2 of W-2',
        },
        {
          label: 'Other Income',
          placeholder: '$0.00',
          tip: 'Freelance, rental, etc.',
        },
      ],
      back: 'Back',
      cta: 'Continue',
    },
  },
  ru: {
    title: 'Подать налоговую декларацию',
    before: {
      fields: [
        { label: 'Имя', placeholder: 'Иван', type: 'text' },
        { label: 'Фамилия', placeholder: 'Петров', type: 'text' },
        { label: 'SSN / ИНН', placeholder: 'XXX-XX-XXXX', type: 'text' },
        { label: 'Статус подачи', placeholder: 'Один', type: 'select' },
        {
          label: 'EIN работодателя',
          placeholder: 'XX-XXXXXXX',
          type: 'text',
          full: true,
        },
        { label: 'Зарплата W-2 (стр. 1)', placeholder: '$0.00', type: 'text' },
        {
          label: 'Удержанный федеральный налог',
          placeholder: '$0.00',
          type: 'text',
        },
        { label: 'Удержанный налог штата', placeholder: '$0.00', type: 'text' },
        { label: 'Зарплата по штату', placeholder: '$0.00', type: 'text' },
        { label: 'Прочий доход', placeholder: '$0.00', type: 'text' },
        { label: 'Процентный доход', placeholder: '$0.00', type: 'text' },
        { label: 'Тип вычета', placeholder: 'Стандартный', type: 'select' },
        { label: 'Иждивенцы', placeholder: '0', type: 'number' },
        { label: 'Налоговые кредиты', placeholder: '$0.00', type: 'text' },
        {
          label: 'Уплачен авансовый налог',
          placeholder: '$0.00',
          type: 'text',
        },
      ],
      cta: 'Подать декларацию',
    },
    after: {
      steps: [
        { label: '1 Личные данные', done: true, active: false },
        { label: '2 Доход', done: false, active: true },
        { label: '3 Вычеты', done: false, active: false },
        { label: '4 Проверка', done: false, active: false },
      ],
      stepLabel: 'Шаг 2 из 4 — Источники дохода',
      stepHint: 'Введите доход от всех работодателей за этот год.',
      fields: [
        {
          label: 'Зарплата W-2 (стр. 1)',
          placeholder: '$0.00',
          tip: 'В форме W-2',
        },
        {
          label: 'Удержанный федеральный налог',
          placeholder: '$0.00',
          tip: 'В строке 2 формы W-2',
        },
        {
          label: 'Прочий доход',
          placeholder: '$0.00',
          tip: 'Фриланс, аренда и т.д.',
        },
      ],
      back: 'Назад',
      cta: 'Продолжить',
    },
  },
  hy: {
    title: 'Ներկայացրեք ձեր հարկային հայտարարագիրը',
    before: {
      fields: [
        { label: 'Անուն', placeholder: 'Արամ', type: 'text' },
        { label: 'Ազգանուն', placeholder: 'Պետրոսյան', type: 'text' },
        { label: 'SSN / ՀՎՀՀ', placeholder: 'XXX-XX-XXXX', type: 'text' },
        {
          label: 'Հայտարարագրի կարգավիճակ',
          placeholder: 'Միայնակ',
          type: 'select',
        },
        {
          label: 'Գործատուի EIN',
          placeholder: 'XX-XXXXXXX',
          type: 'text',
          full: true,
        },
        { label: 'W-2 աշխատավարձ (Box 1)', placeholder: '$0.00', type: 'text' },
        { label: 'Պահված դաշնային հարկ', placeholder: '$0.00', type: 'text' },
        { label: 'Պահված նահանգային հարկ', placeholder: '$0.00', type: 'text' },
        { label: 'Նահանգային աշխատավարձ', placeholder: '$0.00', type: 'text' },
        { label: 'Այլ եկամուտ', placeholder: '$0.00', type: 'text' },
        { label: 'Տոկոսային եկամուտ', placeholder: '$0.00', type: 'text' },
        { label: 'Նվազեցման տեսակ', placeholder: 'Ստանդարտ', type: 'select' },
        { label: 'Խնամյալներ', placeholder: '0', type: 'number' },
        { label: 'Պահանջված վարկեր', placeholder: '$0.00', type: 'text' },
        {
          label: 'Վճարված կանխավճարային հարկ',
          placeholder: '$0.00',
          type: 'text',
        },
      ],
      cta: 'Ներկայացնել հայտարարագիրը',
    },
    after: {
      steps: [
        { label: '1 Անձնական', done: true, active: false },
        { label: '2 Եկամուտ', done: false, active: true },
        { label: '3 Նվազեցումներ', done: false, active: false },
        { label: '4 Ստուգում', done: false, active: false },
      ],
      stepLabel: 'Քայլ 2 / 4 — Եկամտի աղբյուրներ',
      stepHint: 'Մուտքագրեք ձեր եկամուտը բոլոր գործատուներից այս տարվա համար։',
      fields: [
        {
          label: 'W-2 աշխատավարձ (Box 1)',
          placeholder: '$0.00',
          tip: 'Գտնվում է ձեր W-2 ձևում',
        },
        {
          label: 'Պահված դաշնային հարկ',
          placeholder: '$0.00',
          tip: 'Գտնվում է W-2-ի Box 2-ում',
        },
        {
          label: 'Այլ եկամուտ',
          placeholder: '$0.00',
          tip: 'Ֆրիլանս, վարձույթ և այլն',
        },
      ],
      back: 'Հետ',
      cta: 'Շարունակել',
    },
  },
};

export default content;
