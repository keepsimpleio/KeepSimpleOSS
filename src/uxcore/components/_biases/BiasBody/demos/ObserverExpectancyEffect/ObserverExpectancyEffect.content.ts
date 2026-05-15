const content = {
  en: {
    scriptLabel: 'User Interview Script',
    tagLeading: 'leading',
    tagNeutral: 'neutral',
    outcomeLabel: 'Result',
    before: {
      questions: [
        "Wasn't the new dashboard so much faster?",
        'You found the export feature easily, right?',
        'Most users love the new color — what about you?',
      ],
      outcome:
        'Every participant agrees. Team ships with confidence — then churn spikes.',
    },
    after: {
      questions: [
        'Walk me through what you did from the moment you opened the dashboard.',
        'If you wanted to export this report, where would you start?',
        'How would you describe the new colour to a colleague?',
      ],
      outcome:
        '4 of 6 stumble on export. The "loved" feature was hiding the real problem.',
    },
  },
  ru: {
    scriptLabel: 'Скрипт интервью с пользователем',
    tagLeading: 'наводящий',
    tagNeutral: 'нейтральный',
    outcomeLabel: 'Результат',
    before: {
      questions: [
        'Согласитесь, новый дашборд намного быстрее?',
        'Вы же легко нашли функцию экспорта?',
        'Большинству нравится новый цвет — а вам?',
      ],
      outcome:
        'Все соглашаются. Команда уверенно релизит — а потом отток подскакивает.',
    },
    after: {
      questions: [
        'Расскажите, что вы делали с момента, как открыли дашборд.',
        'Если бы вам нужно было экспортировать этот отчёт, с чего бы начали?',
        'Как бы вы описали новый цвет коллеге?',
      ],
      outcome:
        '4 из 6 спотыкаются на экспорте. «Любимая» фича прятала настоящую проблему.',
    },
  },
  hy: {
    scriptLabel: 'Օգտատերի հարցազրույցի սցենար',
    tagLeading: 'առաջնորդող',
    tagNeutral: 'չեզոք',
    outcomeLabel: 'Արդյունք',
    before: {
      questions: [
        'Համաձա՞յն եք, որ նոր dashboard-ը շատ ավելի արագ է։',
        'Հո՞ դուք էքսպորտի ֆունկցիան հեշտ գտաք։',
        'Մարդկանց մեծամասնությունը սիրում է նոր գույնը — իսկ դո՞ւք։',
      ],
      outcome:
        'Բոլորը համաձայն են։ Թիմը վստահ թողարկում է — հետո churn-ը թռչում է։',
    },
    after: {
      questions: [
        'Պատմեք՝ ինչ արեցիք այն պահից, երբ բացեցիք dashboard-ը։',
        'Եթե այս հաշվետվությունը պետք լիներ էքսպորտել, որտեղի՞ց կսկսեիք։',
        'Ինչպե՞ս կնկարագրեիք նոր գույնը գործընկերոջը։',
      ],
      outcome:
        '6-ից 4-ը խրվում են էքսպորտի վրա։ «Սիրված» ֆիչան թաքցնում էր իրական խնդիրը։',
    },
  },
};

export default content;
