const content = {
  before: {
    errorCode: '404',
    title: 'Page Not Found',
    body: 'The page you requested could not be found on this server. Please check the URL or return to the homepage.',
    link: 'Return to homepage',
  },
  after: {
    title: 'This page wandered off to find itself.',
    body: "While it's on its journey, here are some articles that stayed put.",
    suggestions: [
      { icon: '\u{1F4D6}', label: 'Getting started guide' },
      { icon: '\u{1F50D}', label: 'Browse all topics' },
      { icon: '\u{1F4AC}', label: 'Ask the community' },
    ],
    link: 'Take me home',
  },
};

export default content;
