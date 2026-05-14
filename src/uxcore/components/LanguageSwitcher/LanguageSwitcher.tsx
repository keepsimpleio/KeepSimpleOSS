import cn from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { useClickOutside } from '@uxcore/hooks/useClickOutside';

import styles from './LanguageSwitcher.module.scss';

type SectionType = 'uxcore' | 'uxcg';

type LanguageSwitcherProps = {
  withFlag?: boolean;
  detectingLangSwitch?: boolean;
  className?: string;
  section?: SectionType;
  blockLanguageSwitcher?: boolean;
  languageSwitchSlugs?: Record<string, string>;
  withText?: boolean;
};

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  withFlag,
  detectingLangSwitch,
  className,
  section,
  blockLanguageSwitcher = false,
  languageSwitchSlugs,
  withText = true,
}) => {
  const router = useRouter();

  const locales = ['en', 'hy', 'ru'];
  const { asPath } = router;

  const languageLabels: Record<
    string,
    { label: string; shortLabel: string; flag: string }
  > = {
    en: {
      label: 'English',
      shortLabel: 'EN',
      flag: `/assets/flags/uk.svg`,
    },
    hy: {
      label: 'Armenian',
      shortLabel: 'HY',
      flag: '/assets/flags/arm.svg',
    },
    ru: {
      label: 'Russian',
      shortLabel: 'RU',
      flag: '/assets/flags/ru.svg',
    },
  };

  const handleDetectingLangSwitch = () => {
    if (asPath.includes('/user/')) {
      localStorage.setItem('languageSwitched', 'true');
    }
  };

  const closeDropdown = () => {
    detectingLangSwitch && handleDetectingLangSwitch();
  };

  const ref = useClickOutside(closeDropdown);

  const currentLocale = router.locale;
  const currentLang = languageLabels[currentLocale];

  return (
    <div
      className={cn(styles.languageSwitcher, className)}
      ref={ref}
      data-cy={'language-switcher'}
    >
      <button onClick={closeDropdown} className={styles.switcher}>
        {withFlag && (
          <Image
            src={currentLang.flag}
            width={22}
            height={15}
            alt={`${currentLang.label} flag`}
          />
        )}
        {withText && currentLang.shortLabel}
      </button>

      <ul
        className={cn(styles.dropdown, {
          [styles.withFlags]: withFlag,
        })}
      >
        {locales.map(locale => {
          const { label, flag } = languageLabels[locale];
          const localizedPath = section
            ? `/${section}/${languageSwitchSlugs[locale]}`
            : asPath;

          return (
            <li key={locale}>
              {blockLanguageSwitcher ? (
                <div>
                  <span className={styles.link}>
                    {withFlag && (
                      <Image
                        src={flag}
                        width={16}
                        height={13}
                        alt={`${label} flag`}
                        className={styles.flag}
                      />
                    )}
                    {label}
                  </span>
                </div>
              ) : (
                <Link
                  shallow={false}
                  href={localizedPath}
                  locale={locale}
                  legacyBehavior
                  data-cy={`language-switcher-${locale}`}
                >
                  <a onClick={closeDropdown} className={styles.link}>
                    {withFlag && (
                      <Image
                        src={flag}
                        width={16}
                        height={13}
                        alt={`${label} flag`}
                        className={styles.flag}
                      />
                    )}
                    {label}
                  </a>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
