const content = {
  en: {
    task: 'Migrate billing system to new provider',
    estimateLabel: 'Estimate',
    before: {
      estimate: '3 days',
      cta: 'Commit to roadmap',
      aftermath:
        'Project shipped 18 days late. Customers got billed twice in week 2.',
    },
    after: {
      points: [
        {
          kind: 'optimistic',
          label: 'Optimistic',
          value: '3d',
          meta: 'No surprises',
        },
        {
          kind: 'realistic',
          label: 'Realistic',
          value: '7d',
          meta: 'Most likely',
        },
        {
          kind: 'pessimistic',
          label: 'Pessimistic',
          value: '14d',
          meta: '90% confidence',
        },
      ],
      historyTitle: 'Last 3 similar projects (estimate vs. actual)',
      history: [
        { name: 'Stripe migrate', est: 30, actual: 90, label: '3d → 9d' },
        { name: 'Tax overhaul', est: 25, actual: 75, label: '5d → 15d' },
        { name: 'Webhook v2', est: 40, actual: 80, label: '4d → 8d' },
      ],
    },
  },
  ru: {
    task: 'Миграция биллинга на нового провайдера',
    estimateLabel: 'Оценка',
    before: {
      estimate: '3 дня',
      cta: 'Зафиксировать в роадмапе',
      aftermath:
        'Релиз с опозданием на 18 дней. На второй неделе клиентов списали дважды.',
    },
    after: {
      points: [
        {
          kind: 'optimistic',
          label: 'Оптимистично',
          value: '3д',
          meta: 'Без сюрпризов',
        },
        {
          kind: 'realistic',
          label: 'Реалистично',
          value: '7д',
          meta: 'Скорее всего',
        },
        {
          kind: 'pessimistic',
          label: 'Пессимистично',
          value: '14д',
          meta: '90% уверенности',
        },
      ],
      historyTitle: 'Последние 3 похожих проекта (оценка vs факт)',
      history: [
        { name: 'Stripe-миграция', est: 30, actual: 90, label: '3д → 9д' },
        { name: 'Перевёрстка налогов', est: 25, actual: 75, label: '5д → 15д' },
        { name: 'Webhook v2', est: 40, actual: 80, label: '4д → 8д' },
      ],
    },
  },
  hy: {
    task: 'Billing-համակարգի միգրացիա նոր պրովայդերի',
    estimateLabel: 'Գնահատական',
    before: {
      estimate: '3 օր',
      cta: 'Ֆիքսել roadmap-ում',
      aftermath:
        'Թողարկվեց 18 օր ուշացումով։ 2-րդ շաբաթում հաճախորդներից կրկնակի գանձեց։',
    },
    after: {
      points: [
        {
          kind: 'optimistic',
          label: 'Լավատեսական',
          value: '3օ',
          meta: 'Առանց անակնկալների',
        },
        {
          kind: 'realistic',
          label: 'Իրատեսական',
          value: '7օ',
          meta: 'Ամենահավանականը',
        },
        {
          kind: 'pessimistic',
          label: 'Հոռետեսական',
          value: '14օ',
          meta: '90% վստահություն',
        },
      ],
      historyTitle: 'Վերջին 3 նմանատիպ պրոյեկտ (գնահատական vs փաստ)',
      history: [
        { name: 'Stripe-միգրացիա', est: 30, actual: 90, label: '3օ → 9օ' },
        {
          name: 'Հարկերի վերակառուցում',
          est: 25,
          actual: 75,
          label: '5օ → 15օ',
        },
        { name: 'Webhook v2', est: 40, actual: 80, label: '4օ → 8օ' },
      ],
    },
  },
};

export default content;
