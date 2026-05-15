const content = {
  services: ['API', 'Dashboard', 'Webhooks', 'CDN'],
  before: {
    bannerTitle: 'Major Outage',
    bannerSub: 'API services degraded — started Oct 14, 09:42 UTC',
    sectionTitle: 'Incident History',
    incidents: [
      { badge: 'RESOLVED', name: 'Oct 14 — API Outage (4h 12m)' },
      { badge: 'RESOLVED', name: 'Sep 2 — Slow Response Times' },
    ],
  },
  after: {
    operationalTitle: 'All Systems Operational',
    operationalSub: 'Last checked 30 seconds ago',
    improvTitle: 'Recent Reliability Improvements',
    improvIcon: '+',
    improvements: [
      'Redundant API failover added (Oct 16)',
      'Real-time alerting threshold reduced 40%',
      'Uptime SLA upgraded to 99.95%',
    ],
    historyLink: 'View past incidents →',
  },
};

export default content;
