const content = {
  en: {
    services: ['API', 'Dashboard', 'Webhooks', 'CDN'],
    before: {
      bannerTitle: 'Major Outage',
      bannerSub: 'API services degraded — started Oct 14, 09:42 UTC',
      sectionTitle: 'Incident History',
      incidents: [
        { badge: 'RESOLVED', name: 'Oct 14 — API Outage (4h 12m)' },
        { badge: 'RESOLVED', name: 'Sep 2 — Slow Response Times' },
      ],
    },
    after: {
      operationalTitle: 'All Systems Operational',
      operationalSub: 'Last checked 30 seconds ago',
      improvTitle: 'Recent Reliability Improvements',
      improvIcon: '+',
      improvements: [
        'Redundant API failover added (Oct 16)',
        'Real-time alerting threshold reduced 40%',
        'Uptime SLA upgraded to 99.95%',
      ],
      historyLink: 'View past incidents →',
    },
  },
  ru: {
    services: ['API', 'Дашборд', 'Вебхуки', 'CDN'],
    before: {
      bannerTitle: 'Масштабный сбой',
      bannerSub: 'API-сервисы работают со сбоями — с 14 окт, 09:42 UTC',
      sectionTitle: 'История инцидентов',
      incidents: [
        { badge: 'РЕШЕНО', name: '14 окт — Сбой API (4ч 12м)' },
        { badge: 'РЕШЕНО', name: '2 сент — Медленные ответы' },
      ],
    },
    after: {
      operationalTitle: 'Все системы работают',
      operationalSub: 'Последняя проверка 30 секунд назад',
      improvTitle: 'Недавние улучшения надёжности',
      improvIcon: '+',
      improvements: [
        'Добавлен резервный API-failover (16 окт)',
        'Порог оповещений в реальном времени снижен на 40%',
        'SLA аптайма повышен до 99,95%',
      ],
      historyLink: 'Смотреть прошлые инциденты →',
    },
  },
  hy: {
    services: ['API', 'Վահանակ', 'Վեբհուկներ', 'CDN'],
    before: {
      bannerTitle: 'Մեծ խափանում',
      bannerSub:
        'API ծառայությունները վատացել են — սկսվել է հոկտ. 14, 09:42 UTC',
      sectionTitle: 'Միջադեպերի պատմություն',
      incidents: [
        { badge: 'ԼՈՒԾՎԱԾ', name: 'Հոկտ. 14 — API խափանում (4ժ 12ր)' },
        { badge: 'ԼՈՒԾՎԱԾ', name: 'Սեպտ. 2 — Դանդաղ արձագանքներ' },
      ],
    },
    after: {
      operationalTitle: 'Բոլոր համակարգերն աշխատում են',
      operationalSub: 'Վերջին ստուգումը 30 վայրկյան առաջ',
      improvTitle: 'Վերջերս կայունության բարելավումներ',
      improvIcon: '+',
      improvements: [
        'Ավելացվել է ավելցուկային API failover (հոկտ. 16)',
        'Իրական ժամանակի ծանուցման շեմը նվազեցվել է 40%-ով',
        'Uptime SLA-ն բարելավվել է մինչև 99.95%',
      ],
      historyLink: 'Դիտել անցած միջադեպերը →',
    },
  },
};

export default content;
