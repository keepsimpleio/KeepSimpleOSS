const content = {
  en: {
    avatar: 'JD',
    name: 'Jane Doe',
    memberSince: 'Member since Jan 2023',
    before: {
      progressLabel: 'Profile Completion',
      progressPct: '75%',
      progressText: '75% complete',
      statusLabel: 'Account Status',
      statusBadge: 'Active',
      tier: 'Standard tier',
    },
    after: {
      metrics: [
        { value: '2,840', label: 'Karma Points', variant: '' },
        { value: '142', label: 'Total Likes', variant: '' },
        { value: '#12', label: 'Contributor Rank', variant: 'rank' },
        { value: '14', label: 'Day Streak', variant: 'streak' },
      ],
      streakMsg: '14-day activity streak — keep it going!',
    },
  },
  ru: {
    avatar: 'JD',
    name: 'Jane Doe',
    memberSince: 'Участник с января 2023',
    before: {
      progressLabel: 'Заполнение профиля',
      progressPct: '75%',
      progressText: 'Заполнено на 75%',
      statusLabel: 'Статус аккаунта',
      statusBadge: 'Активен',
      tier: 'Стандартный уровень',
    },
    after: {
      metrics: [
        { value: '2 840', label: 'Очки кармы', variant: '' },
        { value: '142', label: 'Всего лайков', variant: '' },
        { value: '#12', label: 'Ранг контрибьютора', variant: 'rank' },
        { value: '14', label: 'Дней подряд', variant: 'streak' },
      ],
      streakMsg: 'Стрик активности 14 дней — не останавливайтесь!',
    },
  },
  hy: {
    avatar: 'JD',
    name: 'Jane Doe',
    memberSince: 'Անդամ է 2023-ի հունվարից',
    before: {
      progressLabel: 'Պրոֆիլի լրացում',
      progressPct: '75%',
      progressText: 'Լրացված է 75%-ով',
      statusLabel: 'Հաշվի կարգավիճակ',
      statusBadge: 'Ակտիվ',
      tier: 'Ստանդարտ մակարդակ',
    },
    after: {
      metrics: [
        { value: '2 840', label: 'Կարմայի միավորներ', variant: '' },
        { value: '142', label: 'Ընդհանուր հավանումներ', variant: '' },
        { value: '#12', label: 'Ներդրողի դիրք', variant: 'rank' },
        { value: '14', label: 'Օր անընդմեջ', variant: 'streak' },
      ],
      streakMsg: '14 օր անընդմեջ ակտիվություն — շարունակեք նույն տեմպով:',
    },
  },
};

export default content;
