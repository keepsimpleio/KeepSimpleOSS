const content = {
  en: {
    title: 'API Configuration',
    labels: {
      webhookUrl: 'Webhook URL',
      authToken: 'Auth Token',
      retryPolicy: 'Retry Policy',
      timeout: 'Timeout (ms)',
      eventFilter: 'Event Filter',
    },
    cta: 'Save Configuration',
    helpTrigger: '?',
    before: {
      placeholders: {
        webhookUrl: 'https://',
        authToken: '••••••••••••',
        timeout: '5000',
        eventFilter: 'push,pull_request',
      },
      retryOption: 'exponential',
    },
    after: {
      placeholders: {
        webhookUrl: 'https://yourapp.com/hooks/events',
        authToken: '••••••••••••',
        timeout: '5000',
        eventFilter: 'push, pull_request',
      },
      retryOption: 'exponential — wait longer after each failure',
      tips: {
        webhookUrl:
          "Where should we send event notifications? Paste your server's HTTPS endpoint here.",
        authToken:
          "A secret key we include in every request so your server can verify it's really us. Keep this private.",
        retryPolicy:
          'If delivery fails, how long to wait before trying again. Exponential means each retry waits twice as long.',
        timeout:
          'How long to wait for your server to respond before marking the delivery as failed. 5000 = 5 seconds.',
        eventFilter:
          'Only send notifications for these event types. Comma-separated. Leave blank to receive all events.',
      },
      guideLink: 'Not sure? See the setup guide →',
    },
  },
  ru: {
    title: 'Настройка API',
    labels: {
      webhookUrl: 'URL вебхука',
      authToken: 'Токен авторизации',
      retryPolicy: 'Политика повторов',
      timeout: 'Таймаут (мс)',
      eventFilter: 'Фильтр событий',
    },
    cta: 'Сохранить настройки',
    helpTrigger: '?',
    before: {
      placeholders: {
        webhookUrl: 'https://',
        authToken: '••••••••••••',
        timeout: '5000',
        eventFilter: 'push,pull_request',
      },
      retryOption: 'экспоненциальная',
    },
    after: {
      placeholders: {
        webhookUrl: 'https://yourapp.com/hooks/events',
        authToken: '••••••••••••',
        timeout: '5000',
        eventFilter: 'push, pull_request',
      },
      retryOption: 'экспоненциальная — ждать дольше после каждой неудачи',
      tips: {
        webhookUrl:
          'Куда отправлять уведомления о событиях? Вставьте HTTPS-эндпоинт вашего сервера.',
        authToken:
          'Секретный ключ, который мы добавляем в каждый запрос, чтобы ваш сервер мог проверить, что это мы. Держите его в тайне.',
        retryPolicy:
          'Если доставка не удалась, сколько ждать до следующей попытки. Экспоненциальная — каждая следующая попытка ждёт в два раза дольше.',
        timeout:
          'Сколько ждать ответа от вашего сервера, прежде чем считать доставку неудачной. 5000 = 5 секунд.',
        eventFilter:
          'Отправлять уведомления только для этих типов событий. Через запятую. Оставьте пустым, чтобы получать все.',
      },
      guideLink: 'Не уверены? Посмотреть руководство по настройке →',
    },
  },
  hy: {
    title: 'API կարգավորում',
    labels: {
      webhookUrl: 'Webhook URL',
      authToken: 'Նույնականացման թոքեն',
      retryPolicy: 'Կրկնելու քաղաքականություն',
      timeout: 'Ժամանակի սպառում (մվ)',
      eventFilter: 'Իրադարձությունների զտիչ',
    },
    cta: 'Պահպանել կարգավորումները',
    helpTrigger: '?',
    before: {
      placeholders: {
        webhookUrl: 'https://',
        authToken: '••••••••••••',
        timeout: '5000',
        eventFilter: 'push,pull_request',
      },
      retryOption: 'էքսպոնենցիալ',
    },
    after: {
      placeholders: {
        webhookUrl: 'https://yourapp.com/hooks/events',
        authToken: '••••••••••••',
        timeout: '5000',
        eventFilter: 'push, pull_request',
      },
      retryOption:
        'էքսպոնենցիալ — յուրաքանչյուր ձախողումից հետո ավելի երկար սպասել',
      tips: {
        webhookUrl:
          'Ու՞ր ուղարկենք իրադարձությունների ծանուցումները։ Տեղադրեք ձեր սերվերի HTTPS էնդփոինթն այստեղ։',
        authToken:
          'Գաղտնի բանալի, որը մենք ներառում ենք յուրաքանչյուր հարցման մեջ, որպեսզի ձեր սերվերը կարողանա ստուգել, որ դա իրականում մենք ենք։ Պահեք այն գաղտնի։',
        retryPolicy:
          'Եթե առաքումը ձախողվի, որքա՞ն ժամանակ սպասել հաջորդ փորձից առաջ։ Էքսպոնենցիալ նշանակում է, որ յուրաքանչյուր հաջորդ փորձը սպասում է կրկնակի երկար։',
        timeout:
          'Որքա՞ն սպասել ձեր սերվերի պատասխանին, մինչ առաքումը նշվի որպես ձախողված։ 5000 = 5 վայրկյան։',
        eventFilter:
          'Ծանուցումներ ուղարկել միայն այս տեսակի իրադարձությունների համար։ Ստորակետերով բաժանված։ Թողեք դատարկ՝ բոլոր իրադարձությունները ստանալու համար։',
      },
      guideLink: 'Չե՞ք համոզված։ Տեսնել կարգավորման ուղեցույցը →',
    },
  },
};

export default content;
