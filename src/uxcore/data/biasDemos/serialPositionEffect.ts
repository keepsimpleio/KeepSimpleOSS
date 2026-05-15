const content = {
  version: 'v4.2.0 Release Notes',
  date: 'March 2024',
  before: {
    notes: [
      { text: 'Fixed: 12 bug fixes across the platform', bad: false },
      { text: 'Added: New dashboard widgets', bad: false },
      { text: 'Pricing: Plans increase 15% on April 1', bad: true },
      { text: 'Added: Dark mode support', bad: false },
      { text: 'Improved: API response times by 40%', bad: false },
      { text: 'Updated: Documentation refresh', bad: false },
    ],
  },
  after: {
    notes: [
      { text: 'Added: Dark mode — the most requested feature!', good: true },
      { text: 'Improved: API response times by 40%', good: true },
      {
        text: 'Pricing: Plans adjust 15% on April 1 (details below)',
        good: false,
      },
      { text: 'Fixed: 12 bug fixes across the platform', good: false },
      { text: 'Updated: Documentation refresh', good: false },
      { text: 'Added: New dashboard widgets (try them now!)', good: true },
    ],
  },
};

export default content;
