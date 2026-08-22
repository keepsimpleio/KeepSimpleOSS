// Figures and operational windows are deliberately absent from this
// content: any number quoted in the OffSec layer must be sourced (see
// project memory `feedback_offsec_no_mocked_numbers`). The directional
// pattern (topical, news-anchored lures outperform generic ones) is well
// documented; the specific lift is not the point of the page.
//
// Surface is a browser tab (lookalike-domain landing page), NOT email,
// so the OffSec bias cards don't all read as "another inbox".
// Post-breach phishing increasingly arrives via sponsored search
// results and headline-anchored URLs, which fits the availability
// heuristic better than a generic vendor email anyway.

import type { OffsecBiasContent } from '../types';

const content: OffsecBiasContent = {
  tell: 'Когда страница кажется настоящей, потому что перекликается с новостью, прочитанной утром, эта лёгкость припоминания и есть приманка в работе. То, насколько легко что-то приходит на ум, ничего не говорит о том, реально ли оно.',
  scenario:
    'Банк NorthBank только что взломали, и новость повсюду. Вы работаете совсем в другом месте, но две фишинговые страницы просят у вас одно и то же: рабочий логин. Разница между ними только в том, что одна упоминает взлом NorthBank, о котором вы только что прочитали.',
  visualLabel: 'Сценарий',
  visual: {
    before: {
      kind: 'browser',
      tag: 'Без новостного крючка',
      host: 'account-check.acme-vendor-security.com',
      path: '/sso',
      pageHeading: 'Подтвердите аккаунт, чтобы продолжить',
      pageBody:
        'Плановая проверка безопасности. Войдите под рабочей учётной записью, чтобы подтвердить, что доступ ещё действует.',
      cta: 'Войти через SSO',
    },
    after: {
      kind: 'browser',
      tag: 'С привязкой к новости',
      host: 'northbank-breach-check.acme-vendor-security.com',
      path: '/sso',
      pageHeading:
        'Подтвердите SSO, чтобы оценить, задела ли вас утечка NorthBank',
      pageBody:
        'Наша команда нашла ваш домен в массиве данных NorthBank. Войдите под рабочей учётной записью, чтобы мы оценили масштаб утечки до конца дня.',
      cta: 'Войти через SSO',
      flagged: true,
    },
  },
  whyItWorksLabel: 'Почему это работает',
  whyItWorks:
    'Первая страница вызывает мгновенное подозрение: просьба залогиниться на пустом месте. Вторая просит ровно то же самое, но выглядит ожидаемой, потому что об утечке говорят всю неделю. Это эвристика доступности. Мозг перестаёт спрашивать «насколько это вероятно?» и начинает спрашивать «насколько легко я это вспоминаю?», а вспоминается сейчас без усилий. Мысль «надо проверить этот адрес» вытесняется мыслью «я только что об этом читал». Начинка одинаковая, социальную инженерию делает новость.',
  defenseLabel: 'Защитите себя',
  defense: {
    lede: 'Пока команда безопасности держит периметр, вот ваше домашнее задание.',
    moves: [
      'Когда страница опирается на сегодняшнюю новость, чтобы вас сдвинуть, это ровно тот момент, чтобы притормозить, а не ускориться. Ощущение срочности и есть работающая атака.',
      'Прочитайте имя хоста целиком слева направо, прежде чем что-то вводить. Атакующие ставят знакомый бренд поддоменом на домене, который принадлежит им. Считается самая правая часть.',
      'Пусть решает менеджер паролей. Если он не подставляет данные на странице входа, это не та страница, за которую вы её приняли. Не переопределяйте, закройте вкладку.',
      'Считайте любое упоминание утечки на посадочной странице заявлением, а не фактом. Проверьте статус на сайте самой компании или в Have I Been Pwned, прежде чем где-то входить.',
    ],
  },
};

export default content;
