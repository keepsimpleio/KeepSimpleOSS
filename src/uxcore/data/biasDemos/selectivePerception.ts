const content = {
  title: 'Document Editor',
  placeholder: 'Start typing your document...',
  before: {
    tools: [
      { label: '⊞', title: 'Insert Table' },
      { label: 'A', title: 'Font Color' },
    ],
    alignTools: [
      { label: '≡', title: 'Align Left' },
      { label: '≡', title: 'Align Center' },
    ],
    more: 'More ▾',
    hint: 'Bold / Italic / Underline → click "More"',
  },
  after: {
    alignTools: [
      { label: '≡', title: 'Align Left' },
      { label: '≡', title: 'Align Center' },
    ],
    bulletLabel: '• ≡',
    bulletTitle: 'Bullet list',
    more: 'Advanced ▾',
    hint: 'Standard layout — Bold, Italic, Underline always visible',
    boldTitle: 'Bold',
    italicTitle: 'Italic',
    underlineTitle: 'Underline',
  },
};

export default content;
