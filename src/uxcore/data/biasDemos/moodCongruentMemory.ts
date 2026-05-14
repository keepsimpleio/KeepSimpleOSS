const content = {
  greeting: 'Hi Alex,',
  before: {
    from: 'billing@app.io',
    subject: 'Your annual plan expires in 3 days',
    bodyLead: 'Your annual plan expires on',
    bodyDate: 'March 26',
    bodyTail: '. To avoid service interruption, please renew now.',
    price: '$199 / year',
    priceSub: 'Billed annually',
    btn: 'Renew Now',
    footer: 'Need help? Reply to this email.',
    label: 'Sent on schedule — user just filed a frustration ticket',
  },
  after: {
    from: 'support@app.io',
    subject: 'The sync issue you reported — fixed',
    resolvedBanner: 'Sync issue resolved — everything is running smoothly now.',
    body: 'We pushed a fix for the issue you reported last week. Your data is fully synced and no action is needed on your end.',
    byTheWay:
      'By the way, your annual plan renews next week. Let us know if you have questions before then.',
    btn: 'View My Plan',
    label: 'Delayed — resolution first, renewal request after mood lifts',
  },
};

export default content;
