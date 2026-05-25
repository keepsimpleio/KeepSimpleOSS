const content = {
  en: {
    title: 'Contacts',
    tableHeaders: ['Name', 'Email', 'Status'],
    rows: [
      {
        name: 'Acme Corp',
        email: 'acme@ex.com',
        status: 'Active',
        muted: false,
      },
      { name: 'Globex', email: 'g@ex.com', status: 'Active', muted: false },
      { name: 'Initech', email: 'i@ex.com', status: 'Inactive', muted: true },
    ],
    before: {
      exportLabel: 'Export CSV',
      importLabel: 'Import CSV',
      hint: 'Edited in Excel, re-imported daily',
    },
    after: {
      tooltipTitle: 'Did you know?',
      tooltipBody:
        'You can bulk-edit contacts directly — no CSV needed. Saves ~20 min/day.',
      tooltipLink: 'See how →',
    },
  },
  ru: {
    title: 'Контакты',
    tableHeaders: ['Имя', 'Email', 'Статус'],
    rows: [
      {
        name: 'Acme Corp',
        email: 'acme@ex.com',
        status: 'Активен',
        muted: false,
      },
      { name: 'Globex', email: 'g@ex.com', status: 'Активен', muted: false },
      { name: 'Initech', email: 'i@ex.com', status: 'Неактивен', muted: true },
    ],
    before: {
      exportLabel: 'Экспорт CSV',
      importLabel: 'Импорт CSV',
      hint: 'Правится в Excel, импортируется ежедневно',
    },
    after: {
      tooltipTitle: 'А вы знали?',
      tooltipBody:
        'Вы можете массово редактировать контакты прямо здесь — без CSV. Экономит ~20 мин/день.',
      tooltipLink: 'Показать как →',
    },
  },
  hy: {
    title: 'Կոնտակտներ',
    tableHeaders: ['Անուն', 'Էլ. փոստ', 'Կարգավիճակ'],
    rows: [
      {
        name: 'Acme Corp',
        email: 'acme@ex.com',
        status: 'Ակտիվ',
        muted: false,
      },
      { name: 'Globex', email: 'g@ex.com', status: 'Ակտիվ', muted: false },
      { name: 'Initech', email: 'i@ex.com', status: 'Ոչ ակտիվ', muted: true },
    ],
    before: {
      exportLabel: 'Արտահանել CSV',
      importLabel: 'Ներմուծել CSV',
      hint: 'Խմբագրվում է Excel-ում, ամեն օր ներմուծվում է',
    },
    after: {
      tooltipTitle: 'Գիտեի՞ք։',
      tooltipBody:
        'Դուք կարող եք զանգվածային կերպով խմբագրել կոնտակտներն ուղիղ այստեղ՝ առանց CSV-ի։ Խնայում է ~20 րոպե/օր։',
      tooltipLink: 'Տեսնել ինչպես →',
    },
  },
};

export default content;
