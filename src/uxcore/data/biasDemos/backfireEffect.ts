const content = {
  chatHeader: 'Support Chat',
  userMessage: 'I was charged twice for my subscription this month!',
  before: {
    agentReply:
      'Our records show you were charged correctly. Here is the invoice proving the charge is valid. The Terms of Service section 4.2 states that charges are non-refundable.',
    attachments: ['📄 Invoice_March.pdf', '📄 ToS_section4.2.pdf'],
    followUp: 'Is there anything else I can help you with?',
  },
  after: {
    agentReply:
      'I understand this charge was unexpected — that would concern me too. Let me walk through your account activity with you so we can figure out exactly what happened together.',
    activity: [
      { label: 'Mar 1 — Renewal', amount: '$29.00' },
      { label: 'Mar 1 — Plan upgrade', amount: '$10.00' },
    ],
    followUp:
      "Does that match what you saw? If anything looks off, we'll fix it right away.",
  },
};

export default content;
