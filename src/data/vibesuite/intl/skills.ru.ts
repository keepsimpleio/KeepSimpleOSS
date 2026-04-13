/** Russian translations for VibeSuite skill & category content, keyed by ID. */

export const categoriesRu: Record<
  string,
  { name: string; description: string }
> = {
  'llm-ai': {
    name: 'LLM и AI-ассистенты',
    description: 'Подключайте AI-мозги к своим проектам',
  },
  'local-ai': {
    name: 'Локальные AI-модели',
    description: 'Запускайте AI на своём компьютере — бесплатно и приватно',
  },
  'image-video': {
    name: 'Генерация изображений и видео',
    description: 'Создавайте визуал с AI — от аватаров до видеоклипов',
  },
  'frontend-ui': {
    name: 'Фронтенд и UI',
    description: 'Создавайте красивые интерфейсы — сайты, дашборды, приложения',
  },
  'backend-db': {
    name: 'Бэкенд и базы данных',
    description: 'Храните данные, пишите серверную логику, создавайте API',
  },
  'auth-security': {
    name: 'Авторизация и безопасность',
    description: 'Вход, регистрация и защита данных пользователей',
  },
  'deploy-infra': {
    name: 'Деплой и инфраструктура',
    description: 'Публикуйте проекты в интернет и настраивайте инфраструктуру',
  },
  payments: {
    name: 'Платежи и монетизация',
    description: 'Принимайте деньги — подписки, разовые платежи, крипто',
  },
  integrations: {
    name: 'Интеграции и сервисы',
    description: 'Подключайте внешние сервисы — боты, email, Google Docs',
  },
  'ai-tools': {
    name: 'AI-инструменты для вайб-кодинга',
    description: 'Освойте инструменты, с которыми вы вайб-кодите',
  },
};

export const skillsRu: Record<
  string,
  {
    id: string;
    name: string;
    projectTitle: string;
    projectDescription: string;
    timeEstimate: string;
  }
