const content = {
  title: 'Set Up Your Workspace',
  cta: 'Continue',
  before: {
    steps: [
      { n: 1, label: 'Invite team' },
      { n: 2, label: 'Set your role' },
      { n: 3, label: 'Name your project' },
      { n: 4, label: 'Connect integrations' },
    ],
    currentLabel: 'Step 1: Invite team',
    inputPlaceholder: 'teammate@company.com',
  },
  after: {
    steps: [
      { n: 1, label: 'Name your project' },
      { n: 2, label: 'Set your role' },
      { n: 3, label: 'Invite team' },
      { n: 4, label: 'Connect integrations' },
    ],
    progressLabel: 'Step 1 of 4',
    nowLabel: 'Now',
    currentLabel: 'Step 1: Name your project',
    inputPlaceholder: 'e.g. Q3 Launch',
  },
};

export default content;
