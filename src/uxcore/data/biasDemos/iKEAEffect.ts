const content = {
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
};

export default content;
