const content = {
  en: {
    status: 'Resolved',
    duration: 'Duration: 2h 14m',
    title: 'Incident #2241 — Postmortem',
    before: {
      sections: [
        {
          label: 'Root Cause',
          body: 'Database connection pool exhaustion caused cascading failures across the API tier. All services restored at 14:22 UTC.',
        },
        {
          label: 'Impact',
          body: '~4,200 users affected. 99.3% uptime maintained for the month.',
        },
      ],
    },
    after: {
      timelineLabel: 'Pre-incident signals (hindsight view)',
      events: [
        {
          time: '11:02',
          msg: 'Latency p99 +12ms — within normal range',
          ambiguous: true,
        },
        {
          time: '11:47',
          msg: 'DB pool utilization 68% — not alerting',
          ambiguous: true,
        },
        {
          time: '12:09',
          msg: 'API error rate 0.4% — below threshold',
          ambiguous: true,
        },
        { time: '12:23', msg: 'Outage begins', ambiguous: false },
      ],
      tlNote: 'At the time, none of these signals exceeded warning thresholds.',
      addingLabel: "What we're adding",
      addingList: [
        'Composite alert: latency + pool utilization together',
        'Auto-scaling trigger at 60% pool capacity',
      ],
    },
  },
  ru: {
    status: 'Решено',
    duration: 'Длительность: 2ч 14м',
    title: 'Инцидент №2241 — Разбор',
    before: {
      sections: [
        {
          label: 'Корневая причина',
          body: 'Исчерпание пула соединений с БД вызвало каскадные сбои в API-слое. Все сервисы восстановлены в 14:22 UTC.',
        },
        {
          label: 'Влияние',
          body: '~4 200 пользователей затронуто. Аптайм за месяц — 99,3%.',
        },
      ],
    },
    after: {
      timelineLabel: 'Сигналы до инцидента (взгляд в прошлое)',
      events: [
        {
          time: '11:02',
          msg: 'Задержка p99 +12мс — в пределах нормы',
          ambiguous: true,
        },
        {
          time: '11:47',
          msg: 'Использование пула БД 68% — без оповещений',
          ambiguous: true,
        },
        {
          time: '12:09',
          msg: 'Ошибки API 0,4% — ниже порога',
          ambiguous: true,
        },
        { time: '12:23', msg: 'Начало сбоя', ambiguous: false },
      ],
      tlNote:
        'На тот момент ни один из этих сигналов не превысил порогов оповещения.',
      addingLabel: 'Что мы добавляем',
      addingList: [
        'Составной алерт: задержка + использование пула вместе',
        'Триггер автомасштабирования при 60% загрузки пула',
      ],
    },
  },
  hy: {
    status: 'Լուծված',
    duration: 'Տևողություն՝ 2ժ 14ր',
    title: 'Միջադեպ #2241 — Հետանալիզ',
    before: {
      sections: [
        {
          label: 'Հիմնական պատճառ',
          body: 'Տվյալների բազայի կապերի պուլի սպառումը առաջացրեց կասկադային խափանումներ API շերտում։ Բոլոր ծառայությունները վերականգնվել են 14:22 UTC-ին։',
        },
        {
          label: 'Ազդեցություն',
          body: '~4,200 օգտատեր է ազդվել։ Ամսվա համար ապահովվել է 99.3% uptime։',
        },
      ],
    },
    after: {
      timelineLabel: 'Միջադեպից առաջ ազդանշաններ (հետադարձ հայացք)',
      events: [
        {
          time: '11:02',
          msg: 'p99 լատենտություն +12մվ — նորմալ սահմաններում',
          ambiguous: true,
        },
        {
          time: '11:47',
          msg: 'ԲԲ պուլի օգտագործումը 68% — առանց զգուշացման',
          ambiguous: true,
        },
        {
          time: '12:09',
          msg: 'API-ի սխալի գործակից 0.4% — շեմից ցածր',
          ambiguous: true,
        },
        { time: '12:23', msg: 'Խափանումը սկսվում է', ambiguous: false },
      ],
      tlNote:
        'Այդ պահին այս ազդանշաններից ոչ մեկը չէր գերազանցում զգուշացման շեմերը։',
      addingLabel: 'Ինչ ենք ավելացնում',
      addingList: [
        'Կոմպոզիտ զգուշացում՝ լատենտություն + պուլի օգտագործում միասին',
        'Ավտոմատ սկալավորման թրիգեր պուլի 60% հզորության դեպքում',
      ],
    },
  },
};

export default content;
