const ru = {
  logIn: {
    heading: 'Вход',
    subtitle: 'Выберите один из способов ниже',
    google: 'Войти через Google',
    discord: 'Войти через Discord',
    linkedin: 'Войти через LinkedIn',
    twitter: 'Войти через X',
    mailru: 'Войти через Mail.ru',
    yandex: 'Войти через Yandex',
    errors: {
      emailTaken:
        'Аккаунт с этим email уже существует. Попробуйте другой email или войдите тем способом, которым регистрировались.',
      generic: 'Не удалось войти. Попробуйте ещё раз.',
    },
  },
  magicLinkForm: {
    divider: 'или войти по email',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    submit: 'Отправить ссылку',
    submitting: 'Отправляем…',
    invalidEmail: 'Введите корректный email.',
    sentHeading: 'Проверьте почту',
    sentBody:
      'Если аккаунт с таким email существует, мы отправили ссылку для входа. Ссылка действительна 15 минут.',
    limitReached:
      'Вход по ссылке временно недоступен. Пожалуйста, войдите через Google или Discord.',
  },
  consumePage: {
    invalidLink: {
      title: 'Ссылка больше недействительна',
      body: 'Magic-ссылка действует 15 минут и может быть использована один раз. Запросите новую.',
      cta: 'Запросить новую ссылку',
    },
    blocked: {
      title: 'Вход недоступен',
    },
    accountAlreadyExists:
      'Аккаунт с таким email уже существует. Пожалуйста, войдите.',
  },
  profileForm: {
    heading: 'Завершите настройку аккаунта',
    body: 'Укажите имя для аккаунта',
    nameLabel: 'Имя',
    namePlaceholder: 'Ваше имя',
    surnameLabel: 'Фамилия',
    surnamePlaceholder: 'Ваша фамилия',
    submit: 'Продолжить',
    submitting: 'Создаём аккаунт…',
    invalidProfile: 'Проверьте поля имени и попробуйте снова.',
    invalidRegistrationToken:
      'Срок регистрации истёк. Пожалуйста, запросите новую ссылку для входа.',
    requestNewLink: 'Запросить новую ссылку',
  },
};

export default ru;
