const content = {
  appIcon: '🧘',
  appName: 'MindfulMe',
  before: {
    schedule: 'Daily at 9:00 AM',
    notifications: [
      { time: '9:00 AM', day: 'Mon', msg: 'Time for your daily check-in!' },
      { time: '9:00 AM', day: 'Tue', msg: 'Time for your daily check-in!' },
      { time: '9:00 AM', day: 'Wed', msg: 'Time for your daily check-in!' },
      { time: '9:00 AM', day: 'Thu', msg: 'Time for your daily check-in!' },
      { time: '9:00 AM', day: 'Fri', msg: 'Time for your daily check-in!' },
    ],
    note: 'Fixed schedule — easy to tune out',
  },
  after: {
    schedule: 'Sent when the moment feels right',
    notifications: [
      {
        gap: 'Now',
        msg: 'This is a good moment to pause for a few mindful breaths.',
      },
      { gap: '+41 hrs', msg: 'Quick check-in: how are you feeling right now?' },
      {
        gap: '+53 hrs',
        msg: "A quiet moment found you. How's your energy today?",
      },
      {
        gap: '+38 hrs',
        msg: 'Something brought you here. Take 60 seconds for yourself.',
      },
      {
        gap: '+49 hrs',
        msg: 'Your mind has been working hard. Ready for a reset?',
      },
    ],
    note: 'Random intervals — feels personally timed',
  },
};

export default content;
