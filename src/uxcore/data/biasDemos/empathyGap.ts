const content = {
  header: 'Support Bot',
  userMessage:
    "This is ridiculous! My payment failed AGAIN and now I can't access my account. I have a deadline in 20 minutes!",
  before: {
    botMessage:
      'Please calm down and describe the issue clearly so we can assist you. Make sure to include your account ID and the error code shown.',
    accountIdPlaceholder: 'Account ID',
    errorCodePlaceholder: 'Error code',
  },
  after: {
    botMessage:
      "We understand how stressful this is, especially with a deadline coming up. Let's fix this together right now.",
    actionLabel: "What's happening?",
    actions: ['Payment declined', "Can't log in", 'Something else'],
  },
};

export default content;
