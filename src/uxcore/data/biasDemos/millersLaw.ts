const content = {
  sidebarTitle: 'Settings',
  before: {
    links: [
      'Profile',
      'Password',
      'Email',
      'Notifications',
      'API Keys',
      'Webhooks',
      'OAuth Apps',
      'Integrations',
      'Billing',
      'Invoices',
      'Usage',
      'Upgrade Plan',
      'Team Members',
      'Roles',
      'Audit Log',
      'SSO',
    ],
  },
  after: {
    grouped: [
      {
        section: 'Account',
        items: ['Profile', 'Password', 'Email', 'Notifications'],
      },
      {
        section: 'Developer',
        items: ['API Keys', 'Webhooks', 'OAuth Apps', 'Integrations'],
      },
      {
        section: 'Billing',
        items: ['Billing', 'Invoices', 'Usage', 'Upgrade Plan'],
      },
      {
        section: 'Organization',
        items: ['Team Members', 'Roles', 'Audit Log', 'SSO'],
      },
    ],
  },
};

export default content;
