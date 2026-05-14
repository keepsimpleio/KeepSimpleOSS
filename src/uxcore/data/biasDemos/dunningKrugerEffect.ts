const content = {
  title: 'Contacts',
  tableHeaders: ['Name', 'Email', 'Status'],
  rows: [
    { name: 'Acme Corp', email: 'acme@ex.com', status: 'Active', muted: false },
    { name: 'Globex', email: 'g@ex.com', status: 'Active', muted: false },
    { name: 'Initech', email: 'i@ex.com', status: 'Inactive', muted: true },
  ],
  before: {
    exportLabel: 'Export CSV',
    importLabel: 'Import CSV',
    hint: 'Edited in Excel, re-imported daily',
  },
  after: {
    tooltipTitle: 'Did you know?',
    tooltipBody:
      'You can bulk-edit contacts directly — no CSV needed. Saves ~20 min/day.',
    tooltipLink: 'See how →',
  },
};

export default content;
