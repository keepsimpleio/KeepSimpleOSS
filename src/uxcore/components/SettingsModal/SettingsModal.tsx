import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import { isValidEmail, linkedInRegex, usernameRegex } from '@uxcore/lib/uxcat-helpers';

import settingsData from '@data/uxcat/settings';

import Button from '@uxcore/components/Button';
import Checkbox from '@uxcore/components/Checkbox';
import Dropdown from '@uxcore/components/Dropdown';
import Input from '@uxcore/components/Input';
import Modal from '@uxcore/components/Modal';
import Textarea from '@uxcore/components/Textarea';

import styles from './SettingsModal.module.scss';

type SettingsModalProps = {
  setOpenSettings: (openSettings: boolean) => void;
  currentUsername: string;
  currentEmail: string;
  defaultSelectedTitle?: string;
  mailStatus?: boolean;
  linkedin?: string;
  linkedinStatus?: boolean;
  changeTitlePermission?: boolean;
  usernameIsTakenError?: string;
  setUsernameIsTakenError: (usernameIsTakenError: string) => void;
  setChangedTitle: (selected: boolean) => void;
  handleSaveClick: (
    username: string,
    linkedInUrl: string,
    isEmailPublic: string,
    isLinkedinPublic: string,
    title?: string,
  ) => void;
};

const SettingsModal: FC<SettingsModalProps> = ({
  setOpenSettings,
  currentUsername,
  handleSaveClick,
  currentEmail,
  mailStatus,
  linkedinStatus,
  linkedin,
  usernameIsTakenError,
  setUsernameIsTakenError,
  defaultSelectedTitle,
  changeTitlePermission,
  setChangedTitle,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const [isEmailPublic, setIsEmailPublic] = useState(
    !!mailStatus ? 'everyone' : 'onlyMe',
  );
  const [isLinkedinPublic, setIsLinkedinPublic] = useState(
    !!linkedinStatus ? 'everyone' : 'onlyMe',
  );
  const [username, setUsername] = useState(currentUsername);
  const [linkedInUrl, setLinkedInUrl] = useState(linkedin);
  const [selectedTitle, setSelectedTitle] = useState(defaultSelectedTitle);
  const [isValid, setIsValid] = useState({ username: true, linkedin: true });

  const {
    title,
    selectTitle,
    usernameTxt,
    email,
    visible,
    everyone,
    onlyYou,
    linkedIn,
    saveBtn,
    cancelBtn,
    usernameValidationMessage,
    invalidLinkedIn,
  } = settingsData[currentLocale];

  const userTitlesEn = ['Enlightened', 'Professor', 'Greatest'];
  const userTitlesRu = ['Просвещенный', 'Профессор', 'Великий'];
  const userTitles = locale === 'ru' ? userTitlesRu : userTitlesEn;

  const closeSettings = () => {
    setOpenSettings(false);
    setUsernameIsTakenError('');
  };

  const validateUsername = (username: string) => {
    if (username.trim() === '') {
      return false;
    }
    return usernameRegex.test(username);
  };

  const validateLinkedIn = (linkedInUrl: string) => {
    return linkedInRegex.test(linkedInUrl);
  };

  const handleValidation = useCallback(
    (value: boolean, type: 'username' | 'linkedin') => {
      setIsValid(prevIsValid => ({
        ...prevIsValid,
        [type]: value,
      }));
    },
    [isValid],
  );

  const handleSave = () => {
    if (isValid.username && isValid.linkedin) {
      handleSaveClick(
        username,
        linkedInUrl,
        isEmailPublic,
        isLinkedinPublic,
        changeTitlePermission ? selectedTitle : undefined,
      );
    }
    setChangedTitle && setChangedTitle(true);
  };

  return (
    <Modal
      title={title}
      hasBorder
      onClick={closeSettings}
      blackTitle
      removeBorderMobile
      fullSizeMobile
      bodyClassName={styles.modalBody}
    >
      <div>
        {changeTitlePermission && (
          <div>
            <h4 className={styles.title}>{selectTitle}</h4>
            <Dropdown
              selected={defaultSelectedTitle}
              values={userTitles}
              sendingValues={userTitlesEn}
              isWide
              className={styles.dropdownArrow}
              onChange={value => {
                setSelectedTitle(value);
              }}
            />
          </div>
        )}
        <div>
          <h4 className={styles.username}>{usernameTxt}</h4>
          <Textarea
            text={username}
            className={styles.usernameEdit}
            onChange={value => {
              setUsername(value);
              if (usernameIsTakenError) setUsernameIsTakenError('');
            }}
            validationFunction={validateUsername}
            isValidCallback={v => handleValidation(v, 'username')}
            showError={!isValid.username || !!usernameIsTakenError}
            errorMessage={
              usernameIsTakenError
                ? usernameIsTakenError
                : usernameValidationMessage
            }
          />
        </div>
        <div>
          <h4 className={styles.email}> {email}</h4>
          <Input
            disabled
            placeholder={isValidEmail(currentEmail) ? currentEmail : ''}
          />
          <Checkbox
            visibleTxt={visible}
            everyone={everyone}
            onlyYou={onlyYou}
            setRadioValue={setIsEmailPublic}
            radioValue={isEmailPublic}
          />
        </div>
        <div>
          <h4 className={styles.linkedin}> {linkedIn}</h4>
          <Textarea
            text={linkedInUrl}
            className={styles.usernameEdit}
            onChange={value => {
              setLinkedInUrl(value);
            }}
            validationFunction={validateLinkedIn}
            isValidCallback={v => handleValidation(v, 'linkedin')}
            showError={!isValid.linkedin}
            errorMessage={invalidLinkedIn}
          />
          <Checkbox
            visibleTxt={visible}
            everyone={everyone}
            onlyYou={onlyYou}
            setRadioValue={setIsLinkedinPublic}
            radioValue={isLinkedinPublic}
          />
        </div>
        <div className={styles.btnWrapper}>
          <Button
            label={cancelBtn}
            onClick={closeSettings}
            className={styles['btn']}
          />
          <Button
            label={saveBtn}
            onClick={() => {
              handleSave();
            }}
            type="primary"
            className={styles['btn']}
            disabled={!isValid.username || !isValid.linkedin || !username}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
