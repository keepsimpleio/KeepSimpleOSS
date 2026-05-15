const content = {
  en: {
    title: 'Candidate Review',
    candidate: 'Alex M. — Senior Engineer',
    scoreLabel: 'Overall',
    before: {
      feedback:
        "Strong gut feeling. Reminds me of Jordan from the platform team — that worked out great. I think he'd be a culture fit. Would hire.",
      score: '4.5 / 5',
      disclaimer: '"I\'m a fair judge of character — I don\'t play favorites."',
    },
    after: {
      criteria: [
        {
          label: 'System design (live exercise)',
          value: 4,
          evidence:
            'Designed sharded queue; missed back-pressure — flagged it himself.',
        },
        {
          label: 'Code quality (take-home)',
          value: 3,
          evidence: 'Solution worked, tests thin, error handling skipped.',
        },
        {
          label: 'Collaboration (panel signal)',
          value: 4,
          evidence:
            'Asked clarifying questions; pushed back on ambiguous reqs.',
        },
      ],
      counterLabel: 'Counter-evidence prompt:',
      counter:
        'Name one specific reason this candidate might fail in this role.',
    },
  },
  ru: {
    title: 'Оценка кандидата',
    candidate: 'Алекс М. — Senior Engineer',
    scoreLabel: 'Итого',
    before: {
      feedback:
        'Сильное первое впечатление. Напоминает Джордана из платформенной команды — там всё сложилось. Думаю, наш человек по культуре. Брал бы.',
      score: '4.5 / 5',
      disclaimer: '«Я объективно оцениваю людей — без любимчиков».',
    },
    after: {
      criteria: [
        {
          label: 'System design (живая задача)',
          value: 4,
          evidence:
            'Спроектировал шардированную очередь; забыл про back-pressure — сам поднял вопрос.',
        },
        {
          label: 'Качество кода (тестовое)',
          value: 3,
          evidence:
            'Решение работает, тесты слабые, обработка ошибок пропущена.',
        },
        {
          label: 'Коммуникация (сигнал панели)',
          value: 4,
          evidence:
            'Задавал уточняющие вопросы, спорил с размытыми требованиями.',
        },
      ],
      counterLabel: 'Промпт на контр-аргументы:',
      counter:
        'Назовите одну конкретную причину, по которой этот кандидат может не справиться.',
    },
  },
  hy: {
    title: 'Թեկնածուի գնահատում',
    candidate: 'Ալեքս Մ. — Senior Engineer',
    scoreLabel: 'Ընդհանուր',
    before: {
      feedback:
        'Ուժեղ ինտուիցիա։ Հիշեցնում է Ջորդանին պլատֆորմի թիմից — այնտեղ լավ ստացվեց։ Կարծում եմ՝ կուլտուրապես հարմար է։ Կվարձեի։',
      score: '4.5 / 5',
      disclaimer: '«Ես արդար եմ դատում մարդկանց — սիրելիներ չեմ ընտրում»։',
    },
    after: {
      criteria: [
        {
          label: 'System design (կենդանի վարժություն)',
          value: 4,
          evidence:
            'Նախագծեց shard-ավորված queue; back-pressure-ը բաց թողեց — ինքն էլ նկատեց։',
        },
        {
          label: 'Կոդի որակ (take-home)',
          value: 3,
          evidence:
            'Լուծումն աշխատում է, թեստերը թույլ են, սխալների մշակումը բաց է։',
        },
        {
          label: 'Կոլաբորացիա (պանելի ազդանշան)',
          value: 4,
          evidence: 'Ճշտող հարցեր է տալիս, անհստակ պահանջներին հակառակվում է։',
        },
      ],
      counterLabel: 'Հակափաստարկի հուշում.',
      counter:
        'Նշեք մեկ կոնկրետ պատճառ, թե ինչու այս թեկնածուն կարող է չհաջողել այս դերում։',
    },
  },
};

export default content;
