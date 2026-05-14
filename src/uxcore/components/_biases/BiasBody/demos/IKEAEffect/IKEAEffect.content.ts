const content = {
  en: {
    before: {
      title: 'Start with a Template',
      sub: "Pick a template and we'll set it up for you.",
      templates: [
        { icon: '🌐', name: 'Business', active: true },
        { icon: '🎨', name: 'Portfolio', active: false },
        { icon: '🛒', name: 'Store', active: false },
      ],
      cta: 'Use This Template',
    },
    after: {
      steps: [
        { status: 'done', marker: '✓', label: 'Colors' },
        { status: 'done', marker: '✓', label: 'Sections' },
        { status: 'active', marker: '3', label: 'Name Site' },
      ],
      label: 'Your site name',
      defaultSiteName: "Maria's Studio",
      previewHero: "Maria's Studio",
      tagline: '🏆 Your custom creation',
      cta: 'Publish My Site',
    },
  },
  ru: {
    before: {
      title: 'Начните с шаблона',
      sub: 'Выберите шаблон, и мы всё настроим за вас.',
      templates: [
        { icon: '🌐', name: 'Бизнес', active: true },
        { icon: '🎨', name: 'Портфолио', active: false },
        { icon: '🛒', name: 'Магазин', active: false },
      ],
      cta: 'Использовать этот шаблон',
    },
    after: {
      steps: [
        { status: 'done', marker: '✓', label: 'Цвета' },
        { status: 'done', marker: '✓', label: 'Разделы' },
        { status: 'active', marker: '3', label: 'Название' },
      ],
      label: 'Название вашего сайта',
      defaultSiteName: 'Студия Марии',
      previewHero: 'Студия Марии',
      tagline: '🏆 Ваше уникальное творение',
      cta: 'Опубликовать мой сайт',
    },
  },
  hy: {
    before: {
      title: 'Սկսեք ձևանմուշից',
      sub: 'Ընտրեք ձևանմուշ, և մենք այն կկարգավորենք ձեզ համար։',
      templates: [
        { icon: '🌐', name: 'Բիզնես', active: true },
        { icon: '🎨', name: 'Պորտֆոլիո', active: false },
        { icon: '🛒', name: 'Խանութ', active: false },
      ],
      cta: 'Օգտագործել այս ձևանմուշը',
    },
    after: {
      steps: [
        { status: 'done', marker: '✓', label: 'Գույներ' },
        { status: 'done', marker: '✓', label: 'Բաժիններ' },
        { status: 'active', marker: '3', label: 'Անվանում' },
      ],
      label: 'Ձեր կայքի անվանումը',
      defaultSiteName: 'Մարիայի ստուդիա',
      previewHero: 'Մարիայի ստուդիա',
      tagline: '🏆 Ձեր անհատական ստեղծագործությունը',
      cta: 'Հրապարակել իմ կայքը',
    },
  },
};

export default content;
