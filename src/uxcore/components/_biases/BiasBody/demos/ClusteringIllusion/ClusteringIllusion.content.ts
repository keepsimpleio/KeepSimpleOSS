const content = {
  en: {
    appIcon: '🧘',
    appName: 'MindfulMe',
    before: {
      schedule: 'Daily at 9:00 AM',
      notifications: [
        { time: '9:00 AM', day: 'Mon', msg: 'Time for your daily check-in!' },
        { time: '9:00 AM', day: 'Tue', msg: 'Time for your daily check-in!' },
        { time: '9:00 AM', day: 'Wed', msg: 'Time for your daily check-in!' },
        { time: '9:00 AM', day: 'Thu', msg: 'Time for your daily check-in!' },
        { time: '9:00 AM', day: 'Fri', msg: 'Time for your daily check-in!' },
      ],
      note: 'Fixed schedule — easy to tune out',
    },
    after: {
      schedule: 'Sent when the moment feels right',
      notifications: [
        {
          gap: 'Now',
          msg: 'This is a good moment to pause for a few mindful breaths.',
        },
        {
          gap: '+41 hrs',
          msg: 'Quick check-in: how are you feeling right now?',
        },
        {
          gap: '+53 hrs',
          msg: "A quiet moment found you. How's your energy today?",
        },
        {
          gap: '+38 hrs',
          msg: 'Something brought you here. Take 60 seconds for yourself.',
        },
        {
          gap: '+49 hrs',
          msg: 'Your mind has been working hard. Ready for a reset?',
        },
      ],
      note: 'Random intervals — feels personally timed',
    },
  },
  ru: {
    appIcon: '🧘',
    appName: 'MindfulMe',
    before: {
      schedule: 'Ежедневно в 9:00',
      notifications: [
        { time: '9:00', day: 'Пн', msg: 'Время для ежедневного чек-ина!' },
        { time: '9:00', day: 'Вт', msg: 'Время для ежедневного чек-ина!' },
        { time: '9:00', day: 'Ср', msg: 'Время для ежедневного чек-ина!' },
        { time: '9:00', day: 'Чт', msg: 'Время для ежедневного чек-ина!' },
        { time: '9:00', day: 'Пт', msg: 'Время для ежедневного чек-ина!' },
      ],
      note: 'Фиксированное расписание — легко игнорировать',
    },
    after: {
      schedule: 'Присылаем, когда момент подходящий',
      notifications: [
        {
          gap: 'Сейчас',
          msg: 'Хороший момент, чтобы замедлиться и сделать несколько осознанных вдохов.',
        },
        {
          gap: '+41 ч',
          msg: 'Короткий чек-ин: как вы себя чувствуете прямо сейчас?',
        },
        { gap: '+53 ч', msg: 'Настал тихий момент. Как ваша энергия сегодня?' },
        {
          gap: '+38 ч',
          msg: 'Что-то привело вас сюда. Уделите себе 60 секунд.',
        },
        {
          gap: '+49 ч',
          msg: 'Ваш ум поработал на славу. Готовы перезагрузиться?',
        },
      ],
      note: 'Случайные интервалы — ощущается как подобрано лично для вас',
    },
  },
  hy: {
    appIcon: '🧘',
    appName: 'MindfulMe',
    before: {
      schedule: 'Ամեն օր ժամը 9:00-ին',
      notifications: [
        { time: '9:00', day: 'Երկ', msg: 'Ժամանակն է ձեր ամենօրյա չեք-ինի:' },
        { time: '9:00', day: 'Երք', msg: 'Ժամանակն է ձեր ամենօրյա չեք-ինի:' },
        { time: '9:00', day: 'Չրք', msg: 'Ժամանակն է ձեր ամենօրյա չեք-ինի:' },
        { time: '9:00', day: 'Հնգ', msg: 'Ժամանակն է ձեր ամենօրյա չեք-ինի:' },
        { time: '9:00', day: 'Ուրբ', msg: 'Ժամանակն է ձեր ամենօրյա չեք-ինի:' },
      ],
      note: 'Ֆիքսված ժամանակացույց — հեշտ է անտեսել',
    },
    after: {
      schedule: 'Ուղարկվում է, երբ պահն արդեն հասուն է',
      notifications: [
        {
          gap: 'Հիմա',
          msg: 'Լավ պահ է դադար տալու մի քանի գիտակից շունչ քաշելու համար:',
        },
        { gap: '+41 ժ', msg: 'Արագ չեք-ին՝ ինչպե՞ս եք զգում հենց հիմա:' },
        {
          gap: '+53 ժ',
          msg: 'Հանգիստ պահ է գտել ձեզ: Ինչպե՞ս է ձեր էներգիան այսօր:',
        },
        {
          gap: '+38 ժ',
          msg: 'Ինչ-որ բան ձեզ բերել է այստեղ: 60 վայրկյան հատկացրեք ինքներդ ձեզ:',
        },
        {
          gap: '+49 ժ',
          msg: 'Ձեր միտքը ծանր է աշխատել: Պատրա՞ստ եք վերագործարկման:',
        },
      ],
      note: 'Պատահական միջակայքեր — զգացվում է, որ ընտրված է հատուկ ձեզ համար',
    },
  },
};

export default content;
