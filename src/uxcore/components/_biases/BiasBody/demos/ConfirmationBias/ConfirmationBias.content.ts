const content = {
  en: {
    before: {
      pageTitle: 'Security Settings',
      settings: [
        { label: 'Change Password', action: 'Update', type: 'button' as const },
        { label: 'Two-Factor Authentication', type: 'toggle' as const },
        { label: 'Active Sessions', action: 'View', type: 'button' as const },
      ],
    },
    after: {
      statusIcon: '✅',
      statusTitle: 'Your Security Status: Protected',
      statusSub: 'Last verified 2 minutes ago',
      indicators: [
        'End-to-end encryption active',
        '0 data breaches detected',
        'Anonymous ID verified',
        'Security audit: Jan 15, 2026',
      ],
      footerLinks: ['View Transparency Report', 'Security Settings'],
      sep: '·',
    },
  },
  ru: {
    before: {
      pageTitle: 'Настройки безопасности',
      settings: [
        {
          label: 'Сменить пароль',
          action: 'Изменить',
          type: 'button' as const,
        },
        { label: 'Двухфакторная аутентификация', type: 'toggle' as const },
        {
          label: 'Активные сессии',
          action: 'Посмотреть',
          type: 'button' as const,
        },
      ],
    },
    after: {
      statusIcon: '✅',
      statusTitle: 'Ваш статус безопасности: Защищено',
      statusSub: 'Последняя проверка 2 минуты назад',
      indicators: [
        'Сквозное шифрование активно',
        '0 утечек данных обнаружено',
        'Анонимный ID подтверждён',
        'Аудит безопасности: 15 янв 2026',
      ],
      footerLinks: ['Смотреть отчёт о прозрачности', 'Настройки безопасности'],
      sep: '·',
    },
  },
  hy: {
    before: {
      pageTitle: 'Անվտանգության կարգավորումներ',
      settings: [
        {
          label: 'Փոխել գաղտնաբառը',
          action: 'Թարմացնել',
          type: 'button' as const,
        },
        { label: 'Երկգործոն նույնականացում', type: 'toggle' as const },
        { label: 'Ակտիվ սեսիաներ', action: 'Դիտել', type: 'button' as const },
      ],
    },
    after: {
      statusIcon: '✅',
      statusTitle: 'Ձեր անվտանգության կարգավիճակը՝ Պաշտպանված',
      statusSub: 'Վերջին ստուգումը 2 րոպե առաջ',
      indicators: [
        'Ծայրից ծայր գաղտնագրումն ակտիվ է',
        '0 տվյալների արտահոսք հայտնաբերված',
        'Անանուն ID-ն հաստատված է',
        'Անվտանգության աուդիտ՝ 2026-ի հունվարի 15',
      ],
      footerLinks: [
        'Դիտել թափանցիկության հաշվետվությունը',
        'Անվտանգության կարգավորումներ',
      ],
      sep: '·',
    },
  },
};

export default content;
