import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';

import { TRouter } from '@local-types/global';

import {
  isValidEmail,
  linkedInRegex,
  usernameRegex,
} from '@lib/settings-helpers';

import settingsData from '@data/settings';

import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import Input from '@components/Input';
import Modal from '@components/Modal';
import Textarea from '@components/Textarea';

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
  const [selectedTitle] = useState(defaultSelectedTitle);
  const [isValid, setIsValid] = useState({ username: true, linkedin: true });

  const {
    title,
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
      onClick={closeSettings}
      blackTitle
      hasHr
      removeBorderMobile
      fullSizeMobile
      wrapperClassName={cn(styles.ModalWrapper, {
        [styles.RuLocale]: currentLocale === 'ru',
      })}
      bodyClassName={styles.ModalBody}
    >
      <div className={styles.FieldsSection}>
        <div className={styles.FieldGroup}>
          <span className={styles.Label}>{usernameTxt}</span>
          <Textarea
            text={username}
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
        <div className={styles.FieldGroupWithVisibility}>
          <div className={styles.FieldGroup}>
            <span className={styles.Label}>{email}</span>
            <Input
              disabled
              placeholder={isValidEmail(currentEmail) ? currentEmail : ''}
            />
          </div>
          <Checkbox
            visibleTxt={visible}
            everyone={everyone}
            onlyYou={onlyYou}
            setRadioValue={setIsEmailPublic}
            radioValue={isEmailPublic}
          />
        </div>
        <div className={styles.FieldGroupWithVisibility}>
          <div className={styles.FieldGroup}>
            <span className={styles.Label}>{linkedIn}</span>
            <Textarea
              text={linkedInUrl}
              onChange={value => {
                setLinkedInUrl(value);
              }}
              validationFunction={validateLinkedIn}
              isValidCallback={v => handleValidation(v, 'linkedin')}
              showError={!isValid.linkedin}
              errorMessage={invalidLinkedIn}
            />
          </div>
          <Checkbox
            visibleTxt={visible}
            everyone={everyone}
            onlyYou={onlyYou}
            setRadioValue={setIsLinkedinPublic}
            radioValue={isLinkedinPublic}
          />
        </div>
      </div>
      <div className={styles.BtnWrapper}>
        <Button
          label={cancelBtn}
          onClick={closeSettings}
          className={styles.CancelBtn}
        />
        <Button
          label={saveBtn}
          onClick={() => {
            handleSave();
          }}
          variant="black"
          className={styles.SaveBtn}
          disabled={!isValid.username || !isValid.linkedin || !username}
        />
      </div>
    </Modal>
  );
};

export default SettingsModal;
