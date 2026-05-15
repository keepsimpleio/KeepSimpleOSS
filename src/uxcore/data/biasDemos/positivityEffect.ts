const content = {
  title: 'Comments',
  comments: [
    {
      user: 'Maya L.',
      text: 'This is a really clean approach to the problem!',
      time: '10m ago',
    },
    {
      user: 'Chris W.',
      text: 'Agreed — I tried something similar last quarter.',
      time: '25m ago',
    },
    {
      user: 'Priya N.',
      text: 'Love the simplicity here. Worth exploring further.',
      time: '1h ago',
    },
  ],
  before: {
    replyLabel: 'Reply',
  },
  after: {
    reactions: [
      { emoji: '\u{1F44F}', label: 'Clap' },
      { emoji: '❤️', label: 'Love' },
      { emoji: '\u{1F525}', label: 'Fire' },
      { emoji: '\u{1F680}', label: 'Rocket' },
    ],
    replyLabel: 'Reply',
  },
};

export default content;
