const content = {
  title: 'Meet the Team',
  before: {
    members: [
      { initials: 'JK', name: 'John Kim', role: 'CTO' },
      { initials: 'MP', name: 'Maria Perez', role: 'Lead Engineer' },
      { initials: 'AW', name: 'Alex Wu', role: 'Designer' },
    ],
  },
  after: {
    members: [
      {
        initials: 'JK',
        name: 'John Kim — CTO',
        bio: 'MIT CS graduate · ex-Google · 3× startup founder · published AI researcher',
      },
      {
        initials: 'MP',
        name: 'Maria Perez — Lead Engineer',
        bio: 'AWS certified · built systems handling 10M+ requests/day · ex-Stripe infra team',
      },
      {
        initials: 'AW',
        name: 'Alex Wu — Designer',
        bio: 'IDEO alumni · 4× Red Dot Award winner · expert in accessibility & design systems',
      },
    ],
  },
};

export default content;
