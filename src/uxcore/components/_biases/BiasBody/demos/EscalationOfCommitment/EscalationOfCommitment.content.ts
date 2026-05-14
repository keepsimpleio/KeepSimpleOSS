const content = {
  en: {
    before: {
      title: 'Cancel Enrollment?',
      sub: "You can re-enroll in this course anytime you're ready.",
      cancel: 'Yes, Cancel',
      keep: 'Keep Access',
    },
    after: {
      title: "You've come so far",
      stats: [
        { value: '14 hrs', label: 'invested' },
        { value: '6 / 10', label: 'modules done' },
      ],
      progressLabel: 'Progress',
      progressValue: '60%',
      progressNote: 'Only 4 modules left to completion.',
      keepGoing: 'Keep Going',
      cancel: 'Cancel anyway',
    },
  },
  ru: {
    before: {
      title: 'Отменить запись?',
      sub: 'Вы можете записаться на этот курс снова, когда будете готовы.',
      cancel: 'Да, отменить',
      keep: 'Оставить доступ',
    },
    after: {
      title: 'Вы столько уже прошли',
      stats: [
        { value: '14 ч', label: 'вложено' },
        { value: '6 / 10', label: 'модулей пройдено' },
      ],
      progressLabel: 'Прогресс',
      progressValue: '60%',
      progressNote: 'До завершения осталось всего 4 модуля.',
      keepGoing: 'Продолжить',
      cancel: 'Всё равно отменить',
    },
  },
  hy: {
    before: {
      title: 'Չեղարկե՞լ գրանցումը։',
      sub: 'Դուք կարող եք կրկին գրանցվել այս դասընթացին ցանկացած պահի, երբ պատրաստ լինեք։',
      cancel: 'Այո, չեղարկել',
      keep: 'Պահել մուտքը',
    },
    after: {
      title: 'Դուք այսքան ճանապարհ եք անցել',
      stats: [
        { value: '14 ժամ', label: 'ներդրված' },
        { value: '6 / 10', label: 'մոդուլ ավարտված' },
      ],
      progressLabel: 'Առաջընթաց',
      progressValue: '60%',
      progressNote: 'Ավարտին մնացել է ընդամենը 4 մոդուլ։',
      keepGoing: 'Շարունակել',
      cancel: 'Այնուամենայնիվ չեղարկել',
    },
  },
};

export default content;
