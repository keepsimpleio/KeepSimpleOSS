const content = {
  en: {
    before: {
      greeting: 'Hi,',
      persona: 'Engineering Manager',
      subline: "Here's your standard manager dashboard.",
      modules: [
        { icon: '\u{1F4CA}', label: 'Team velocity' },
        { icon: '\u{1F465}', label: 'Headcount planning' },
        { icon: '\u{1F4B0}', label: 'Comp reviews' },
        { icon: '\u{1F4C5}', label: '1:1 schedule' },
      ],
      note: 'Same dashboard for all 240 managers in the workspace.',
    },
    after: {
      greeting: 'Hi,',
      persona: 'Maya',
      subline: 'Tuned to how you actually work this week.',
      signalsTitle: 'Live signals',
      signals: [
        { label: 'Last 14 days', value: '11 PRs reviewed, 2 1:1s' },
        { label: 'Top widget', value: 'Incident timeline' },
        { label: 'Never opened', value: 'Comp planning' },
      ],
      modules: [
        { icon: '\u{1F6A8}', label: 'On-call dashboard' },
        { icon: '\u{1F501}', label: 'PR review queue' },
      ],
    },
  },
  ru: {
    before: {
      greeting: 'Привет,',
      persona: 'Engineering Manager',
      subline: 'Стандартный дашборд для руководителя.',
      modules: [
        { icon: '\u{1F4CA}', label: 'Скорость команды' },
        { icon: '\u{1F465}', label: 'Планирование штата' },
        { icon: '\u{1F4B0}', label: 'Ревью компенсаций' },
        { icon: '\u{1F4C5}', label: 'Расписание 1:1' },
      ],
      note: 'Один и тот же дашборд для всех 240 менеджеров в воркспейсе.',
    },
    after: {
      greeting: 'Привет,',
      persona: 'Майя',
      subline: 'Настроено под то, как вы реально работаете на этой неделе.',
      signalsTitle: 'Живые сигналы',
      signals: [
        { label: 'За 14 дней', value: '11 PR-ов, 2 встречи 1:1' },
        { label: 'Любимый виджет', value: 'Таймлайн инцидентов' },
        { label: 'Не открывали', value: 'Планирование компенсаций' },
      ],
      modules: [
        { icon: '\u{1F6A8}', label: 'On-call дашборд' },
        { icon: '\u{1F501}', label: 'Очередь PR на ревью' },
      ],
    },
  },
  hy: {
    before: {
      greeting: 'Բարև,',
      persona: 'Engineering Manager',
      subline: 'Ստանդարտ dashboard ղեկավարների համար։',
      modules: [
        { icon: '\u{1F4CA}', label: 'Թիմի արագություն' },
        { icon: '\u{1F465}', label: 'Հաստիքային պլանավորում' },
        { icon: '\u{1F4B0}', label: 'Աշխատավարձի վերանայում' },
        { icon: '\u{1F4C5}', label: '1:1 ժամանակացույց' },
      ],
      note: 'Միևնույն dashboard-ը workspace-ի բոլոր 240 մենեջերների համար։',
    },
    after: {
      greeting: 'Բարև,',
      persona: 'Մայա',
      subline:
        'Հարմարեցված է այն բանին, թե ինչպես եք իրականում աշխատում այս շաբաթ։',
      signalsTitle: 'Կենդանի ազդանշաններ',
      signals: [
        { label: 'Վերջին 14 օրը', value: '11 PR վերանայված, 2 1:1' },
        { label: 'Ամենաշատը բացված', value: 'Ինցիդենտի ժամանակագրություն' },
        { label: 'Երբեք չբացված', value: 'Աշխատավարձի պլանավորում' },
      ],
      modules: [
        { icon: '\u{1F6A8}', label: 'On-call dashboard' },
        { icon: '\u{1F501}', label: 'PR-ների վերանայման հերթ' },
      ],
    },
  },
};

export default content;
