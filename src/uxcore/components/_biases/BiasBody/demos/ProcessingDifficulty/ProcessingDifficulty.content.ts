const content = {
  en: {
    before: {
      heading: 'Are you sure?',
      body: 'This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'Yes, Delete',
    },
    after: {
      heading: 'Delete this project?',
      impact: [
        { num: '847', label: 'files will be permanently deleted' },
        { num: '23', label: 'collaborators will lose access' },
        { num: '18 mo', label: 'of version history will be erased' },
      ],
      confirmLabelPrefix: 'Type',
      confirmLabelSuffix: 'to confirm:',
      confirmWord: 'DELETE',
      inputPlaceholder: 'DELETE',
      cancel: 'Cancel',
      confirm: 'Delete Project',
    },
  },
  ru: {
    before: {
      heading: 'Вы уверены?',
      body: 'Это действие нельзя отменить.',
      cancel: 'Отмена',
      confirm: 'Да, удалить',
    },
    after: {
      heading: 'Удалить этот проект?',
      impact: [
        { num: '847', label: 'файлов будет удалено безвозвратно' },
        { num: '23', label: 'соавтора потеряют доступ' },
        { num: '18 мес', label: 'истории версий будет стёрто' },
      ],
      confirmLabelPrefix: 'Введите',
      confirmLabelSuffix: 'для подтверждения:',
      confirmWord: 'УДАЛИТЬ',
      inputPlaceholder: 'УДАЛИТЬ',
      cancel: 'Отмена',
      confirm: 'Удалить проект',
    },
  },
  hy: {
    before: {
      heading: 'Վստա՞հ եք։',
      body: 'Այս գործողությունը հնարավոր չէ հետ բերել։',
      cancel: 'Չեղարկել',
      confirm: 'Այո, ջնջել',
    },
    after: {
      heading: 'Ջնջե՞լ այս նախագիծը։',
      impact: [
        { num: '847', label: 'ֆայլ անվերադարձ կջնջվի' },
        { num: '23', label: 'համագործակից կկորցնի մուտքը' },
        { num: '18 ամս', label: 'վարկածների պատմություն կջնջվի' },
      ],
      confirmLabelPrefix: 'Մուտքագրեք',
      confirmLabelSuffix: 'հաստատելու համար՝',
      confirmWord: 'ՋՆՋԵԼ',
      inputPlaceholder: 'ՋՆՋԵԼ',
      cancel: 'Չեղարկել',
      confirm: 'Ջնջել նախագիծը',
    },
  },
};

export default content;
