const en = {
  logIn: {
    heading: 'Log In',
    subtitle: 'Choose one of the options below',
    google: 'Continue with Google',
    discord: 'Continue with Discord',
    linkedin: 'Continue with LinkedIn',
    twitter: 'Continue with X',
    mailru: 'Continue with Mail.ru',
    yandex: 'Continue with Yandex',
    errors: {
      emailTaken:
        'An account with this email already exists. Try a different email or sign in with your original provider.',
      generic: 'Sign-in failed. Please try again.',
    },
  },
  magicLinkForm: {
    divider: 'or sign in with email',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    submit: 'Send magic link',
    submitting: 'Sending…',
    invalidEmail: 'Please enter a valid email address.',
    sentHeading: 'Check your inbox',
    sentBody:
      'If an account is associated with that email, we’ve sent a sign-in link. The link expires in 15 minutes.',
    limitReached:
      'Magic link sign-in is temporarily unavailable. Please sign in with Google or Discord.',
  },
  consumePage: {
    invalidLink: {
      title: 'This link is no longer valid',
      body: 'Magic links expire after 15 minutes and can only be used once. Please request a new one.',
      cta: 'Request a new link',
    },
    blocked: {
      title: 'Sign-in unavailable',
    },
    accountAlreadyExists:
      'An account with this email already exists. Please sign in instead.',
  },
  profileForm: {
    heading: 'Finish setting up your account',
    body: 'We just need a name to associate with',
    nameLabel: 'First name',
    namePlaceholder: 'Your first name',
    surnameLabel: 'Last name',
    surnamePlaceholder: 'Your last name',
    submit: 'Continue',
    submitting: 'Creating account…',
    invalidProfile: 'Please double-check the name fields and try again.',
    invalidRegistrationToken:
      'Your registration session has expired. Please request a new sign-in link.',
    requestNewLink: 'Request a new link',
  },
};

export default en;
