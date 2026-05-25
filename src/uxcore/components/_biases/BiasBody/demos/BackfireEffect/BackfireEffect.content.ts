const content = {
  en: {
    chatHeader: 'Support Chat',
    userMessage: 'I was charged twice for my subscription this month!',
    before: {
      agentReply:
        'Our records show you were charged correctly. Here is the invoice proving the charge is valid. The Terms of Service section 4.2 states that charges are non-refundable.',
      attachments: ['📄 Invoice_March.pdf', '📄 ToS_section4.2.pdf'],
      followUp: 'Is there anything else I can help you with?',
    },
    after: {
      agentReply:
        'I understand this charge was unexpected — that would concern me too. Let me walk through your account activity with you so we can figure out exactly what happened together.',
      activity: [
        { label: 'Mar 1 — Renewal', amount: '$29.00' },
        { label: 'Mar 1 — Plan upgrade', amount: '$10.00' },
      ],
      followUp:
        "Does that match what you saw? If anything looks off, we'll fix it right away.",
    },
  },
  ru: {
    chatHeader: 'Чат поддержки',
    userMessage: 'С меня в этом месяце дважды списали за подписку!',
    before: {
      agentReply:
        'Согласно нашим записям, списание корректно. Вот счёт, подтверждающий, что платёж действителен. Раздел 4.2 Условий обслуживания гласит, что списания не возвращаются.',
      attachments: ['📄 Счёт_март.pdf', '📄 Условия_4.2.pdf'],
      followUp: 'Могу ещё чем-нибудь помочь?',
    },
    after: {
      agentReply:
        'Понимаю, что это списание было неожиданным — меня бы это тоже насторожило. Давайте вместе пройдёмся по активности вашего аккаунта и разберёмся, что произошло.',
      activity: [
        { label: '1 марта — Продление', amount: '$29,00' },
        { label: '1 марта — Апгрейд тарифа', amount: '$10,00' },
      ],
      followUp:
        'Это совпадает с тем, что вы видели? Если что-то не так — сразу исправим.',
    },
  },
  hy: {
    chatHeader: 'Աջակցության չատ',
    userMessage:
      'Այս ամիս բաժանորդագրությանս համար ինձնից երկու անգամ գումար են գանձել:',
    before: {
      agentReply:
        'Մեր գրառումների համաձայն՝ գանձումը կատարվել է ճիշտ: Ահա հաշիվը, որը հաստատում է վճարումը: Ծառայության պայմանների 4.2-րդ կետը նշում է, որ գանձումները չեն վերադարձվում:',
      attachments: ['📄 Հաշիվ_մարտ.pdf', '📄 Պայմաններ_4.2.pdf'],
      followUp: 'Կարո՞ղ եմ այլ բանով օգնել:',
    },
    after: {
      agentReply:
        'Հասկանում եմ, որ այս գանձումը անսպասելի էր — ինձ էլ դա կմտահոգեր: Եկեք միասին նայենք ձեր հաշվի ակտիվությանը, որպեսզի հստակ պարզենք, թե ինչ է տեղի ունեցել:',
      activity: [
        { label: 'մարտի 1 — Վերականգնում', amount: '$29,00' },
        { label: 'մարտի 1 — Փաթեթի բարձրացում', amount: '$10,00' },
      ],
      followUp:
        'Դա համապատասխանու՞մ է ձեր տեսածին: Եթե որևէ բան սխալ է — անմիջապես կուղղենք:',
    },
  },
};

export default content;
