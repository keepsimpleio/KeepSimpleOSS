const content = {
  before: {
    incidentIcon: '!',
    incidentTitle: 'Incident Resolved',
    incidentTime: 'Resolved Oct 14 at 14:23 UTC',
    uptimeLabel: '30-day uptime',
    uptimeValue: '99.97%',
    affectedLabel: 'Affected service',
    affectedValue: 'API Gateway',
    durationLabel: 'Duration',
    durationValue: '4 hours 12 minutes',
    label: '"Incident" framing stays top of mind despite good uptime',
  },
  after: {
    maintenanceIcon: '✓',
    maintenanceTitle: 'Maintenance Complete',
    maintenanceTime: 'Oct 14 at 14:23 UTC',
    safetyBanner: 'Your data is safe — no records affected',
    improvTitle: 'What we improved:',
    improvements: [
      'API failover response time cut from 12s to 800ms',
      'Added redundant gateway in EU-West region',
      'Uptime SLA raised from 99.9% to 99.95%',
    ],
    label: 'Safety-first framing neutralizes the negative weight',
  },
};

export default content;
