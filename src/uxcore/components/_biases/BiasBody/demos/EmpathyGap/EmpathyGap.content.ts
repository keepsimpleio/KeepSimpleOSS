const content = {
  en: {
    header: 'Support Bot',
    userMessage:
      "This is ridiculous! My payment failed AGAIN and now I can't access my account. I have a deadline in 20 minutes!",
    before: {
      botMessage:
        'Please calm down and describe the issue clearly so we can assist you. Make sure to include your account ID and the error code shown.',
      accountIdPlaceholder: 'Account ID',
      errorCodePlaceholder: 'Error code',
    },
    after: {
      botMessage:
        "We understand how stressful this is, especially with a deadline coming up. Let's fix this together right now.",
      actionLabel: "What's happening?",
      actions: ['Payment declined', "Can't log in", 'Something else'],
    },
  },
  ru: {
    header: 'Бот поддержки',
    userMessage:
      'Это возмутительно! Оплата СНОВА не прошла, и я не могу зайти в аккаунт. У меня дедлайн через 20 минут!',
    before: {
      botMessage:
        'Пожалуйста, успокойтесь и чётко опишите проблему, чтобы мы могли помочь. Обязательно укажите ID аккаунта и код ошибки.',
      accountIdPlaceholder: 'ID аккаунта',
      errorCodePlaceholder: 'Код ошибки',
    },
    after: {
      botMessage:
        'Понимаем, как это стрессово, особенно когда близится дедлайн. Давайте разберёмся вместе прямо сейчас.',
      actionLabel: 'Что происходит?',
      actions: ['Оплата отклонена', 'Не могу войти', 'Что-то ещё'],
    },
  },
  hy: {
    header: 'Աջակցության բոտ',
    userMessage:
      'Սա անհեթեթ է։ Վճարումս ԿՐԿԻՆ ձախողվեց, և ես չեմ կարող մտնել հաշիվ։ 20 րոպեից վերջնաժամկետ ունեմ։',
    before: {
      botMessage:
        'Խնդրում ենք հանգստանալ և հստակ նկարագրել խնդիրը, որպեսզի մենք կարողանանք օգնել։ Համոզվեք, որ նշել եք հաշվի ID-ն և ցուցադրված սխալի կոդը։',
      accountIdPlaceholder: 'Հաշվի ID',
      errorCodePlaceholder: 'Սխալի կոդ',
    },
    after: {
      botMessage:
        'Մենք հասկանում ենք, թե որքան սթրեսային է դա, հատկապես երբ վերջնաժամկետ է մոտենում։ Եկեք միասին լուծենք հենց հիմա։',
      actionLabel: 'Ի՞նչ է տեղի ունենում։',
      actions: ['Վճարումը մերժվել է', 'Չեմ կարողանում մուտք գործել', 'Այլ բան'],
    },
  },
};

export default content;
