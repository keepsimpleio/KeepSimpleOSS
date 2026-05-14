const content = {
  status: 'Resolved',
  duration: 'Duration: 2h 14m',
  title: 'Incident #2241 — Postmortem',
  before: {
    sections: [
      {
        label: 'Root Cause',
        body: 'Database connection pool exhaustion caused cascading failures across the API tier. All services restored at 14:22 UTC.',
      },
      {
        label: 'Impact',
        body: '~4,200 users affected. 99.3% uptime maintained for the month.',
      },
    ],
  },
  after: {
    timelineLabel: 'Pre-incident signals (hindsight view)',
    events: [
      {
        time: '11:02',
        msg: 'Latency p99 +12ms — within normal range',
        ambiguous: true,
      },
      {
        time: '11:47',
        msg: 'DB pool utilization 68% — not alerting',
        ambiguous: true,
      },
      {
        time: '12:09',
        msg: 'API error rate 0.4% — below threshold',
        ambiguous: true,
      },
      { time: '12:23', msg: 'Outage begins', ambiguous: false },
    ],
    tlNote: 'At the time, none of these signals exceeded warning thresholds.',
    addingLabel: "What we're adding",
    addingList: [
      'Composite alert: latency + pool utilization together',
      'Auto-scaling trigger at 60% pool capacity',
    ],
  },
};

export default content;
