const content = {
  header: 'Financial Dashboard',
  before: {
    metrics: [
      {
        label: 'Credit Utilization',
        value: '78%',
        sub: 'Recommended: below 30%',
      },
      {
        label: 'Monthly Budget',
        value: '+$340 over',
        sub: 'Budget: $2,000 / Spent: $2,340',
      },
    ],
    alertText: 'Budget overage alert — 3rd month in a row',
  },
  after: {
    metrics: [
      {
        label: 'Credit Status',
        value: 'On Track',
        link: 'View credit details ›',
      },
      {
        label: 'Spending',
        value: 'Optimization Opportunity',
        link: 'See breakdown ›',
      },
    ],
    softTitle: 'Monthly Insights Ready',
    softSub: 'A few areas where small tweaks could help.',
  },
};

export default content;
