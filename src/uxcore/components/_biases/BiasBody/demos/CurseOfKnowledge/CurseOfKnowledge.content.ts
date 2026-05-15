const content = {
  en: {
    before: {
      title: 'Configure Your Pipeline',
      sub: 'Set up your CI/CD pipeline using YAML configuration.',
      code: [
        { key: 'build_triggers:', val: '', indent: false },
        { key: 'on_push:', val: 'main', indent: true },
        { key: 'deployment_target:', val: 'prod-cluster', indent: true },
        { key: 'artifact_registry:', val: 'gcr.io/myapp', indent: true },
      ],
      jargon:
        'Configure build triggers, deployment targets, and artifact registry endpoints.',
      cta: 'Deploy Pipeline',
    },
    after: {
      title: 'What do you want to automate?',
      sub: "Pick what matters to you — we'll handle the setup.",
      options: [
        {
          title: 'Test my code',
          desc: 'Run checks on every change',
          selected: true,
        },
        {
          title: 'Deploy to production',
          desc: 'Publish when tests pass',
          selected: false,
        },
        { title: 'Both', desc: 'Full test-and-deploy flow', selected: false },
      ],
      cta: 'Continue',
    },
  },
  ru: {
    before: {
      title: 'Настройте ваш пайплайн',
      sub: 'Настройте CI/CD-пайплайн с помощью YAML-конфигурации.',
      code: [
        { key: 'build_triggers:', val: '', indent: false },
        { key: 'on_push:', val: 'main', indent: true },
        { key: 'deployment_target:', val: 'prod-cluster', indent: true },
        { key: 'artifact_registry:', val: 'gcr.io/myapp', indent: true },
      ],
      jargon:
        'Настройте триггеры сборки, цели развёртывания и эндпоинты реестра артефактов.',
      cta: 'Запустить пайплайн',
    },
    after: {
      title: 'Что вы хотите автоматизировать?',
      sub: 'Выберите, что важно для вас — настройку сделаем мы.',
      options: [
        {
          title: 'Проверить мой код',
          desc: 'Запускать проверки при каждом изменении',
          selected: true,
        },
        {
          title: 'Развернуть в продакшн',
          desc: 'Публиковать, когда тесты проходят',
          selected: false,
        },
        {
          title: 'И то, и другое',
          desc: 'Полный цикл: тесты и деплой',
          selected: false,
        },
      ],
      cta: 'Продолжить',
    },
  },
  hy: {
    before: {
      title: 'Կարգավորեք ձեր պայպլայնը',
      sub: 'Կարգավորեք CI/CD պայպլայնը YAML կոնֆիգուրացիայի միջոցով։',
      code: [
        { key: 'build_triggers:', val: '', indent: false },
        { key: 'on_push:', val: 'main', indent: true },
        { key: 'deployment_target:', val: 'prod-cluster', indent: true },
        { key: 'artifact_registry:', val: 'gcr.io/myapp', indent: true },
      ],
      jargon:
        'Կարգավորեք կառուցման թրիգերները, տեղակայման նպատակները և արտեֆակտների ռեեստրի էնդփոինթերը։',
      cta: 'Գործարկել պայպլայնը',
    },
    after: {
      title: 'Ի՞նչ եք ցանկանում ավտոմատացնել։',
      sub: 'Ընտրեք այն, ինչն ձեզ համար կարևոր է — կարգավորումը մենք կանենք։',
      options: [
        {
          title: 'Ստուգել իմ կոդը',
          desc: 'Գործարկել ստուգումներ ամեն փոփոխության ժամանակ',
          selected: true,
        },
        {
          title: 'Տեղակայել արտադրության մեջ',
          desc: 'Հրապարակել, երբ թեսթերն անցնում են',
          selected: false,
        },
        {
          title: 'Երկուսն էլ',
          desc: 'Ամբողջական թեսթ և տեղակայման հոսք',
          selected: false,
        },
      ],
      cta: 'Շարունակել',
    },
  },
};

export default content;
