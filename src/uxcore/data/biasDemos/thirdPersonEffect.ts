const content = {
  before: {
    from: 'marketing@saas.io',
    subject: "AMAZING deal inside — Don't miss out!",
    heroBanner: 'AMAZING DEAL!',
    hype: "Don't miss out! Everyone is switching to Pro. This is the BEST offer we've ever made!",
    dealLabel: 'LIMITED TIME',
    dealPrice: '50% OFF PRO',
    cta: 'CLAIM YOUR DEAL NOW',
    urgency: 'Offer expires in 2 hours!',
    label: 'Overt marketing — power users disengage immediately',
  },
  after: {
    from: 'product@saas.io',
    subject: 'What changed in v4.2 and how it affects your workflow',
    greeting: 'Hi Alex,',
    intro:
      "We shipped v4.2 last week. Here's what's relevant to how you use the product.",
    changes: [
      {
        title: 'Batch export is now 4x faster',
        sub: 'Based on your usage, this saves ~8 min on your weekly exports.',
      },
      {
        title: 'API rate limits doubled',
        sub: "Your integrations were hitting limits on Tuesdays — that's resolved.",
      },
    ],
    stats: [
      { num: '847', label: 'exports last month' },
      { num: '12', label: 'API calls/day' },
    ],
    cta: 'See Full Changelog',
    label: 'Informational + data-driven — bypasses skepticism',
  },
};

export default content;
