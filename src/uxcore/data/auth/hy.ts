const hy = {
  logIn: {
    heading: 'Մուտք',
    subtitle: 'Ընտրեք ստորև բերված տարբերակներից մեկը',
    google: 'Մուտք գործել Google-ով',
    discord: 'Մուտք գործել Discord-ով',
    linkedin: 'Մուտք գործել LinkedIn-ով',
    twitter: 'Մուտք գործել X-ով',
    mailru: 'Մուտք գործել Mail.ru-ով',
    yandex: 'Մուտք գործել Yandex-ով',
    errors: {
      emailTaken:
        'Այս email-ով հաշիվ արդեն գոյություն ունի։ Փորձեք այլ email կամ մուտք գործեք ձեր սկզբնական եղանակով։',
      generic: 'Մուտքը չհաջողվեց։ Խնդրում ենք փորձել կրկին։',
    },
  },
  magicLinkForm: {
    divider: 'կամ մուտք գործել email-ով',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    submit: 'Ուղարկել հղում',
    submitting: 'Ուղարկվում է…',
    invalidEmail: 'Մուտքագրեք վավեր email։',
    sentHeading: 'Ստուգեք ձեր փոստը',
    sentBody:
      'Եթե այս email-ով հաշիվ կա, մենք ուղարկել ենք մուտքի հղում։ Հղումը գործում է 15 րոպե։',
    limitReached:
      'Email-ով մուտքը ժամանակավորապես անհասանելի է։ Խնդրում ենք օգտվել Google կամ Discord-ից։',
  },
  consumePage: {
    invalidLink: {
      title: 'Այս հղումն այլևս վավեր չէ',
      body: 'Magic-հղումն ավարտվում է 15 րոպեից և կարող է օգտագործվել միայն մեկ անգամ։ Խնդրում ենք պահանջել նորը։',
      cta: 'Պահանջել նոր հղում',
    },
    blocked: {
      title: 'Մուտքն անհասանելի է',
    },
    accountAlreadyExists:
      'Այս email-ով հաշիվ արդեն գոյություն ունի։ Խնդրում ենք մուտք գործել։',
  },
  profileForm: {
    heading: 'Ավարտեք ձեր հաշվի կարգավորումը',
    body: 'Մեզ անհրաժեշտ է ձեր անունը',
    nameLabel: 'Անուն',
    namePlaceholder: 'Ձեր անունը',
    surnameLabel: 'Ազգանուն',
    surnamePlaceholder: 'Ձեր ազգանունը',
    submit: 'Շարունակել',
    submitting: 'Հաշիվ ստեղծվում է…',
    invalidProfile: 'Ստուգեք անվան դաշտերը և փորձեք կրկին։',
    invalidRegistrationToken:
      'Ձեր գրանցման սեսիան ավարտվել է։ Խնդրում ենք պահանջել մուտքի նոր հղում։',
    requestNewLink: 'Պահանջել նոր հղում',
  },
};

export default hy;
