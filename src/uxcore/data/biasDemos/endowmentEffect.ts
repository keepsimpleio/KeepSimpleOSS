const content = {
  icon: '↺',
  before: {
    title: 'Dashboard Layout Updated',
    body: 'A new layout has been applied to your dashboard. Your previous layout has been removed.',
    cta: 'Got it',
  },
  after: {
    title: 'Layout Update Available',
    body: "We noticed you've built a custom setup — we'd hate to overwrite it without asking.",
    customItems: [
      { icon: '⊚', label: '4 custom widgets arranged' },
      { icon: '⚯', label: '2 saved filters' },
      { icon: '✖', label: 'Custom dark theme applied' },
    ],
    preview: 'Preview new layout before switching',
    keep: 'Keep My Layout',
    switch: 'Preview & Switch',
  },
};

export default content;
