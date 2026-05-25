const content = {
  en: {
    title: 'Data Workspace',
    staticTools: ['Filter', 'Sort', 'View'],
    files: [
      { name: 'Q1 Sales Report.csv', size: '4.2 MB' },
      { name: 'Customer List.csv', size: '1.8 MB' },
      { name: 'Invoice Data.csv', size: '2.1 MB' },
    ],
    before: {
      toolsTrigger: 'Tools ▾',
      dropdown: ['Export', 'Import', 'Merge', 'Archive'],
      note: '97% of clicks go to "Export" buried in Tools menu.',
    },
    after: {
      exportBtn: '↑ Export',
      toolsTrigger: 'Power Tools ▾',
      dropdown: [
        { icon: '⬇', label: 'Import' },
        { icon: '⊕', label: 'Merge' },
        { icon: '📦', label: 'Archive' },
      ],
      note: 'Export promoted; other tools discoverable in Power Tools.',
    },
  },
  ru: {
    title: 'Рабочее пространство данных',
    staticTools: ['Фильтр', 'Сортировка', 'Вид'],
    files: [
      { name: 'Отчёт по продажам Q1.csv', size: '4,2 МБ' },
      { name: 'Список клиентов.csv', size: '1,8 МБ' },
      { name: 'Данные по счетам.csv', size: '2,1 МБ' },
    ],
    before: {
      toolsTrigger: 'Инструменты ▾',
      dropdown: ['Экспорт', 'Импорт', 'Объединить', 'Архив'],
      note: '97% кликов уходят на «Экспорт», спрятанный в меню Инструменты.',
    },
    after: {
      exportBtn: '↑ Экспорт',
      toolsTrigger: 'Инструменты Pro ▾',
      dropdown: [
        { icon: '⬇', label: 'Импорт' },
        { icon: '⊕', label: 'Объединить' },
        { icon: '📦', label: 'Архив' },
      ],
      note: 'Экспорт выведен наверх; остальные инструменты — в Инструменты Pro.',
    },
  },
  hy: {
    title: 'Տվյալների աշխատատարածք',
    staticTools: ['Զտիչ', 'Տեսակավորում', 'Դիտում'],
    files: [
      { name: 'Q1 վաճառքի հաշվետվություն.csv', size: '4.2 ՄԲ' },
      { name: 'Հաճախորդների ցուցակ.csv', size: '1.8 ՄԲ' },
      { name: 'Հաշիվների տվյալներ.csv', size: '2.1 ՄԲ' },
    ],
    before: {
      toolsTrigger: 'Գործիքներ ▾',
      dropdown: ['Արտահանել', 'Ներմուծել', 'Միավորել', 'Արխիվ'],
      note: 'Կտտոցների 97%-ը գնում է «Արտահանել»-ին, որը թաքնված է Գործիքներ մենյուում։',
    },
    after: {
      exportBtn: '↑ Արտահանել',
      toolsTrigger: 'Power Tools ▾',
      dropdown: [
        { icon: '⬇', label: 'Ներմուծել' },
        { icon: '⊕', label: 'Միավորել' },
        { icon: '📦', label: 'Արխիվ' },
      ],
      note: 'Արտահանումն առաջ է բերված, մնացածը՝ Power Tools-ում։',
    },
  },
};

export default content;