> = {
  // ─── LLMs & AI Assistants ───
  'claude-api-chatbot': {
    id: 'claude-api-chatbot',
    name: 'Claude API — чат-бот для сайта',
    projectTitle: 'Создайте AI-чатбот для своего сайта',
    projectDescription:
      'Создайте виджет чата, который отвечает на вопросы посетителей о вашем продукте. Научитесь отправлять запросы к Claude API, писать системные промпты и обрабатывать ответы в реальном времени.',
    timeEstimate: '2–3 часа',
  },
  'openai-api-content': {
    id: 'openai-api-content',
    name: 'OpenAI API — генератор контента',
    projectTitle: 'Создайте генератор постов для соцсетей',
    projectDescription:
      'Введите тему — получите готовые посты для Telegram, Twitter и LinkedIn в разных стилях. Научитесь работать с OpenAI API, промпт-инжинирингом и структурированным выводом.',
    timeEstimate: '2–3 часа',
  },
  'prompt-engineering-advisor': {
    id: 'prompt-engineering-advisor',
    name: 'Промпт-инжиниринг — AI-советник',
    projectTitle:
      'Создайте персонального AI-советника по теме, в которой вы разбираетесь',
    projectDescription:
      'Например, советника по питанию, стилиста или гида по покупке техники. Научитесь chain-of-thought промптингу, few-shot примерам и тому, как заставить AI давать экспертные ответы.',
    timeEstimate: '3–4 часа',
  },
  'streaming-responses': {
    id: 'streaming-responses',
    name: 'Стриминг — ответ AI в реальном времени',
    projectTitle:
      'Добавьте стриминг в чатбот — текст появляется посимвольно, как в ChatGPT',
    projectDescription:
      'Вместо ожидания полного ответа текст выводится в реальном времени. Научитесь Server-Sent Events (SSE), стриминговым API и обработке потоковых данных в UI.',
    timeEstimate: '3–4 часа',
  },
  'claude-in-claude-app': {
    id: 'claude-in-claude-app',
    name: 'AI внутри приложения',
    projectTitle: 'Создайте приложение с AI, работающим внутри',
    projectDescription:
      'Например, текстовый редактор с AI-ассистентом или генератор викторин. Приложение вызывает Claude API изнутри и использует результат для интерактивного UI. Научитесь вложенным API-вызовам и управлению состоянием.',
    timeEstimate: '1 день',
  },
  'rag-chat-documents': {
    id: 'rag-chat-documents',
    name: 'RAG — чат с документами',
    projectTitle:
      'Создайте чатбот, который отвечает на вопросы по загруженным документам',
    projectDescription:
      'Загрузите PDF или текстовый файл — AI прочитает его и ответит на вопросы по содержанию. Научитесь векторным эмбеддингам, чанкингу и поиску по схожести.',
    timeEstimate: '1 день',
  },
  'ai-function-calling': {
    id: 'ai-function-calling',
    name: 'AI Function Calling — вызов функций',
    projectTitle: 'Создайте AI-ассистента, который выполняет реальные действия',
    projectDescription:
      'Вместо простого чата AI может реально действовать. Определите инструменты (функции), которые AI может вызывать, и он сам решит, когда их использовать. Научитесь function calling, определению инструментов и парсингу структурированного вывода.',
    timeEstimate: '3–4 часа',
  },
  'multi-model-routing': {
    id: 'multi-model-routing',
    name: 'Мульти-модельная маршрутизация',
    projectTitle:
      'Создайте AI-хаб, который выбирает лучшую модель для каждой задачи',
    projectDescription:
      'Простые вопросы идут к дешёвой модели, сложные — к мощной. Научитесь работать с несколькими AI-провайдерами одновременно, маршрутизации запросов и оптимизации затрат.',
    timeEstimate: '1–2 дня',
  },

  // ─── Local AI Models ───
  'ollama-local': {
    id: 'ollama-local',
    name: 'Ollama — локальный ChatGPT',
    projectTitle: 'Запустите собственный ChatGPT на своём компьютере',
    projectDescription:
      'Установите Ollama, скачайте модель и создайте веб-интерфейс для общения с ней. Работает офлайн и бесплатно. Научитесь запускать LLM локально и делать к ним API-запросы.',
    timeEstimate: '1–2 часа',
  },
  'local-ai-privacy': {
    id: 'local-ai-privacy',
    name: 'Локальный AI для приватности',
    projectTitle:
      'Создайте приложение для обработки конфиденциальных данных с локальным AI',
    projectDescription:
      'Медицинские заметки, юридические документы, личные дневники — некоторые данные не должны покидать ваш компьютер. Запустите локальную модель для резюмирования, классификации или извлечения информации.',
    timeEstimate: '3–4 часа',
  },
  'local-ai-backend': {
    id: 'local-ai-backend',
    name: 'Локальный AI-бэкенд для проектов',
    projectTitle: 'Подключите проект к локальной модели вместо платного API',
    projectDescription:
      'Замените вызовы Claude/OpenAI API на локальную модель — тот же код, но бесплатно. Научитесь формату API, совместимому с OpenAI, и переключению между локальными и облачными моделями.',
    timeEstimate: '2–3 часа',
  },

  // ─── Image & Video Generation ───
  'replicate-image-gen': {
    id: 'replicate-image-gen',
    name: 'Replicate API — генератор изображений',
    projectTitle: 'Создайте генератор изображений с веб-интерфейсом',
    projectDescription:
      'Введите текстовое описание — получите изображение. Как Midjourney, но встроенный в ваш сайт. Научитесь Replicate API, моделям Flux/SDXL и обработке асинхронных задач.',
    timeEstimate: '2–3 часа',
  },
  'voice-speech': {
    id: 'voice-speech',
    name: 'Голос — распознавание и синтез речи',
    projectTitle: 'Добавьте голосовой ввод и вывод в приложение',
    projectDescription:
      'Пользователи говорят вместо набора текста, а приложение отвечает голосом. Научитесь Whisper API, ElevenLabs или Web Speech API и обработке аудиопотоков.',
    timeEstimate: '2–3 часа',
  },
  'ai-avatars': {
    id: 'ai-avatars',
    name: 'AI-аватары',
    projectTitle: 'Создайте сервис генерации аватаров из фотографий',
    projectDescription:
      'Пользователь загружает фото — получает стилизованный аватар (аниме, пиксель-арт, 3D). Научитесь загрузке изображений, моделям image-to-image и серверной обработке файлов.',
    timeEstimate: '1 день',
  },
  'video-generation': {
    id: 'video-generation',
    name: 'Генерация видео',
    projectTitle: 'Создайте генератор коротких видео из текста',
    projectDescription:
      'Пользователь описывает сцену — получает 4-секундный видеоклип. Научитесь видеомоделям (Runway, Kling, Minimax), длительным асинхронным задачам и отображению прогресса.',
    timeEstimate: '1–2 дня',
  },
  'comfyui-pipeline': {
    id: 'comfyui-pipeline',
    name: 'ComfyUI Pipeline',
    projectTitle:
      'Настройте собственный локальный пайплайн генерации изображений',
    projectDescription:
      'Создайте визуальный пайплайн: txt2img → upscale → стилизация. Всё локально и бесплатно. Научитесь нодам ComfyUI, LoRA-моделям с CivitAI и автоматизации воркфлоу.',
    timeEstimate: '1–2 дня',
  },

  // ─── Frontend & UI ───
  'react-nextjs-portfolio': {
    id: 'react-nextjs-portfolio',
    name: 'React + Next.js — личный сайт',
    projectTitle: 'Создайте свой персональный сайт-портфолио',
    projectDescription:
      'Создайте многостраничный сайт: обо мне, проекты, контакты. Научитесь React-компонентам, маршрутизации Next.js, деплою на Vercel — основа для всего остального.',
    timeEstimate: '3–4 часа',
  },
  'tailwind-styling': {
    id: 'tailwind-styling',
    name: 'Tailwind CSS — стилизация',
    projectTitle: 'Оформите сайт с Tailwind и сделайте его профессиональным',
    projectDescription:
      'Возьмите свой сайт и добавьте профессиональную стилизацию: мобильная адаптивность, тёмная тема, hover-эффекты. Научитесь utility-first подходу к CSS и адаптивному дизайну.',
    timeEstimate: '2–3 часа',
  },
  'shadcn-ui-dashboard': {
    id: 'shadcn-ui-dashboard',
    name: 'shadcn/ui — готовые компоненты',
    projectTitle: 'Соберите дашборд из готовых компонентов за час',
    projectDescription:
      'Используйте библиотеку красивых компонентов (кнопки, модалки, таблицы, графики) и постройте рабочий дашборд. Научитесь компонентному подходу и кастомизации UI-библиотеки.',
    timeEstimate: '2–3 часа',
  },
  'v0-dev-ai-ui': {
    id: 'v0-dev-ai-ui',
    name: 'v0.dev — AI-генерация UI',
    projectTitle: 'Сгенерируйте целую страницу, описав её словами',
    projectDescription:
      'Напишите промпт вроде «лендинг для крипто-портфолио трекера» — получите готовый React-код. Научитесь использовать AI для быстрого прототипирования интерфейсов.',
    timeEstimate: '1 час',
  },
  'framer-motion-animations': {
    id: 'framer-motion-animations',
    name: 'Анимации — Framer Motion',
    projectTitle: 'Добавьте плавные анимации на сайт',
    projectDescription:
      'Эффекты появления элементов, переходы между страницами, параллакс при скролле. Научитесь Framer Motion, spring-анимациям и жестовым взаимодействиям.',
    timeEstimate: '3–4 часа',
  },
  'interactive-visualizations': {
    id: 'interactive-visualizations',
    name: 'Интерактивные визуализации',
    projectTitle: 'Создайте интерактивную карту или визуализацию данных',
    projectDescription:
      'Например, карту с метками на Mapbox или масштабируемый график на D3. Научитесь canvas/SVG, обработке пользовательских жестов и визуальному отображению данных.',
    timeEstimate: '1–2 дня',
  },

  // ─── Backend & Databases ───
  'api-routes-first': {
    id: 'api-routes-first',
    name: 'API Routes — ваш первый API',
    projectTitle: 'Создайте свой первый API-эндпойнт',
    projectDescription:
      'Создайте API, который возвращает данные (например, список проектов в JSON). Любой сайт или приложение может его вызывать. Научитесь HTTP-методам (GET, POST), JSON и серверным функциям Next.js.',
    timeEstimate: '1–2 часа',
  },
  'supabase-crud': {
    id: 'supabase-crud',
    name: 'Supabase — база данных',
    projectTitle: 'Подключите базу данных и создайте CRUD-приложение',
    projectDescription:
      'Создайте приложение для создания, чтения, обновления и удаления записей (например, список задач или заметки). Научитесь SQL, PostgreSQL через Supabase и управлению данными.',
    timeEstimate: '3–4 часа',
  },
  'file-storage-uploads': {
    id: 'file-storage-uploads',
    name: 'Хранилище файлов — загрузка и раздача',
    projectTitle: 'Добавьте загрузку файлов с облачным хранилищем',
    projectDescription:
      'Пользователи загружают изображения, документы или любые файлы — приложение хранит их в облаке и раздаёт обратно. Научитесь multipart-загрузке, pre-signed URL и облачным хранилищам.',
    timeEstimate: '2–3 часа',
  },
  'redis-vercel-kv-cache': {
    id: 'redis-vercel-kv-cache',
    name: 'Redis / Vercel KV — быстрый кэш',
    projectTitle: 'Добавьте кэширование и ускорьте сайт в 10 раз',
    projectDescription:
      'Сохраняйте частые запросы в Redis, чтобы не обращаться к базе каждый раз. Научитесь key-value хранилищам, TTL и стратегиям кэширования.',
    timeEstimate: '2–3 часа',
  },
  'neon-serverless-pg': {
    id: 'neon-serverless-pg',
    name: 'Neon — бессерверный PostgreSQL',
    projectTitle: 'Подключите PostgreSQL, который масштабируется автоматически',
    projectDescription:
      'Альтернатива Supabase для тех, кто хочет больше контроля. Neon включается и выключается автоматически — платите только за использование. Научитесь прямой работе с PostgreSQL и ORM (Prisma/Drizzle).',
    timeEstimate: '3–4 часа',
  },
  'webhooks-events': {
    id: 'webhooks-events',
    name: 'Вебхуки — реакции на события',
    projectTitle: 'Создайте систему, которая реагирует на внешние события',
    projectDescription:
      'Например: пришла оплата в Stripe → отправить email. Или: обновился документ в Notion → перестроить сайт. Научитесь обработчикам вебхуков, проверке подписей и событийной архитектуре.',
    timeEstimate: '3–4 часа',
  },
  'cron-scheduled-tasks': {
    id: 'cron-scheduled-tasks',
    name: 'Cron Jobs — задачи по расписанию',
    projectTitle: 'Создайте автоматические фоновые задачи по расписанию',
    projectDescription:
      'Отправляйте еженедельный дайджест, очищайте старые данные каждую ночь или проверяйте API каждый час — без нажатия кнопки. Научитесь Vercel Cron, GitHub Actions по расписанию и написанию надёжных фоновых задач.',
    timeEstimate: '2–3 часа',
  },

  // ─── Auth & Security ───
  'nextauth-google-login': {
    id: 'nextauth-google-login',
    name: 'NextAuth — вход на сайт',
    projectTitle: 'Добавьте кнопку «Войти через Google» на сайт',
    projectDescription:
      'Пользователи входят через аккаунт Google в один клик. Научитесь NextAuth.js, OAuth-провайдерам, сессиям и защищённым маршрутам.',
    timeEstimate: '2–3 часа',
  },
  'magic-link-auth': {
    id: 'magic-link-auth',
    name: 'Magic Link — вход без пароля',
    projectTitle:
      'Создайте вход без пароля — пользователь получает ссылку на email',
    projectDescription:
      'Как в Notion или Slack: введите email, получите ссылку, нажмите — вы вошли. Без паролей. Научитесь Resend для отправки писем, потоку magic link и токенам.',
    timeEstimate: '3–4 часа',
  },
  'api-keys-rate-limits': {
    id: 'api-keys-rate-limits',
    name: 'API-ключи и лимиты запросов',
    projectTitle: 'Защитите API: ключи доступа и ограничение запросов',
    projectDescription:
      'Создайте систему API-ключей для проекта и добавьте ограничение частоты запросов (максимум 100 в минуту). Научитесь аутентификации API, middleware и защите от спама.',
    timeEstimate: '3–4 часа',
  },
  'row-level-security': {
    id: 'row-level-security',
    name: 'Row Level Security',
    projectTitle: 'Убедитесь, что каждый пользователь видит только свои данные',
    projectDescription:
      'Даже если кто-то получит доступ к API — он увидит только свои данные. Научитесь RLS-политикам в PostgreSQL/Supabase и принципу минимальных привилегий.',
    timeEstimate: '2–3 часа',
  },

  // ─── Deploy & Infrastructure ───
  'vercel-first-deploy': {
    id: 'vercel-first-deploy',
    name: 'Vercel — первый деплой',
    projectTitle: 'Опубликуйте сайт в интернете за 5 минут',
    projectDescription:
      'Подключите GitHub-репозиторий к Vercel и получите рабочий URL. Каждый git push = автоматический деплой. Научитесь CI/CD, переменным окружения и привязке домена.',
    timeEstimate: '30 мин',
  },
  'netlify-static': {
    id: 'netlify-static',
    name: 'Netlify — статические сайты',
    projectTitle: 'Задеплойте статический сайт (HTML/CSS/JS) на Netlify',
    projectDescription:
      'Для простых проектов без бэкенда. Drag & drop или через Git. Научитесь разнице между статическим и динамическим хостингом, формам и редиректам.',
    timeEstimate: '30 мин',
  },
  'analytics-know-users': {
    id: 'analytics-know-users',
    name: 'Аналитика — знайте своих пользователей',
    projectTitle:
      'Добавьте аналитику, чтобы видеть, кто и как пользуется продуктом',
    projectDescription:
      'Узнайте, сколько у вас посетителей, какие страницы они смотрят и где уходят — без навязчивого трекинга. Научитесь приватной аналитике и принятию решений на основе данных.',
    timeEstimate: '1 час',
  },
  'github-actions-cicd': {
    id: 'github-actions-cicd',
    name: 'GitHub Actions — автоматизация',
    projectTitle: 'Настройте автоматические тесты и деплой при каждом коммите',
    projectDescription:
      'Напишите воркфлоу: при пуше в main — запустить проверки, если всё ок — задеплоить. Научитесь CI/CD-пайплайнам, YAML-конфигам и автоматизации рутины.',
    timeEstimate: '2–3 часа',
  },
  'cloudflare-domain-cdn': {
    id: 'cloudflare-domain-cdn',
    name: 'Cloudflare — домен и CDN',
    projectTitle: 'Подключите домен и ускорьте сайт через Cloudflare',
    projectDescription:
      'Купите домен, настройте DNS, включите CDN и SSL. Научитесь работе DNS, что такое CDN и как защитить сайт от DDoS.',
    timeEstimate: '1 час',
  },

  // ─── Payments & Monetization ───
  'stripe-payments': {
    id: 'stripe-payments',
    name: 'Stripe — приём платежей',
    projectTitle: 'Добавьте кнопку «Купить» на сайт',
    projectDescription:
      'Пользователь нажимает, вводит данные карты, деньги приходят на ваш счёт. Научитесь Stripe Checkout, обработке вебхуков и тестовым платежам.',
    timeEstimate: '3–4 часа',
  },
  'coinbase-crypto': {
    id: 'coinbase-crypto',
    name: 'Coinbase Commerce — крипто-платежи',
    projectTitle: 'Добавьте оплату криптовалютой на сайт',
    projectDescription:
      'Принимайте Bitcoin, Ethereum и стейблкоины. Научитесь Coinbase Commerce API, генерации платёжных ссылок и верификации транзакций.',
    timeEstimate: '3–4 часа',
  },
  subscriptions: {
    id: 'subscriptions',
    name: 'Подписки',
    projectTitle: 'Создайте модель подписки: Free, Pro, Enterprise',
    projectDescription:
      'Пользователи покупают подписку — получают доступ к премиум-функциям. Научитесь Stripe Subscriptions, управлению тарифами, даунгрейду/апгрейду и отмене.',
    timeEstimate: '1–2 дня',
  },
  'prepaid-credits': {
    id: 'prepaid-credits',
    name: 'Предоплаченные кредиты',
    projectTitle:
      'Создайте систему предоплаченных кредитов (как у ChatGPT API)',
    projectDescription:
      'Пользователь покупает пакет кредитов, каждый запрос стоит кредит. Научитесь логике биллинга, балансам, ценообразованию и пользовательскому дашборду.',
    timeEstimate: '1–2 дня',
  },

  // ─── Integrations & Services ───
  'telegram-bot': {
    id: 'telegram-bot',
    name: 'Telegram-бот',
    projectTitle: 'Создайте Telegram-бот, который делает что-то полезное',
    projectDescription:
      'Например, бот-напоминалку, бот для заметок или AI-бот. Научитесь Telegram Bot API, обработке сообщений, инлайн-кнопкам и деплою бота на сервер.',
    timeEstimate: '2–3 часа',
  },
  'email-resend': {
    id: 'email-resend',
    name: 'Email — транзакционные письма',
    projectTitle: 'Отправляйте красивые письма из приложения',
    projectDescription:
      'Welcome-письма, уведомления, сброс пароля — всё автоматически. Научитесь Resend API, React Email для шаблонов и триггерам отправки.',
    timeEstimate: '1–2 часа',
  },
  'google-sheets-api': {
    id: 'google-sheets-api',
    name: 'Google APIs',
    projectTitle:
      'Подключите Google Sheets как базу данных для простого проекта',
    projectDescription:
      'Читайте и записывайте данные прямо из Google Sheets. Отлично для MVP и прототипов. Научитесь Google API, сервисным аккаунтам и авторизации.',
    timeEstimate: '2–3 часа',
  },
  'notion-api': {
    id: 'notion-api',
    name: 'Notion API',
    projectTitle: 'Создайте сайт, контент которого берётся из Notion',
    projectDescription:
      'Пишите в Notion — сайт обновляется автоматически. Идеально для блогов или документации. Научитесь Notion API, маппингу блоков Notion в HTML и ISR.',
    timeEstimate: '3–4 часа',
  },

  // ─── AI Tools for Vibe Coding ───
  'claude-code-tool': {
    id: 'claude-code-tool',
    name: 'Claude Code',
    projectTitle: 'Создайте целый проект одним промптом в терминале',
    projectDescription:
      'Введите задачу в CLI — Claude Code создаст файлы, установит зависимости, напишет код. Научитесь агентному кодингу, формулированию задач для AI и терминальному воркфлоу.',
    timeEstimate: '1 час',
  },
  'cursor-windsurf': {
    id: 'cursor-windsurf',
    name: 'Cursor / Windsurf',
    projectTitle: 'Пишите код с AI-ассистентом прямо в редакторе',
    projectDescription:
      'AI видит весь проект и предлагает код, исправления, рефакторинг в контексте. Научитесь AI-ассистированной разработке, контекстному редактированию и когда доверять AI, а когда нет.',
    timeEstimate: '1–2 часа',
  },
  'claude-projects': {
    id: 'claude-projects',
    name: 'Claude Projects — контекст AI',
    projectTitle: 'Настройте Claude так, чтобы он идеально знал ваш проект',
    projectDescription:
      'Загрузите документацию, стайл-гайды и примеры в Claude Project — и AI будет отвечать в контексте ВАШЕГО проекта. Научитесь системным промптам, управлению знаниями и оптимизации промптов.',
    timeEstimate: '1 час',
  },
  'mcp-servers': {
    id: 'mcp-servers',
    name: 'MCP-серверы',
    projectTitle: 'Подключите Claude к вашим данным через MCP',
    projectDescription:
      'Claude может читать ваш Google Drive, Slack, базу данных — и отвечать на основе реальных данных. Научитесь Model Context Protocol, настройке MCP-сервера и интеграции AI с внешними сервисами.',
    timeEstimate: '2–3 часа',
  },
  'vibe-coding-method': {
    id: 'vibe-coding-method',
    name: 'Вайб-кодинг как метод',
    projectTitle: 'От идеи до задеплоенного продукта за один день',
    projectDescription:
      'Возьмите идею, опишите её AI, сгенерируйте код, отполируйте и задеплойте. Полный цикл. Научитесь комбинировать все инструменты: промпт → Claude Code → Vercel — и выпускать рабочий продукт.',
    timeEstimate: '1 день',
  },
};
