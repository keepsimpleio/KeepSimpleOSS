const content = {
  before: {
    icon: '💾',
    title: 'Backup Reminder',
    bodyStart:
      'The probability of permanent data loss for any given device is approximately',
    bodyStat: '0.01%',
    bodyEnd: 'per year.',
    bodySecond:
      'We recommend backing up your data regularly to minimize this risk.',
    cta: 'Enable Auto-Backup',
  },
  after: {
    alertIcon: '⚠️',
    alertTitle: 'Your data is at risk',
    daysNum: '571',
    daysLabel: 'days since your last backup',
    compRows: [
      { label: 'Most users back up every', value: '30 days', red: false },
      { label: 'You last backed up', value: '571 days ago', red: true },
    ],
    cta: 'Back Up Now',
  },
};

export default content;
