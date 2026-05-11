import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, FormEvent, useContext, useState } from 'react';

import { deleteRedirectCookie, getRedirectCookie } from '@lib/cookies';

import { completeMagicLinkRegistration, storeJwtSession } from '@api/auth';

import auth from '@data/auth';

import { GlobalContext } from '@components/Context/GlobalContext';

import styles from './MagicLinkProfileForm.module.scss';

interface MagicLinkProfileFormProps {
  registrationToken: string;
  email: string;
  className?: string;
}

const MagicLinkProfileForm: FC<MagicLinkProfileFormProps> = ({
  registrationToken,
  email,
  className,
}) => {
  const { setAccountData, setToken } = useContext(GlobalContext) as any;
  const router = useRouter();
  const locale = router.locale === 'ru' ? 'ru' : 'en';
  const copy = auth[locale].profileForm;
  const consumeCopy = auth[locale].consumePage;

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInvalidated, setTokenInvalidated] = useState(false);

  const trimmedName = name.trim();
  const trimmedSurname = surname.trim();
  const isDisabled = !trimmedName || !trimmedSurname || submitting;

  const handleRequestNew = () => {
    router.push('/');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled) return;
    setError(null);
    setSubmitting(true);

    const result = await completeMagicLinkRegistration({
      registrationToken,
      name: trimmedName,
      surname: trimmedSurname,
    });

    if (result.ok) {
      const { jwt, user } = result.data;
      storeJwtSession(jwt, user, setAccountData, setToken);
      const redirectUrl = getRedirectCookie() || '/uxcore';
      deleteRedirectCookie();
      window.location.href = redirectUrl;
      return;
    }

    setSubmitting(false);

    // strict mode is off, so the union doesn't narrow on `ok`. `'code' in
    // result` narrows to the failure variant.
    if ('code' in result) {
      if (result.code === 'INVALID_REGISTRATION_TOKEN') {
        setTokenInvalidated(true);
        return;
      }
      if (result.status === 409 || result.code === 'EMAIL_ALREADY_REGISTERED') {
        // Send the user back to the LogIn modal entry. Encode the localized
        // "account already exists" message in the URL so the modal surfaces
        // it on next open.
        const message = encodeURIComponent(consumeCopy.accountAlreadyExists);
        router.push(`/?authError=${message}`);
        return;
      }
    }
    setError(copy.invalidProfile);
  };

  if (tokenInvalidated) {
    return (
      <div
        className={cn(styles.form, className)}
        data-cy="magic-link-profile-token-invalid"
      >
        <h2 className={styles.heading}>{copy.invalidRegistrationToken}</h2>
        <button
          type="button"
          className={styles.requestNewLink}
          onClick={handleRequestNew}
          data-cy="magic-link-profile-request-new"
        >
          {copy.requestNewLink}
        </button>
      </div>
    );
  }

  return (
    <form
      className={cn(styles.form, className)}
      onSubmit={handleSubmit}
      data-cy="magic-link-profile-form"
      noValidate
    >
      <h2 className={styles.heading}>{copy.heading}</h2>
      <p className={styles.body}>
        {copy.body} <span className={styles.email}>{email}</span>
      </p>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="magic-link-name">
          {copy.nameLabel}
        </label>
        <input
          id="magic-link-name"
          type="text"
          className={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={copy.namePlaceholder}
          autoComplete="given-name"
          required
          data-cy="magic-link-profile-name"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="magic-link-surname">
          {copy.surnameLabel}
        </label>
        <input
          id="magic-link-surname"
          type="text"
          className={styles.input}
          value={surname}
          onChange={e => setSurname(e.target.value)}
          placeholder={copy.surnamePlaceholder}
          autoComplete="family-name"
          required
          data-cy="magic-link-profile-surname"
        />
      </div>

      {error && (
        <p className={styles.error} data-cy="magic-link-profile-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={isDisabled}
        data-cy="magic-link-profile-submit"
      >
        {submitting ? copy.submitting : copy.submit}
      </button>
    </form>
  );
};

export default MagicLinkProfileForm;
