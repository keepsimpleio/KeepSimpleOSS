const content = {
  title: 'System Update Available',
  body: 'This update will migrate your database to the new schema.',
  primaryBtn: 'Update Now',
  before: {
    iconWarning: '!',
    riskLabel: 'Risk:',
    riskValue: '1% chance of data loss during migration',
    sub: 'Back up your data before proceeding.',
    secondaryBtn: 'Back Up First',
    label: 'Negative frame — triggers anxiety',
  },
  after: {
    iconSuccess: '✓',
    successLabel: 'Safety:',
    successValue: '99% probability the operation succeeds',
    sub: 'Automatic backup runs before migration starts.',
    secondaryBtn: 'View Details',
    label: 'Positive frame — same odds, more confidence',
  },
};

export default content;
