const content = {
  sectionLabel: 'Code Review — auth.ts',
  aiSuggestion: 'Suggestion: Refactor this function to reduce nesting depth.',
  humanComments: [
    {
      author: 'Marcus R.',
      line: 'line 42',
      body: 'This function is hard to follow — consider early returns.',
    },
    {
      author: 'Priya K.',
      line: 'line 55',
      body: 'Missing null check before accessing user.profile.',
    },
  ],
  before: {
    aiAuthor: 'AI Assistant',
    aiLine: 'line 42',
  },
  after: {
    aiLabel: 'AI Verified',
    confidence: '98.7% confidence',
    footer: 'Analyzed 1,204 similar patterns · Auto-apply available',
  },
};

export default content;
