const content = {
  before: {
    pageTitle: 'Security Settings',
    settings: [
      { label: 'Change Password', action: 'Update', type: 'button' as const },
      { label: 'Two-Factor Authentication', type: 'toggle' as const },
      { label: 'Active Sessions', action: 'View', type: 'button' as const },
    ],
  },
  after: {
    statusIcon: '✅',
    statusTitle: 'Your Security Status: Protected',
    statusSub: 'Last verified 2 minutes ago',
    indicators: [
      'End-to-end encryption active',
      '0 data breaches detected',
      'Anonymous ID verified',
      'Security audit: Jan 15, 2026',
    ],
    footerLinks: ['View Transparency Report', 'Security Settings'],
    sep: '·',
  },
};

export default content;
