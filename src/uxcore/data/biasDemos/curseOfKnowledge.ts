const content = {
  before: {
    title: 'Configure Your Pipeline',
    sub: 'Set up your CI/CD pipeline using YAML configuration.',
    code: [
      { key: 'build_triggers:', val: '', indent: false },
      { key: 'on_push:', val: 'main', indent: true },
      { key: 'deployment_target:', val: 'prod-cluster', indent: true },
      { key: 'artifact_registry:', val: 'gcr.io/myapp', indent: true },
    ],
    jargon:
      'Configure build triggers, deployment targets, and artifact registry endpoints.',
    cta: 'Deploy Pipeline',
  },
  after: {
    title: 'What do you want to automate?',
    sub: "Pick what matters to you — we'll handle the setup.",
    options: [
      {
        title: 'Test my code',
        desc: 'Run checks on every change',
        selected: true,
      },
      {
        title: 'Deploy to production',
        desc: 'Publish when tests pass',
        selected: false,
      },
      { title: 'Both', desc: 'Full test-and-deploy flow', selected: false },
    ],
    cta: 'Continue',
  },
};

export default content;
