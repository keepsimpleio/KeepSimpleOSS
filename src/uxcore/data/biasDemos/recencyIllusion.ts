const content = {
  mainTitle: 'Reports',
  before: {
    sidebar: [
      { label: 'Dashboard', active: false },
      { label: 'Projects', active: false },
      { label: 'Reports', active: true },
      { label: 'Advanced Filters', active: false },
      { label: 'Settings', active: false },
    ],
  },
  after: {
    newBadge: 'NEW',
    spotlightTitle: 'Smart Filters — AI powered',
    spotlightSub: 'Just launched · Read the blog post',
    tryBtn: 'Try it',
    sidebar: [
      { label: 'Dashboard', active: false, highlight: false },
      { label: 'Projects', active: false, highlight: false },
      { label: 'Reports', active: true, highlight: false },
      { label: 'Smart Filters', active: false, highlight: true },
      { label: 'Settings', active: false, highlight: false },
    ],
    highlightBadge: 'NEW',
  },
};

export default content;
