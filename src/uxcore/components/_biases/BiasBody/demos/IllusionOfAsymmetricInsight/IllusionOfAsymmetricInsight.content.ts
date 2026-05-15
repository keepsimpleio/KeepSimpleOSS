const content = {
  en: {
    before: {
      channel: '#team-product · 2:14 PM',
      author: 'Lead PM',
      text: 'I think we all agree the new flow is a no-brainer. Shipping Friday.',
      assumption:
        "I read the room. They're on board. (No one pushed back, so they must agree.)",
    },
    after: {
      channel: 'Decision template — pinned',
      tplTitle: 'How I want to use this template',
      fields: [
        {
          label: "What I'm proposing",
          value: 'Replace 4-step signup with 2-step magic link.',
        },
        {
          label: 'Why I think so',
          value: '37% drop-off between step 2 and 3 in last cohort.',
        },
        {
          label: 'What I might be missing',
          value: 'Enterprise admins may need SSO routing in step 2.',
        },
        {
          label: "How I'll know I'm wrong",
          value: 'If activation drops or support tickets spike in 2 weeks.',
        },
      ],
      checkLabel: 'Reply with:',
      check: 'one thing you read differently from how I framed it.',
    },
  },
  ru: {
    before: {
      channel: '#team-product · 14:14',
      author: 'Lead PM',
      text: 'Думаю, все согласны, что новый флоу — очевидный win. Релизим в пятницу.',
      assumption:
        'Я считал команду. Все «за». (Никто не возразил — значит, согласны.)',
    },
    after: {
      channel: 'Шаблон решения — закреплён',
      tplTitle: 'Как я хочу использовать этот шаблон',
      fields: [
        {
          label: 'Что предлагаю',
          value: 'Заменить 4-шаговый сайнап на 2-шаговый magic link.',
        },
        {
          label: 'Почему так думаю',
          value: '37% дропают между шагом 2 и 3 в последней когорте.',
        },
        {
          label: 'Что могу упускать',
          value:
            'Enterprise-админам может быть нужна маршрутизация SSO на шаге 2.',
        },
        {
          label: 'Как пойму, что ошибся',
          value:
            'Если за 2 недели упадёт активация или вырастут саппорт-тикеты.',
        },
      ],
      checkLabel: 'Ответьте:',
      check: 'что-то одно, что вы прочитали не так, как я сформулировал.',
    },
  },
  hy: {
    before: {
      channel: '#team-product · 14:14',
      author: 'Lead PM',
      text: 'Կարծում եմ՝ բոլորս համաձայն ենք, որ նոր flow-ը ակնհայտ win է։ Թողարկում ենք ուրբաթ։',
      assumption:
        'Ես «կարդացի» թիմը։ Բոլորը կողմ են։ (Ոչ ոք չառարկեց — ուրեմն համաձայն են։)',
    },
    after: {
      channel: 'Որոշման տեմպլեյթ — ամրացված',
      tplTitle: 'Ինչպես եմ ուզում օգտագործել այս տեմպլեյթը',
      fields: [
        {
          label: 'Ինչ եմ առաջարկում',
          value: '4-քայլ signup-ը փոխարինել 2-քայլ magic link-ով։',
        },
        {
          label: 'Ինչու եմ այդպես կարծում',
          value: 'Վերջին cohort-ում 37%-ը հեռանում է 2-րդ և 3-րդ քայլերի միջև։',
        },
        {
          label: 'Ինչ կարող է բացակայել',
          value:
            'Enterprise-ադմիններին գուցե պետք լինի SSO-routing 2-րդ քայլում։',
        },
        {
          label: 'Ինչպես կհասկանամ, որ սխալ եմ',
          value:
            'Եթե 2 շաբաթում activation-ը ընկնի կամ support-tikket-ները շատանան։',
        },
      ],
      checkLabel: 'Պատասխանեք.',
      check: 'մեկ բան, որը կարդացիք այլ կերպ, քան ես ձևակերպեցի։',
    },
  },
};

export default content;
