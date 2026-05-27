const ru = {
  logIn: {
    heading: 'Вход',
    subtitle: 'Выберите один из способов ниже',
    google: 'Войти через Google',
    discord: 'Войти через Discord',
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
  emailChange: {
    settings: {
      description:
        'Twitter не передаёт нам ваш email. Добавьте его, чтобы можно было входить по email.',
      submit: 'Отправить ссылку',
      submitting: 'Отправляем…',
      sent: 'Мы отправили ссылку для подтверждения на {email}. Нажмите её в течение 15 минут.',
      invalidEmail: 'Введите корректный email.',
      sameEmail: 'Введите другой email.',
      emailAlreadyRegistered:
        'Этот email уже используется другим аккаунтом KeepSimple.',
      limitReached:
        'Подтверждение email временно недоступно. Попробуйте позже.',
      notAllowed: 'Изменение email больше недоступно для этого аккаунта.',
      generic: 'Что-то пошло не так. Попробуйте ещё раз.',
    },
    confirmPage: {
      success: {
        title: 'Email подтверждён',
        body: 'Ваш email подтверждён. Теперь вы можете входить по этому адресу.',
        cta: 'На главную',
      },
      invalidToken: {
        title: 'Ссылка больше недействительна',
        body: 'Ссылка для подтверждения действует 15 минут и может быть использована один раз. Запросите новую в настройках.',
        cta: 'На главную',
      },
      notAllowed: {
        title: 'Email уже установлен',
        body: 'У этого аккаунта уже есть подтверждённый email. Дополнительных действий не требуется.',
        cta: 'На главную',
      },
      emailAlreadyRegistered: {
        title: 'Email уже используется',
        body: 'Этот email уже используется другим аккаунтом KeepSimple.',
        cta: 'На главную',
      },
      blocked: {
        title: 'Вход недоступен',
        body: '',
        cta: 'На главную',
      },
    },
  },
};

export default ru;
