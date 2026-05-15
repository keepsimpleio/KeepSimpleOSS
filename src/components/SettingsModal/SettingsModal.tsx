import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';

import { TRouter } from '@local-types/global';

import {
  isTwitterPlaceholderEmail,
  isValidEmail,
  linkedInRegex,
  usernameRegex,
} from '@lib/settings-helpers';

import { requestTwitterEmailChange } from '@api/auth';

import authData from '@data/auth';
import settingsData from '@data/settings';

import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import Input from '@components/Input';
import Modal from '@components/Modal';
import Textarea from '@components/Textarea';

import styles from './SettingsModal.module.scss';

type EmailChangeStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'sent'; email: string }
  | { kind: 'error'; message: string };

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
  provider?: string;
  token?: string | null;
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
  provider,
  token,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const currentLocale = locale === 'ru' ? 'ru' : 'en';
  const showEmailChange =
    provider === 'twitter' && isTwitterPlaceholderEmail(currentEmail);
  const emailChangeCopy = authData[currentLocale].emailChange.settings;
  const [isEmailPublic, setIsEmailPublic] = useState(
    !!mailStatus ? 'everyone' : 'onlyMe',
  );
  const [isLinkedinPublic, setIsLinkedinPublic] = useState(
    !!linkedinStatus ? 'everyone' : 'onlyMe',
  );
  const [username, setUsername] = useState(currentUsername);
  const [linkedInUrl, setLinkedInUrl] = useState(linkedin);
  const [emailValue, setEmailValue] = useState('');
  const [emailFieldValid, setEmailFieldValid] = useState(true);
  const [emailChangeStatus, setEmailChangeStatus] = useState<EmailChangeStatus>(
    { kind: 'idle' },
  );
  const [selectedTitle] = useState(defaultSelectedTitle);
  const [isValid, setIsValid] = useState({
    username: true,
    linkedin: true,
  });

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
    emailPlaceholder,
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
    [],
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

  const handleSendConfirmation = async () => {
    const trimmed = emailValue.trim();
    if (!isValidEmail(trimmed)) {
      setEmailFieldValid(false);
      setEmailChangeStatus({
        kind: 'error',
        message: emailChangeCopy.invalidEmail,
      });
      return;
    }
    if (!token) {
      setEmailChangeStatus({
        kind: 'error',
        message: emailChangeCopy.generic,
      });
      return;
    }
    setEmailChangeStatus({ kind: 'submitting' });
    const result = await requestTwitterEmailChange({
      email: trimmed,
      locale: currentLocale,
      token,
    });
    if (result.ok) {
      setEmailChangeStatus({ kind: 'sent', email: trimmed });
      return;
    }
    if ('code' in result) {
      if (result.code === 'INVALID_EMAIL') {
        setEmailChangeStatus({
          kind: 'error',
          message: emailChangeCopy.invalidEmail,
        });
        return;
      }
      if (result.code === 'EMAIL_ALREADY_REGISTERED' || result.status === 409) {
        setEmailChangeStatus({
          kind: 'error',
          message: emailChangeCopy.emailAlreadyRegistered,
        });
        return;
      }
      if (result.code === 'LIMIT_REACHED' || result.status === 429) {
        setEmailChangeStatus({
          kind: 'error',
          message: emailChangeCopy.limitReached,
        });
        return;
      }
      if (result.code === 'EMAIL_CHANGE_NOT_ALLOWED' || result.status === 403) {
        setEmailChangeStatus({
          kind: 'error',
          message: emailChangeCopy.notAllowed,
        });
        return;
      }
    }
    setEmailChangeStatus({
      kind: 'error',
      message: emailChangeCopy.generic,
    });
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
        {showEmailChange ? (
          <div className={styles.FieldGroup}>
            <span className={styles.Label}>{email}</span>
            <p
              className={styles.emailChangeDescription}
              data-cy="twitter-email-change-description"
            >
              {emailChangeCopy.description}
            </p>
            {emailChangeStatus.kind === 'sent' ? (
              <p
                className={styles.emailChangeSent}
                role="status"
                data-cy="twitter-email-change-sent"
              >
                {emailChangeCopy.sent.replace(
                  '{email}',
                  emailChangeStatus.email,
                )}
              </p>
            ) : (
              <>
                <Input
                  value={emailValue}
                  placeholder={emailPlaceholder}
                  onChange={value => {
                    setEmailValue(value);
                    if (!emailFieldValid) setEmailFieldValid(true);
                    if (emailChangeStatus.kind === 'error') {
                      setEmailChangeStatus({ kind: 'idle' });
                    }
                  }}
                  validationFunction={isValidEmail}
                  isValidCallback={setEmailFieldValid}
                  showMessage={
                    !emailFieldValid || emailChangeStatus.kind === 'error'
                  }
                  errorMessage={
                    emailChangeStatus.kind === 'error'
                      ? emailChangeStatus.message
                      : emailChangeCopy.invalidEmail
                  }
                />
                <Button
                  label={
                    emailChangeStatus.kind === 'submitting'
                      ? emailChangeCopy.submitting
                      : emailChangeCopy.submit
                  }
                  onClick={handleSendConfirmation}
                  variant="black"
                  className={styles.sendConfirmationBtn}
                  disabled={
                    emailChangeStatus.kind === 'submitting' ||
                    !emailValue.trim()
                  }
                />
              </>
            )}
          </div>
        ) : (
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
        )}
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
