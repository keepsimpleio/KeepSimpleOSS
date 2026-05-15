const content = {
  en: {
    head: 'Sprint planning · 90 minutes',
    before: {
      thread: [
        {
          author: 'PM',
          text: 'Quick one — should the primary CTA be teal or navy?',
        },
        {
          author: 'Designer',
          text: 'Teal feels modern but navy reads as trust.',
        },
        {
          author: 'Engineer',
          text: 'My personal take: teal but a little darker.',
        },
        {
          author: 'Marketing',
          text: 'Our brand book says navy, but I see the case for teal...',
        },
        { author: 'CTO', text: 'Strong opinion — navy.' },
        { author: 'PM', text: 'Should we A/B test it?' },
      ],
      summary:
        '52 minutes on button color · 8 minutes on the database migration that could break checkout.',
    },
    after: {
      items: [
        {
          kind: 'big',
          kindLabel: 'high-stakes',
          time: '45m',
          title: 'Database migration plan',
          note: 'Owner: Sam. Decision needed today — affects every order Friday.',
        },
        {
          kind: 'big',
          kindLabel: 'high-stakes',
          time: '25m',
          title: 'New error-budget policy',
          note: 'Owner: Priya. Sets on-call rotation for next quarter.',
        },
        {
          kind: 'small',
          kindLabel: 'low-stakes',
          time: '5m',
          title: 'Button color',
          note: 'Default: brand book says navy. Override only if A/B test proves otherwise.',
        },
        {
          kind: 'small',
          kindLabel: 'low-stakes',
          time: '5m',
          title: 'Settings page heading copy',
          note: 'Designer picks. Park here if not resolved in 5 min.',
        },
      ],
      summary:
        'Each item time-boxed by impact. Bikeshed topics auto-default to a single owner.',
    },
  },
  ru: {
    head: 'Планирование спринта · 90 минут',
    before: {
      thread: [
        {
          author: 'PM',
          text: 'Быстрый вопрос — основной CTA сделать teal или navy?',
        },
        {
          author: 'Дизайнер',
          text: 'Teal современнее, но navy читается как «надёжность».',
        },
        { author: 'Инженер', text: 'Лично мне — teal, но потемнее.' },
        {
          author: 'Маркетинг',
          text: 'В брендбуке navy, но я понимаю аргументы за teal...',
        },
        { author: 'CTO', text: 'Имхо — navy.' },
        { author: 'PM', text: 'Может, A/B-тест?' },
      ],
      summary:
        '52 минуты на цвет кнопки · 8 минут на миграцию БД, которая в пятницу может уронить чекаут.',
    },
    after: {
      items: [
        {
          kind: 'big',
          kindLabel: 'важное',
          time: '45м',
          title: 'План миграции БД',
          note: 'Владелец: Сэм. Решение нужно сегодня — затронет все заказы в пятницу.',
        },
        {
          kind: 'big',
          kindLabel: 'важное',
          time: '25м',
          title: 'Новая политика error-budget',
          note: 'Владелец: Прия. Определяет on-call ротацию на квартал.',
        },
        {
          kind: 'small',
          kindLabel: 'мелочь',
          time: '5м',
          title: 'Цвет кнопки',
          note: 'Дефолт: брендбук говорит navy. Меняем, только если A/B докажет обратное.',
        },
        {
          kind: 'small',
          kindLabel: 'мелочь',
          time: '5м',
          title: 'Заголовок на странице настроек',
          note: 'Решает дизайнер. Если за 5 минут не решили — паркуем.',
        },
      ],
      summary:
        'Каждый пункт ограничен по времени по уровню влияния. По мелочам автоматически — один владелец.',
    },
  },
  hy: {
    head: 'Sprint planning · 90 րոպե',
    before: {
      thread: [
        {
          author: 'PM',
          text: 'Արագ հարց — գլխավոր CTA-ն teal անե՞նք, թե navy։',
        },
        {
          author: 'Designer',
          text: 'Teal-ը ավելի ժամանակակից է, բայց navy-ն կարդացվում է որպես «վստահելիություն»։',
        },
        {
          author: 'Engineer',
          text: 'Անձամբ ինձ՝ teal, բայց մի քիչ ավելի մուգ։',
        },
        {
          author: 'Marketing',
          text: 'Brand book-ում navy է, բայց teal-ի օգտին էլ կա բան...',
        },
        { author: 'CTO', text: 'Կարծիքս՝ navy։' },
        { author: 'PM', text: 'Գուցե A/B-թեստ անե՞նք։' },
      ],
      summary:
        '52 րոպե կոճակի գույնի վրա · 8 րոպե այն DB-միգրացիայի վրա, որը ուրբաթ կարող է կոտրել checkout-ը։',
    },
    after: {
      items: [
        {
          kind: 'big',
          kindLabel: 'կարևոր',
          time: '45ր',
          title: 'DB-միգրացիայի պլան',
          note: 'Owner: Sam։ Որոշումը պետք է այսօր — ազդում է ուրբաթվա բոլոր պատվերների վրա։',
        },
        {
          kind: 'big',
          kindLabel: 'կարևոր',
          time: '25ր',
          title: 'Նոր error-budget քաղաքականություն',
          note: 'Owner: Priya։ Որոշում է հաջորդ եռամսյակի on-call ռոտացիան։',
        },
        {
          kind: 'small',
          kindLabel: 'մանրուք',
          time: '5ր',
          title: 'Կոճակի գույն',
          note: 'Default՝ brand book-ը ասում է navy։ Փոխվում է միայն, եթե A/B-ն հակառակն ապացուցի։',
        },
        {
          kind: 'small',
          kindLabel: 'մանրուք',
          time: '5ր',
          title: 'Settings էջի վերնագիր',
          note: 'Որոշում է designer-ը։ 5 րոպեում չի լուծվում — park ենք անում։',
        },
      ],
      summary:
        'Յուրաքանչյուր կետ time-box-ով՝ ըստ ազդեցության։ Bikeshed-թեմաների համար մեկ owner է default-ով։',
    },
  },
};

export default content;
