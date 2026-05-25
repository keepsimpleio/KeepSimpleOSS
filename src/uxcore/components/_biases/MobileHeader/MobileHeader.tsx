import { getMyInfo } from '@uxcore/api/strapi';
import { userInfoUpdate } from '@uxcore/api/uxcat/settings';
import { getUserInfo } from '@uxcore/api/uxcat/users-me';
import MoonIcon from '@uxcore/assets/icons/MoonIcon';
import PodcastIcon from '@uxcore/assets/icons/PodcastIcon';
import SunIcon from '@uxcore/assets/icons/SunIcon';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import LanguageSwitcher from '@uxcore/components/LanguageSwitcher';
import SettingsModal from '@uxcore/components/SettingsModal';
import UserDropdown from '@uxcore/components/UserDropdown';
import toolHeaderData from '@uxcore/data/toolHeader';
import useGlobals from '@uxcore/hooks/useGlobals';
import { isLevelMilestone } from '@uxcore/lib/uxcat-helpers';
import type { TRouter } from '@uxcore/local-types/global';
import { UserTypes } from '@uxcore/local-types/uxcat-types/types';
import cn from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useMemo, useState } from 'react';

import styles from './MobileHeader.module.scss';

type MobileHeaderProps = {
  setHeaderPodcastOpen?: (updater: (prev: boolean) => boolean) => void;
  setUpdatedSettingsInfo?: (data: UserTypes) => void;
  isPodcastOpen?: boolean;
  changeUserUrl?: boolean;
  instantSave?: boolean;
  isUserProfile?: boolean;
  setSelectedTitle?: (title: string) => void;
  disablePageSwitcher?: boolean;
  userInfo: UserTypes;
  setUserInfo: (data: UserTypes) => void;
  setUpdatedUsername?: (username: string) => void;
  blockLanguageSwitcher?: boolean;
};
const MobileHeader: FC<MobileHeaderProps> = ({
  setHeaderPodcastOpen,
  isPodcastOpen,
  changeUserUrl,
  setSelectedTitle,
  isUserProfile,
  disablePageSwitcher,
  userInfo,
  setUserInfo,
  setUpdatedUsername,
  blockLanguageSwitcher,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { accountData, setAccountData } = useContext(GlobalContext);
  const [{ toggleIsDarkTheme }, { isDarkTheme }] = useGlobals();
  const { usernameIsTaken, settingsTxt, myProfileTxt } = toolHeaderData[locale];
  const imageSrc = useMemo(() => accountData?.picture, [accountData]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [usernameIsTakenError, setUsernameIsTakenError] = useState('');
  const [changedTitle, setChangedTitle] = useState(false);
  const changeTitlePermission = isLevelMilestone(userInfo?.level, 13);

  const currentUsername = accountData
    ? accountData.username
    : accountData?.username;

  const currentEmail = accountData && accountData.email;

  const publicEmail = accountData && accountData.publicEmail;

  const linkedIn = userInfo?.user?.linkedin
    ? userInfo?.user?.linkedin
    : userInfo?.linkedin;

  const linkedInStatus = accountData
    ? accountData.publicLinkedin
    : accountData?.publicLinkedin;

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

  const title = changedTitle ? userInfo?.title : userInfo?.title;
  const openPodcast = () => {
    setHeaderPodcastOpen(prev => !prev);
  };

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
      setUpdatedUsername && setUpdatedUsername(username);
    } catch (error) {
      setOpenSettings(true);
      setUsernameIsTakenError(usernameIsTaken);
    }
  };

  useEffect(() => {
    const token =
      (typeof window !== undefined && localStorage.getItem('accessToken')) ||
      localStorage.getItem('googleToken');
    setToken(token);
  }, []);

  useEffect(() => {
    if (isUserProfile) {
      setSelectedTitle &&
        setSelectedTitle(locale === 'en' ? title : russianTitles(title));
    }
  }, [title, locale]);

  return (
    <div
      className={cn(styles.MobileHeader, {
        [styles.disablePageSwitcher]: disablePageSwitcher,
      })}
    >
      <div className={styles.SiteName}>
        <a href={`/${locale === 'ru' ? 'ru' : ''}`} target="_self">
          <Image
            src={
              isDarkTheme
                ? '/assets/logos/keepsimpleDark.svg'
                : '/assets/logos/keepsimple.svg'
            }
            alt="keepsimple logo"
            width={130.61}
            height={25.87}
            className={styles.logo}
          />
        </a>
      </div>
      <div className={styles.Actions}>
        {router.pathname === '/uxcore' && locale !== 'hy' && (
          <div
            className={cn(styles.PodcastWrapper, {
              [styles.active]: isPodcastOpen,
            })}
            onClick={openPodcast}
          >
            <PodcastIcon />
          </div>
        )}
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
          {isDarkTheme ? <SunIcon /> : <MoonIcon />}
        </button>
        <LanguageSwitcher
          withFlag
          withText={false}
          blockLanguageSwitcher={blockLanguageSwitcher}
        />
        <UserDropdown
          userName={currentUsername}
          userImage={imageSrc}
          showDropdown={showDropdown}
          isLoggedIn={!!accountData}
          setShowDropdown={setShowDropdown}
          setAccountData={setAccountData}
          handleOpenSettings={handleOpenSettings}
          settingsTxt={settingsTxt}
          myProfileTxt={myProfileTxt}
        />
      </div>
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
          defaultSelectedTitle={locale === 'en' ? title : russianTitles(title)}
          changeTitlePermission={changeTitlePermission}
          setChangedTitle={setChangedTitle}
        />
      )}
    </div>
  );
};

export default MobileHeader;
