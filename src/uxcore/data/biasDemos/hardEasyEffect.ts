const content = {
  title: 'File Your Tax Return',
  before: {
    fields: [
      { label: 'First Name', placeholder: 'John', type: 'text' },
      { label: 'Last Name', placeholder: 'Smith', type: 'text' },
      { label: 'SSN / TIN', placeholder: 'XXX-XX-XXXX', type: 'text' },
      { label: 'Filing Status', placeholder: 'Single', type: 'select' },
      {
        label: 'Employer EIN',
        placeholder: 'XX-XXXXXXX',
        type: 'text',
        full: true,
      },
      { label: 'W-2 Wages (Box 1)', placeholder: '$0.00', type: 'text' },
      { label: 'Federal Tax Withheld', placeholder: '$0.00', type: 'text' },
      { label: 'State Tax Withheld', placeholder: '$0.00', type: 'text' },
      { label: 'State Wages', placeholder: '$0.00', type: 'text' },
      { label: 'Other Income', placeholder: '$0.00', type: 'text' },
      { label: 'Interest Income', placeholder: '$0.00', type: 'text' },
      { label: 'Deduction Type', placeholder: 'Standard', type: 'select' },
      { label: 'Dependents', placeholder: '0', type: 'number' },
      { label: 'Credits Claimed', placeholder: '$0.00', type: 'text' },
      { label: 'Estimated Tax Paid', placeholder: '$0.00', type: 'text' },
    ],
    cta: 'Submit Return',
  },
  after: {
    steps: [
      { label: '1 Personal', done: true, active: false },
      { label: '2 Income', done: false, active: true },
      { label: '3 Deductions', done: false, active: false },
      { label: '4 Review', done: false, active: false },
    ],
    stepLabel: 'Step 2 of 4 — Income Sources',
    stepHint: 'Enter your income from all employers this year.',
    fields: [
      {
        label: 'W-2 Wages (Box 1)',
        placeholder: '$0.00',
        tip: 'Found on your W-2 form',
      },
      {
        label: 'Federal Tax Withheld',
        placeholder: '$0.00',
        tip: 'Found in Box 2 of W-2',
      },
      {
        label: 'Other Income',
        placeholder: '$0.00',
        tip: 'Freelance, rental, etc.',
      },
    ],
    back: 'Back',
    cta: 'Continue',
  },
};

export default content;
