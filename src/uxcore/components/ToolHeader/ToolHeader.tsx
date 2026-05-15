import { getMyInfo } from '@uxcore/api/strapi';
import { userInfoUpdate } from '@uxcore/api/uxcat/settings';
import { getUserInfo } from '@uxcore/api/uxcat/users-me';
import CloseIcon from '@uxcore/assets/icons/CloseIcon';
import DiamondIcon from '@uxcore/assets/icons/DiamondIcon';
import PodcastIcon from '@uxcore/assets/icons/PodcastIcon';
import MobileHeader from '@uxcore/components/_biases/MobileHeader';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import LanguageSwitcher from '@uxcore/components/LanguageSwitcher';
import Link from '@uxcore/components/NextLink';
import OurProjectsModal from '@uxcore/components/OurProjectsModal';
import PageSwitcher from '@uxcore/components/PageSwitcher';
import UserDropdown from '@uxcore/components/UserDropdown';
import toolHeaderData from '@uxcore/data/toolHeader';
import useGlobals from '@uxcore/hooks/useGlobals';
import useMobile from '@uxcore/hooks/useMobile';
import useUXCoreGlobals from '@uxcore/hooks/useUXCoreGlobals';
import { isLevelMilestone } from '@uxcore/lib/uxcat-helpers';
import type { TRouter } from '@uxcore/local-types/global';
import { UserTypes } from '@uxcore/local-types/uxcat-types/types';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { navItems } from './navItems';

import styles from './ToolHeader.module.scss';

const SettingsModal = dynamic(
  () => import('@uxcore/components/SettingsModal'),
  {
    ssr: false,
  },
);

type TToolHeader = {
  homepageLinkTarget?: '_blank' | '_self';
  openPodcast?: boolean;
  showSavedPersonas?: boolean;
  setOpenPodcast?: (updater: (prev: boolean) => boolean) => void;
  openPersonaModal?: (openPersona: boolean) => void;
  changeUserUrl?: boolean;
  setSelectedTitle?: (selected: string) => void;
  disablePageSwitcher?: boolean;
  userInfo?: UserTypes;
  setUserInfo?: (data: UserTypes) => void;
  setUpdatedUsername?: (username: string) => void;
  blockLanguageSwitcher?: boolean;
  hidden?: boolean;
};
const normalizePath = (p: string) => p.replace(/\/+$/, '') || '/';

const getActiveFromPath = (pathname: string) => {
  const path = normalizePath(pathname);

  if (path.includes('/uxcore')) return 'uxcore';
  if (path.includes('/uxcg')) return 'uxcg';
  if (path.includes('/uxcp')) return 'uxcp';
  if (path.includes('/uxcat') || path.includes('/user')) return 'uxcat';

  return null;
};

