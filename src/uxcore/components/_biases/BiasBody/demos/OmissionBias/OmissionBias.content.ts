const content = {
  en: {
    before: {
      title: 'Manage Subscription',
      planName: 'Pro Plan',
      planPrice: '$29/mo · renews Apr 1',
      changeBtn: 'Change Plan',
      cancelBtn: 'Cancel Subscription',
    },
    after: {
      title: 'Account',
      breadcrumb: 'Account › Billing › Manage Plan › Cancel',
      menu: [
        { label: 'Profile Settings', active: false },
        { label: 'Billing & Payments', active: true },
        { label: 'Security', active: false },
        { label: 'Notifications', active: false },
      ],
      subMenu1Title: 'Billing & Payments',
      subMenu1: [
        { label: 'Payment Methods', active: false },
        { label: 'Invoices', active: false },
        { label: 'Manage Plan', active: true },
      ],
      subMenu2Title: 'Manage Plan',
      subMenu2: [
        { label: 'Change Plan', danger: false },
        { label: 'Pause Subscription', danger: false },
        { label: 'Cancel Subscription', danger: true },
      ],
    },
  },
  ru: {
    before: {
      title: 'Управление подпиской',
      planName: 'Тариф Pro',
      planPrice: '$29/мес · продление 1 апр',
      changeBtn: 'Сменить тариф',
      cancelBtn: 'Отменить подписку',
    },
    after: {
      title: 'Аккаунт',
      breadcrumb: 'Аккаунт › Биллинг › Управление тарифом › Отмена',
      menu: [
        { label: 'Настройки профиля', active: false },
        { label: 'Биллинг и платежи', active: true },
        { label: 'Безопасность', active: false },
        { label: 'Уведомления', active: false },
      ],
      subMenu1Title: 'Биллинг и платежи',
      subMenu1: [
        { label: 'Способы оплаты', active: false },
        { label: 'Счета', active: false },
        { label: 'Управление тарифом', active: true },
      ],
      subMenu2Title: 'Управление тарифом',
      subMenu2: [
        { label: 'Сменить тариф', danger: false },
        { label: 'Приостановить подписку', danger: false },
        { label: 'Отменить подписку', danger: true },
      ],
    },
  },
  hy: {
    before: {
      title: 'Կառավարել բաժանորդագրությունը',
      planName: 'Pro փաթեթ',
      planPrice: '$29/ամս · երկարաձգվում է ապր. 1-ին',
      changeBtn: 'Փոխել փաթեթը',
      cancelBtn: 'Չեղարկել բաժանորդագրությունը',
    },
    after: {
      title: 'Հաշիվ',
      breadcrumb: 'Հաշիվ › Վճարումներ › Փաթեթի կառավարում › Չեղարկում',
      menu: [
        { label: 'Պրոֆիլի կարգավորումներ', active: false },
        { label: 'Վճարումներ', active: true },
        { label: 'Անվտանգություն', active: false },
        { label: 'Ծանուցումներ', active: false },
      ],
      subMenu1Title: 'Վճարումներ',
      subMenu1: [
        { label: 'Վճարման եղանակներ', active: false },
        { label: 'Հաշիվներ', active: false },
        { label: 'Փաթեթի կառավարում', active: true },
      ],
      subMenu2Title: 'Փաթեթի կառավարում',
      subMenu2: [
        { label: 'Փոխել փաթեթը', danger: false },
        { label: 'Դադարեցնել բաժանորդագրությունը', danger: false },
        { label: 'Չեղարկել բաժանորդագրությունը', danger: true },
      ],
    },
  },
};

export default content;
