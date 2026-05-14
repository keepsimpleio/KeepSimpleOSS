const content = {
  before: {
    heading: 'Are you sure?',
    body: 'This action cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Yes, Delete',
  },
  after: {
    heading: 'Delete this project?',
    impact: [
      { num: '847', label: 'files will be permanently deleted' },
      { num: '23', label: 'collaborators will lose access' },
      { num: '18 mo', label: 'of version history will be erased' },
    ],
    confirmLabelPrefix: 'Type',
    confirmLabelSuffix: 'to confirm:',
    confirmWord: 'DELETE',
    inputPlaceholder: 'DELETE',
    cancel: 'Cancel',
    confirm: 'Delete Project',
  },
};

export default content;
