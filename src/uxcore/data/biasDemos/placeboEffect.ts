const content = {
  title: 'Connection Status',
  statusBanner: 'Slowdown detected in your area',
  before: {
    body: "We're aware of intermittent slowdowns affecting your neighborhood. Our engineers are monitoring the situation. No action needed on your end.",
    speedValue: '12',
    speedUnit: 'Mbps',
  },
  after: {
    body: 'Run the Network Optimizer to clear cached routes and improve your connection.',
    optimizeBtn: 'Run Network Optimizer',
    steps: [
      { label: 'Scanning routes...', state: 'done' as const },
      { label: 'Optimizing DNS...', state: 'done' as const },
      { label: 'Clearing cache...', state: 'active' as const },
    ],
    result: 'Speed improved by 12%',
  },
};

export default content;
