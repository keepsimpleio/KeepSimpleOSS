const content = {
  title: 'Data Workspace',
  staticTools: ['Filter', 'Sort', 'View'],
  files: [
    { name: 'Q1 Sales Report.csv', size: '4.2 MB' },
    { name: 'Customer List.csv', size: '1.8 MB' },
    { name: 'Invoice Data.csv', size: '2.1 MB' },
  ],
  before: {
    toolsTrigger: 'Tools ▾',
    dropdown: ['Export', 'Import', 'Merge', 'Archive'],
    note: '97% of clicks go to "Export" buried in Tools menu.',
  },
  after: {
    exportBtn: '↑ Export',
    toolsTrigger: 'Power Tools ▾',
    dropdown: [
      { icon: '⬇', label: 'Import' },
      { icon: '⊕', label: 'Merge' },
      { icon: '📦', label: 'Archive' },
    ],
    note: 'Export promoted; other tools discoverable in Power Tools.',
  },
};

export default content;
