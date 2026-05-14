const content = {
  before: {
    alertIcon: '⚠️',
    heading: 'Pricing Update',
    blunt:
      'Starting March 1, pricing will increase by 15%. See new pricing below.',
    rows: [
      { plan: 'Pro Plan', price: '$28.75/mo' },
      { plan: 'Business Plan', price: '$57.50/mo' },
    ],
    btn: 'View New Pricing',
  },
  after: {
    badge: 'Fairness Commitment',
    heading: 'An Important Update from Our Team',
    body: "To continue investing in security, accessibility, and fair wages for our team, we're adjusting pricing by 15% starting March 1.",
    subtext: "Here's exactly where your money goes:",
    breakdown: [
      { label: 'Infrastructure & Security', pct: '40%' },
      { label: 'Team Fair Wages', pct: '35%' },
      { label: 'Accessibility Improvements', pct: '15%' },
      { label: 'Customer Support', pct: '10%' },
    ],
    btn: 'See New Pricing',
  },
};

export default content;
