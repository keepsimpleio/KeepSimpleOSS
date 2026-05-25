const content = {
  en: {
    before: {
      incidentIcon: '!',
      incidentTitle: 'Incident Resolved',
      incidentTime: 'Resolved Oct 14 at 14:23 UTC',
      uptimeLabel: '30-day uptime',
      uptimeValue: '99.97%',
      affectedLabel: 'Affected service',
      affectedValue: 'API Gateway',
      durationLabel: 'Duration',
      durationValue: '4 hours 12 minutes',
      label: '"Incident" framing stays top of mind despite good uptime',
    },
    after: {
      maintenanceIcon: '✓',
      maintenanceTitle: 'Maintenance Complete',
      maintenanceTime: 'Oct 14 at 14:23 UTC',
      safetyBanner: 'Your data is safe — no records affected',
      improvTitle: 'What we improved:',
      improvements: [
        'API failover response time cut from 12s to 800ms',
        'Added redundant gateway in EU-West region',
        'Uptime SLA raised from 99.9% to 99.95%',
      ],
      label: 'Safety-first framing neutralizes the negative weight',
    },
  },
  ru: {
    before: {
      incidentIcon: '!',
      incidentTitle: 'Инцидент устранён',
      incidentTime: 'Устранён 14 окт в 14:23 UTC',
      uptimeLabel: 'Аптайм за 30 дней',
      uptimeValue: '99,97%',
      affectedLabel: 'Затронутый сервис',
      affectedValue: 'API Gateway',
      durationLabel: 'Длительность',
      durationValue: '4 часа 12 минут',
      label:
        'Формулировка «инцидент» остаётся в памяти несмотря на хороший аптайм',
    },
    after: {
      maintenanceIcon: '✓',
      maintenanceTitle: 'Обслуживание завершено',
      maintenanceTime: '14 окт в 14:23 UTC',
      safetyBanner: 'Ваши данные в безопасности — записи не затронуты',
      improvTitle: 'Что мы улучшили:',
      improvements: [
        'Время отклика API-failover снижено с 12 с до 800 мс',
        'Добавлен резервный шлюз в регионе EU-West',
        'SLA аптайма повышен с 99,9% до 99,95%',
      ],
      label: 'Формулировка через безопасность нейтрализует негативный вес',
    },
  },
  hy: {
    before: {
      incidentIcon: '!',
      incidentTitle: 'Միջադեպը լուծված է',
      incidentTime: 'Լուծված է հոկտ. 14-ին, 14:23 UTC',
      uptimeLabel: '30-օրյա uptime',
      uptimeValue: '99.97%',
      affectedLabel: 'Ազդված ծառայություն',
      affectedValue: 'API Gateway',
      durationLabel: 'Տևողություն',
      durationValue: '4 ժամ 12 րոպե',
      label: '«Միջադեպ» ձևակերպումը մնում է մտքում, չնայած լավ uptime-ին',
    },
    after: {
      maintenanceIcon: '✓',
      maintenanceTitle: 'Սպասարկումն ավարտված է',
      maintenanceTime: 'Հոկտ. 14, 14:23 UTC',
      safetyBanner: 'Ձեր տվյալներն անվտանգ են — որևէ գրառում չի ազդվել',
      improvTitle: 'Ինչ ենք բարելավել՝',
      improvements: [
        'API failover-ի արձագանքի ժամանակը կրճատվել է 12վ-ից 800մվ-ի',
        'Ավելացվել է ավելցուկային gateway EU-West տարածաշրջանում',
        'Uptime SLA-ն բարձրացվել է 99.9%-ից 99.95%-ի',
      ],
      label:
        'Անվտանգության առաջնահերթության ձևակերպումը չեզոքացնում է բացասական կշիռը',
    },
  },
};

export default content;