const ToolHeader: FC<TToolHeader> = ({
  homepageLinkTarget = '_self',
  openPodcast,
  setOpenPodcast,
  openPersonaModal,
  showSavedPersonas = true,
  changeUserUrl,
  setSelectedTitle,
  disablePageSwitcher,
  userInfo,
  setUserInfo,
  setUpdatedUsername,
  blockLanguageSwitcher,
  hidden,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  // Use router.pathname (route template, hash-free) not router.asPath:
  // asPath contains the URL hash on the client but not on SSR, which
  // breaks hydration on routes like /uxcore#hr.
  const pathname = router.pathname;

  const { isMobile } = useMobile()[1];
  const [{ toggleIsDarkTheme }, { isDarkTheme }] = useGlobals();
  const [, { isCoreView }] = useUXCoreGlobals();
  const { accountData, setAccountData, ourProjectsModalData } =
    useContext(GlobalContext);

  const imageSrc = useMemo(() => accountData?.picture, [accountData]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openOurProjects, setOpenOurProjects] = useState(false);
  const [showUxcoreTooltip, toggleUxcoreHeaderTooltip] = useState(true);
  const [showUxcgTooltip, toggleUxcgHeaderTooltip] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [usernameIsTakenError, setUsernameIsTakenError] = useState('');
  const [changedTitle, setChangedTitle] = useState(false);
  const [activePage, setActivePage] = useState(() =>
    getActiveFromPath(router.asPath),
  );

  const {
    ourProjects,
    usernameIsTaken,
    settingsTxt,
    myProfileTxt,
    bobName,
    awarenessTest,
    podcast,
    findSolutions,
    learnAboutUXCore,
    done,
  } = toolHeaderData[locale];

  const currentUsername = !!accountData && accountData.username;
  const currentEmail = accountData && accountData.email;
  const publicEmail = accountData && accountData.publicEmail;
  const isRoutingRef = useRef(false);

  const linkedIn = userInfo?.user?.linkedin
    ? userInfo?.user?.linkedin
    : userInfo?.linkedin;

  const linkedInStatus = accountData
    ? accountData.publicLinkedin
    : accountData?.publicLinkedin;

  const level = userInfo?.user?.level ? userInfo?.user?.level : userInfo?.level;
  const changeTitlePermission = isLevelMilestone(level, 13);
  const userTitlesRu = ['Просвещенный', 'Профессор', 'Великий'];

  const russianTitles = selectedTitle => {
    if (!selectedTitle) {
      return null;
    }
    return selectedTitle === 'Enlightened'
      ? userTitlesRu[0]
      : selectedTitle === 'Professor'
        ? userTitlesRu[1]
        : userTitlesRu[2];
  };

  const title = changedTitle ? userInfo?.title : userInfo?.user?.title;

  useEffect(() => {
    const initial = getActiveFromPath(router.asPath);
    if (initial) setActivePage(initial);

    const onStart = (url: string) => {
      isRoutingRef.current = true;

      const next = getActiveFromPath(url);
      if (next) setActivePage(next);
    };

    const onComplete = (url: string) => {
      isRoutingRef.current = false;

      const next = getActiveFromPath(url);
      if (next) setActivePage(next);
    };

    const onError = () => {
      isRoutingRef.current = false;
    };

    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onComplete);
    router.events.on('routeChangeError', onError);

    return () => {
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onComplete);
      router.events.off('routeChangeError', onError);
    };
  }, [router.events, router.asPath]);

  const openPodcastHandler = useCallback(() => {
    setOpenPodcast(prev => !prev);
  }, []);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleSaveClick = async (
    username: string,
    linkedInUrl: string,
    isEmailPublic: string,
    isLinkedinPublic: string,
    title?: string,
  ) => {
    const mailIsPublic = isEmailPublic === 'everyone';
    const linkedInIsPublic = isLinkedinPublic === 'everyone';
    try {
      await userInfoUpdate(
        token,
        username,
        linkedInUrl,
        mailIsPublic,
        linkedInIsPublic,
        title,
      );

      const data = await getMyInfo();
      if (changeUserUrl) {
        await router.replace(`/user/${username}`);
      }
      setAccountData(data);
      setOpenSettings(false);
      setUsernameIsTakenError('');
      const userData = await getUserInfo();
      setUserInfo(userData?.user);
      setUpdatedUsername(username);
    } catch (error) {
      setOpenSettings(true);
      setUsernameIsTakenError(usernameIsTaken);
    }
  };

  useEffect(() => {
    const initialUxcoreTooltip = JSON.parse(
      localStorage.getItem('toggleUxcoreHeaderTooltipNew') || 'true',
    );
    const initialUxcgTooltip = JSON.parse(
      localStorage.getItem('toggleUxcgHeaderTooltipNew') || 'true',
    );

    toggleUxcoreHeaderTooltip(initialUxcoreTooltip);
    toggleUxcgHeaderTooltip(initialUxcgTooltip);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'toggleUxcoreHeaderTooltipNew',
      JSON.stringify(showUxcoreTooltip),
    );
  }, [showUxcoreTooltip]);

  useEffect(() => {
    localStorage.setItem(
      'toggleUxcgHeaderTooltipNew',
      JSON.stringify(showUxcgTooltip),
    );
  }, [showUxcgTooltip]);

  useEffect(() => {
    const token =
      (typeof window !== undefined && localStorage.getItem('accessToken')) ||
      localStorage.getItem('googleToken');
    setToken(token);
  }, []);

  useEffect(() => {
    if (userInfo) {
      setSelectedTitle &&
        setSelectedTitle(locale === 'en' ? title : russianTitles(title));
    }
  }, [title, locale, userInfo]);

  return (
    <header className={cn(styles.ToolHeader, { [styles.Hidden]: hidden })}>
      <div className={styles.mobile}>
        <MobileHeader
          disablePageSwitcher={disablePageSwitcher}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          changeUserUrl={!!changeUserUrl && changeUserUrl}
          setUpdatedUsername={!!setUpdatedUsername && setUpdatedUsername}
          blockLanguageSwitcher={blockLanguageSwitcher}
        />
        {!disablePageSwitcher && (
          <div className={styles.PageSwitcherContainer}>
            <PageSwitcher page={activePage} />
            <span
              className={cn(styles.PageSwitcherItem, {
                [styles.Disabled]: !ourProjectsModalData,
              })}
              onClick={() => setOpenOurProjects(true)}
            >
              <DiamondIcon />
              <span className={styles.Description}>{ourProjects}</span>
            </span>
          </div>
        )}
      </div>
      <>
        {!isMobile && (
          <div className={styles.LinkWrapper}>
            <Link href="/" locale={locale} legacyBehavior>
              <a target={homepageLinkTarget} className={styles.logo}>
                <Image
                  src={
                    isDarkTheme
                      ? '/assets/logos/keepsimpleDark.svg'
                      : '/assets/logos/keepsimple.svg'
                  }
                  alt="keepsimple logo"
                  width={130.61}
                  height={25.87}
                />
              </a>
            </Link>
            <div
              className={cn(styles.Links, styles[`is-${activePage}`], {
                [styles[`is-${activePage}-ru`]]: locale === 'ru',
              })}
            >
              <span className={styles.Pill} />
              {navItems.map(({ label, href, page, icon }, index) => {
                return (
                  <>
                    <span
                      className={cn(styles.Indicator, {
                        [styles.IndicatorActive]: activePage,
                      })}
                    />
                    <Link
                      key={index}
                      href={href}
                      locale={locale}
                      legacyBehavior
                    >
                      <a
                        className={cn(styles.MenuItem, {
                          [styles.Active]: activePage === page,
                          [styles[`${page}-MenuItem`]]: !!page,
                        })}
                        target={
                          label === 'Bob - AI Assistant' ? '_blank' : '_self'
                        }
                        onClick={() => {
                          toggleUxcoreHeaderTooltip(false);
                          toggleUxcgHeaderTooltip(false);
                        }}
                      >
                        {label != 'Bob - AI Assistant' ? (
                          icon
                        ) : (
                          <Image
                            src={'/assets/Bob.png'}
                            alt={'Bob - AI Assistant'}
                            width={25}
                            height={25}
                            className={styles.bob}
                          />
                        )}
                        <span className={styles.Description}>
                          {label === 'Bob - AI Assistant'
                            ? bobName
                              ? bobName
                              : label
                            : label === 'Awareness Test'
                              ? awarenessTest
                              : label}
                        </span>
                        {label === 'Bob - AI Assistant' && (
                          <Image
                            src={'/assets/open-link.svg'}
                            alt={'New link icon'}
                            width={17}
                            height={16}
                            className={styles.openLink}
                          />
                        )}
                      </a>
                    </Link>
                  </>
                );
              })}
            </div>

            {showUxcgTooltip && pathname === '/uxcore' && (
              <div
                className={cn(styles.headerTooltipUxCore)}
                data-cy={'uxcg-informative-tooltip'}
              >
                <span>{findSolutions}</span>
                <button
                  className={styles.closeBtn}
                  onClick={() => {
                    toggleUxcgHeaderTooltip(false);
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
            )}
            {showUxcoreTooltip && pathname === '/uxcg' && (
              <div
                className={cn(styles.headerTooltipUxcg, {
                  [styles.headerTooltipUxcgHy]: locale === 'hy',
                })}
                data-cy={'uxcore-informative-tooltip'}
              >
                <span>{learnAboutUXCore}</span>
                <button
                  className={styles.closeBtn}
                  onClick={() => {
                    toggleUxcoreHeaderTooltip(false);
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
            )}
          </div>
        )}

        {!isMobile && (
          <div
            className={cn(styles.UsefulLinksWrapper, {
              [styles.authorized]: !!accountData,
            })}
          >
            {isCoreView && pathname === '/uxcore' && locale !== 'hy' && (
              <div
                onClick={openPodcastHandler}
                className={cn(styles.MenuItem, {
                  [styles.ActivePodcast]: !!openPodcast,
                })}
                data-cy={'podcast-button'}
              >
                <PodcastIcon />
                <span>{podcast}</span>
              </div>
            )}
            <span
              className={cn(styles.MenuItem, {
                [styles.MenuItemHy]: locale === 'hy',
                [styles.Disabled]: !ourProjectsModalData,
                [styles.ActiveProjects]: !!openOurProjects,
              })}
              onClick={() => setOpenOurProjects(true)}
            >
              <DiamondIcon />
              <span className={styles.Description}>{ourProjects}</span>
            </span>
            <div
              className={cn(styles.actions, {
                [styles.authorized]: !!accountData,
              })}
            >
              <button
                type="button"
                className={styles.themeToggle}
                onClick={toggleIsDarkTheme}
                aria-label={
                  isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'
                }
                aria-pressed={isDarkTheme}
                data-cy="theme-toggle"
              >
                {isDarkTheme ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
              <LanguageSwitcher
                withFlag
                withText={false}
                detectingLangSwitch
                blockLanguageSwitcher={blockLanguageSwitcher}
              />
              <div className={styles.userMenu}>
                <UserDropdown
                  userName={currentUsername}
                  userImage={
                    userInfo?.user?.picture ? userInfo?.user?.picture : imageSrc
                  }
                  showDropdown={showDropdown}
                  isLoggedIn={!!accountData}
                  setShowDropdown={setShowDropdown}
                  setAccountData={setAccountData}
                  openSavedPersonas={openPersonaModal}
                  showSavedPersonas={showSavedPersonas}
                  handleOpenSettings={handleOpenSettings}
                  settingsTxt={settingsTxt}
                  myProfileTxt={myProfileTxt}
                />
              </div>
            </div>
          </div>
        )}
        {openSettings && (
          <SettingsModal
            setOpenSettings={setOpenSettings}
            currentUsername={currentUsername}
            currentEmail={currentEmail}
            mailStatus={publicEmail}
            linkedin={linkedIn}
            linkedinStatus={linkedInStatus}
            handleSaveClick={handleSaveClick}
            setUsernameIsTakenError={setUsernameIsTakenError}
            usernameIsTakenError={usernameIsTakenError}
            defaultSelectedTitle={
              locale === 'en' ? title : russianTitles(title)
            }
            changeTitlePermission={changeTitlePermission}
            setChangedTitle={setChangedTitle}
          />
        )}
        {openOurProjects && (
          <OurProjectsModal
            projects={
              !!ourProjectsModalData && ourProjectsModalData?.aboutProject
            }
            title={!!ourProjectsModalData && ourProjectsModalData?.title}
            onClose={() => setOpenOurProjects(false)}
            github={!!ourProjectsModalData && ourProjectsModalData.github}
            api={!!ourProjectsModalData && ourProjectsModalData.api}
            doneTxt={done}
          />
        )}
      </>
    </header>
  );
};

export default ToolHeader;
