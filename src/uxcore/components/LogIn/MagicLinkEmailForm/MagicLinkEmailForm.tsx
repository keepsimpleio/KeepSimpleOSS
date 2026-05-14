import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, FormEvent, useState } from 'react';

import { requestMagicLink } from '@uxcore/api/auth';

import auth from '@uxcore/data/auth';

import styles from './MagicLinkEmailForm.module.scss';

interface MagicLinkEmailFormProps {
  className?: string;
  initialError?: string;
}

type Status = 'idle' | 'submitting' | 'sent' | 'limitReached' | 'invalidEmail';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MagicLinkEmailForm: FC<MagicLinkEmailFormProps> = ({
  className,
  initialError,
}) => {
  const router = useRouter();
  const locale: 'en' | 'ru' | 'hy' =
    router.locale === 'ru' || router.locale === 'hy' ? router.locale : 'en';
  const copy = auth[locale].magicLinkForm;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialError || null,
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_REGEX.test(trimmed)) {
      setStatus('invalidEmail');
      setErrorMessage(copy.invalidEmail);
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    const result = await requestMagicLink({ email: trimmed, locale });

    if (result.ok) {
      setStatus('sent');
      return;
    }

    // strict mode is off in this project, so the union doesn't narrow on `ok`.
    // `'code' in result` narrows to the failure variant.
    if ('code' in result) {
      if (result.status === 429 || result.code === 'LIMIT_REACHED') {
        setStatus('limitReached');
        return;
      }

      if (result.status === 400) {
        setStatus('invalidEmail');
        setErrorMessage(copy.invalidEmail);
        return;
      }
    }

    // Any other error: surface as inline validation so the user can retry.
    setStatus('invalidEmail');
    setErrorMessage(copy.invalidEmail);
  };

  if (status === 'sent') {
    return (
      <div
        className={cn(styles.confirmation, className)}
        data-cy="magic-link-sent"
        role="status"
      >
        <h3 className={styles.confirmationHeading}>{copy.sentHeading}</h3>
        <p className={styles.confirmationBody}>{copy.sentBody}</p>
      </div>
    );
  }

  if (status === 'limitReached') {
    return (
      <p
        className={cn(styles.banner, className)}
        data-cy="magic-link-limit-reached"
        role="alert"
      >
        {copy.limitReached}
      </p>
    );
  }

  return (
    <div className={cn(styles.wrapper, className)}>
      <p className={styles.divider}>{copy.divider}</p>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        data-cy="magic-link-email-form"
        noValidate
      >
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="magic-link-email">
            {copy.emailLabel}
          </label>
          <input
            id="magic-link-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={styles.input}
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (status === 'invalidEmail') {
                setStatus('idle');
                setErrorMessage(null);
              }
            }}
            placeholder={copy.emailPlaceholder}
            required
            data-cy="magic-link-email-input"
          />
        </div>
        {errorMessage && (
          <p className={styles.error} data-cy="magic-link-email-error">
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          className={styles.submit}
          disabled={status === 'submitting'}
          data-cy="magic-link-email-submit"
        >
          {status === 'submitting' ? copy.submitting : copy.submit}
        </button>
      </form>
    </div>
  );
};

export default MagicLinkEmailForm;
