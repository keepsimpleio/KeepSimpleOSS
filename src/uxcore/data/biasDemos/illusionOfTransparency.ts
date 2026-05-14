const content = {
  title: 'API Configuration',
  labels: {
    webhookUrl: 'Webhook URL',
    authToken: 'Auth Token',
    retryPolicy: 'Retry Policy',
    timeout: 'Timeout (ms)',
    eventFilter: 'Event Filter',
  },
  cta: 'Save Configuration',
  helpTrigger: '?',
  before: {
    placeholders: {
      webhookUrl: 'https://',
      authToken: '••••••••••••',
      timeout: '5000',
      eventFilter: 'push,pull_request',
    },
    retryOption: 'exponential',
  },
  after: {
    placeholders: {
      webhookUrl: 'https://yourapp.com/hooks/events',
      authToken: '••••••••••••',
      timeout: '5000',
      eventFilter: 'push, pull_request',
    },
    retryOption: 'exponential — wait longer after each failure',
    tips: {
      webhookUrl:
        "Where should we send event notifications? Paste your server's HTTPS endpoint here.",
      authToken:
        "A secret key we include in every request so your server can verify it's really us. Keep this private.",
      retryPolicy:
        'If delivery fails, how long to wait before trying again. Exponential means each retry waits twice as long.',
      timeout:
        'How long to wait for your server to respond before marking the delivery as failed. 5000 = 5 seconds.',
      eventFilter:
        'Only send notifications for these event types. Comma-separated. Leave blank to receive all events.',
    },
    guideLink: 'Not sure? See the setup guide →',
  },
};

export default content;
