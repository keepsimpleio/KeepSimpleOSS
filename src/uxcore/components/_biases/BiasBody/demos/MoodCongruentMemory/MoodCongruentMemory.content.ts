const content = {
  en: {
    greeting: 'Hi Alex,',
    before: {
      from: 'billing@app.io',
      subject: 'Your annual plan expires in 3 days',
      bodyLead: 'Your annual plan expires on',
      bodyDate: 'March 26',
      bodyTail: '. To avoid service interruption, please renew now.',
      price: '$199 / year',
      priceSub: 'Billed annually',
      btn: 'Renew Now',
      footer: 'Need help? Reply to this email.',
      label: 'Sent on schedule — user just filed a frustration ticket',
    },
    after: {
      from: 'support@app.io',
      subject: 'The sync issue you reported — fixed',
      resolvedBanner:
        'Sync issue resolved — everything is running smoothly now.',
      body: 'We pushed a fix for the issue you reported last week. Your data is fully synced and no action is needed on your end.',
      byTheWay:
        'By the way, your annual plan renews next week. Let us know if you have questions before then.',
      btn: 'View My Plan',
      label: 'Delayed — resolution first, renewal request after mood lifts',
    },
  },
  ru: {
    greeting: 'Здравствуйте, Алекс,',
    before: {
      from: 'billing@app.io',
      subject: 'Ваш годовой план истекает через 3 дня',
      bodyLead: 'Ваш годовой план истекает',
      bodyDate: '26 марта',
      bodyTail:
        '. Чтобы избежать перерыва в обслуживании, продлите подписку сейчас.',
      price: '$199 / год',
      priceSub: 'Оплата раз в год',
      btn: 'Продлить сейчас',
      footer: 'Нужна помощь? Ответьте на это письмо.',
      label:
        'Отправлено по расписанию — а пользователь только что оставил жалобу',
    },
    after: {
      from: 'support@app.io',
      subject: 'Проблема с синхронизацией, о которой вы сообщили — решена',
      resolvedBanner:
        'Проблема с синхронизацией устранена — всё снова работает стабильно.',
      body: 'Мы выкатили исправление проблемы, о которой вы сообщили на прошлой неделе. Ваши данные полностью синхронизированы, от вас больше ничего не требуется.',
      byTheWay:
        'К слову, ваш годовой план продлевается на следующей неделе. Напишите, если будут вопросы до этого.',
      btn: 'Посмотреть мой план',
      label:
        'С задержкой — сначала решение, затем просьба о продлении, когда настроение улучшилось',
    },
  },
  hy: {
    greeting: 'Բարև, Ալեքս,',
    before: {
      from: 'billing@app.io',
      subject: 'Ձեր տարեկան փաթեթն ավարտվում է 3 օրից',
      bodyLead: 'Ձեր տարեկան փաթեթն ավարտվում է',
      bodyDate: 'մարտի 26-ին',
      bodyTail:
        '։ Ծառայության ընդհատումից խուսափելու համար, խնդրում ենք երկարաձգել հիմա։',
      price: '$199 / տարի',
      priceSub: 'Տարեկան վճարում',
      btn: 'Երկարաձգել հիմա',
      footer: 'Օգնության կարի՞ք ունեք։ Պատասխանեք այս նամակին։',
      label:
        'Ուղարկված է ժամանակացույցով — իսկ օգտատերը հենց նոր դժգոհության հայտ է գրանցել',
    },
    after: {
      from: 'support@app.io',
      subject: 'Ձեր հաղորդած սինքրոնացման խնդիրը — լուծված է',
      resolvedBanner:
        'Սինքրոնացման խնդիրը լուծված է — ամեն ինչ այժմ սահուն է աշխատում։',
      body: 'Մենք թողարկեցինք ուղղում այն խնդրի համար, որի մասին դուք հաղորդեցիք անցած շաբաթ։ Ձեր տվյալները ամբողջությամբ սինքրոնացված են, ձեր կողմից այլևս գործողություն չի պահանջվում։',
      byTheWay:
        'Ի դեպ, ձեր տարեկան փաթեթը երկարաձգվում է հաջորդ շաբաթ։ Տեղեկացրեք, եթե մինչ այդ հարցեր ունեք։',
      btn: 'Դիտել իմ փաթեթը',
      label:
        'Հետաձգված — նախ լուծում, ապա երկարաձգման հարցում, երբ տրամադրությունը բարձրանա',
    },
  },
};

export default content;
