const content = {
  en: {
    title: 'Authentication subsystem',
    costLabel: 'Estimated cost',
    timelineLabel: 'Time to ship',
    before: {
      tag: 'Build in-house',
      items: [
        'Design our own OAuth flow from scratch',
        'Hire 2 engineers, dedicated for 6 months',
        'Build SSO, MFA, password reset, audit logs',
        'Schedule quarterly security reviews — forever',
      ],
      cost: '$420,000 + 6 mo',
      timeline: '6 months. Roadmap blocked. Zero customer features shipped.',
    },
    after: {
      tag: 'Integrate proven',
      items: [
        'Drop in a battle-tested provider (10k+ companies use it)',
        'Wire up our user model in 1 sprint',
        'Add the bits that are actually our differentiator',
        'Provider handles security audits & compliance',
      ],
      cost: '$18,000/yr + 2 wk',
      timeline: '2 weeks. Engineers freed up for the work only we can do.',
    },
  },
  ru: {
    title: 'Подсистема аутентификации',
    costLabel: 'Оценка стоимости',
    timelineLabel: 'Срок до релиза',
    before: {
      tag: 'Пилим сами',
      items: [
        'Свой OAuth-флоу с нуля',
        'Нанимаем 2 инженеров на 6 месяцев',
        'Строим SSO, MFA, сброс пароля, аудит-логи',
        'Ежеквартальные security-ревью — навсегда',
      ],
      cost: '$420 000 + 6 мес',
      timeline: '6 месяцев. Роадмап заморожен. Ноль клиентских фич.',
    },
    after: {
      tag: 'Интегрируем готовое',
      items: [
        'Подключаем проверенного провайдера (10k+ компаний)',
        'Связываем со своей моделью пользователя за 1 спринт',
        'Добавляем то, что действительно отличает нас от других',
        'Провайдер берёт на себя аудиты и комплаенс',
      ],
      cost: '$18 000/год + 2 нед',
      timeline: '2 недели. Инженеры заняты тем, что можем сделать только мы.',
    },
  },
  hy: {
    title: 'Աութենտիֆիկացիայի ենթահամակարգ',
    costLabel: 'Կանխատեսված արժեք',
    timelineLabel: 'Ժամկետ մինչև թողարկում',
    before: {
      tag: 'Կառուցում ենք ինքներս',
      items: [
        'Մեր սեփական OAuth-հոսքը զրոյից',
        '2 ինժեներ վարձում ենք 6 ամսով',
        'Կառուցում ենք SSO, MFA, գաղտնաբառի վերականգնում, audit log-ներ',
        'Եռամսյակային security-վերանայումներ — հավերժ',
      ],
      cost: '$420,000 + 6 ամիս',
      timeline: '6 ամիս։ Roadmap-ը սառեցված է։ Հաճախորդների համար զրո ֆիչա։',
    },
    after: {
      tag: 'Ինտեգրում ենք պատրաստին',
      items: [
        'Միացնում ենք ապացուցված պրովայդեր (10k+ ընկերություն)',
        'Մեր օգտատերի մոդելի հետ կապում ենք 1 sprint-ում',
        'Ավելացնում ենք միայն այն, ինչ իրապես մեզ տարբերակում է',
        'Աուդիտներն ու compliance-ը պրովայդերի վրա է',
      ],
      cost: '$18,000/տարի + 2 շաբ',
      timeline:
        '2 շաբաթ։ Ինժեներները զբաղված են այն բանով, ինչ միայն մենք կարող ենք անել։',
    },
  },
};

export default content;
