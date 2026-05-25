const content = {
  before: {
    title: 'Manage Subscription',
    planName: 'Pro Plan',
    planPrice: '$29/mo · renews Apr 1',
    changeBtn: 'Change Plan',
    cancelBtn: 'Cancel Subscription',
  },
  after: {
    title: 'Account',
    breadcrumb: 'Account › Billing › Manage Plan › Cancel',
    menu: [
      { label: 'Profile Settings', active: false },
      { label: 'Billing & Payments', active: true },
      { label: 'Security', active: false },
      { label: 'Notifications', active: false },
    ],
    subMenu1Title: 'Billing & Payments',
    subMenu1: [
      { label: 'Payment Methods', active: false },
      { label: 'Invoices', active: false },
      { label: 'Manage Plan', active: true },
    ],
    subMenu2Title: 'Manage Plan',
    subMenu2: [
      { label: 'Change Plan', danger: false },
      { label: 'Pause Subscription', danger: false },
      { label: 'Cancel Subscription', danger: true },
    ],
  },
};

export default content;
