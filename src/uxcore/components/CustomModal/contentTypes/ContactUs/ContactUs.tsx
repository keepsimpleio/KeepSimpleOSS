import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, useCallback, useState } from 'react';

import type { TRouter } from '@uxcore/local-types/global';

import useFormPopup from '@uxcore/hooks/useFormPopup';
import useSpinner from '@uxcore/hooks/useSpinner';

import { validateEmail } from '@uxcore/lib/helpers';

import { contactUsRequest } from '@uxcore/api/contactUs';

import contactUsData from '@data/contactUs';

import Button from '@uxcore/components/Button';
import Input from '@uxcore/components/Input';
import Textarea from '@uxcore/components/Textarea';

import styles from './ContactUs.module.scss';

type TContactUs = {
  closeModal: () => void;
};

const ContactUs: FC<TContactUs> = ({ closeModal }) => {
  const { togglePopupVisibiity } = useFormPopup()[0];
  const { setIsVisible } = useSpinner()[0];
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState({
    feedback: true,
    email: true,
  });

  const router = useRouter();
  const { locale } = router as TRouter;

  const handleChange = useCallback((v: string, type: 'feedback' | 'email') => {
    switch (type) {
      case 'feedback':
        setFeedback(v);
        break;
      case 'email':
        setEmail(v);
        break;
      default:
        break;
    }
  }, []);

  const handleValidation = useCallback(
    (value: boolean, type: 'feedback' | 'email') => {
      setIsValid({
        ...isValid,
        [type]: value,
      });
    },
    [isValid],
  );

  const handleSubmit = useCallback(async () => {
    setIsVisible(true);

    try {
      await contactUsRequest(feedback, email);
    } catch (err) {
      console.log('error');
    }

    togglePopupVisibiity();
    setIsVisible(false);
    closeModal();
  }, [feedback, email, setIsVisible]);

  const {
    feedbackLabel,
    feedbackError,
    emailLabel,
    emailPlaceholder,
    emailError,
    info1,
    info2,
    cancelButtonLabel,
    submitButtonLabel,
  } = contactUsData[locale];

  const isSubmitDisabled = Object.values(isValid).includes(false) || !feedback;

  return (
    <div
      className={cn(styles.ContactUs, {
        [styles.hyLang]: locale === 'hy',
      })}
    >
      <Textarea
        label={feedbackLabel}
        showError={!isValid.feedback}
        errorMessage={feedbackError}
        validationFunction={v => !!v}
        isValidCallback={v => handleValidation(v, 'feedback')}
        onChange={v => handleChange(v, 'feedback')}
      />
      <Input
        label={emailLabel}
        placeholder={emailPlaceholder}
        showMessage={!isValid.email}
        errorMessage={emailError}
        validationFunction={validateEmail}
        isValidCallback={v => handleValidation(v, 'email')}
        onChange={v => handleChange(v, 'email')}
      />
      <div className={styles.Footer}>
        <div className={styles.Content}>
          <span>
            {info1}{' '}
            <a href="https://www.linkedin.com/in/alexanyan/" target="_blank">
              LinkedIn
            </a>
            ,{' '}
            <a href="https://www.facebook.com/AlexanyanWolf" target="_blank">
              Facebook
            </a>
          </span>
          <br />
          <span>
            {info2} (
            <a href="mailto:alexanyanwolf@gmail.com" target="_blank">
              alexanyanwolf@gmail.com
            </a>
            )
          </span>
        </div>
        <div className={styles.Buttons}>
          <Button label={cancelButtonLabel} onClick={closeModal} />
          <Button
            label={submitButtonLabel}
            type="primary"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
