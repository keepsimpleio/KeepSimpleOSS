import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import { userInfoUpdate } from '@uxcore/api/uxcat/settings';

import genderModalData from '@data/genderModalData';

import Button from '@uxcore/components/Button';
import Modal from '@uxcore/components/Modal';

import styles from './GenderModal.module.scss';

type GenderModalProps = {
  token: string;
  onClose: () => void;
  askedGenderCount: boolean;
  defaultKonamiGender?: string;
};
const GenderModal: FC<GenderModalProps> = ({
  token,
  onClose,
  askedGenderCount,
  defaultKonamiGender,
}) => {
  const [isFemale, setIsFemale] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  const router = useRouter();
  const { locale } = router as TRouter;

  const { identifyAs, fancyBadges, male, female, gmail, selectGender, save } =
    genderModalData[locale];

  const genders = [
    {
      name: male,
      id: 'male',
    },
    {
      name: female,
      id: 'female',
    },
    {
      name: gmail,
      id: 'gmail',
    },
  ];

  const handleGenderSelect = e => {
    const currentGender = e.target.value;

    if (currentGender === 'gmail') {
      setSelectedGender('male');
    }
    if (currentGender === 'female') {
      setSelectedGender('female');
    } else {
      setSelectedGender('male');
    }
  };

  const updateUserInfo = async (gender = undefined, isClosed = false) => {
    try {
      await userInfoUpdate(
        token,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        gender,
        undefined,
        isClosed,
      );
      onClose();
    } catch (error) {
      console.error('Failed to update user info:', error);
      throw error;
    }
  };

  const handleSaveGender = () =>
    defaultKonamiGender ? null : updateUserInfo(selectedGender);
  const handleModalClose = () =>
    defaultKonamiGender ? null : updateUserInfo(undefined, true);
  const setDefaultAsGmail = () =>
    defaultKonamiGender ? null : updateUserInfo('male', true);

  useEffect(() => {
    if (defaultKonamiGender) {
      setIsFemale(defaultKonamiGender);
    }
  }, [defaultKonamiGender]);

  return (
    <Modal
      size={'small'}
      title={identifyAs}
      onClick={askedGenderCount ? setDefaultAsGmail : handleModalClose}
      wrapperClassName={styles.modalWrapper}
    >
      <div className={styles.modalBody}>
        <span className={styles.fancyBadges}> {fancyBadges} </span>
        <div className={styles.container}>
          <span className={styles.genderSelect}> {selectGender}</span>
          {genders.map((gender, index) => {
            return (
              <div className={styles.selection} key={index}>
                <label className={styles.container}>
                  <input
                    type="radio"
                    value={gender.id}
                    checked={isFemale === gender.id}
                    onChange={e => handleGenderSelect(e)}
                    className={styles.checkbox}
                    onClick={() => setIsFemale(gender.id)}
                  />
                  <span className={styles.checkmark}></span>
                </label>
                {gender.name}
              </div>
            );
          })}
        </div>
        <div className={styles.btnWrapper}>
          <Button label={save} onClick={handleSaveGender} type={'primary'} />
        </div>
      </div>
    </Modal>
  );
};

export default GenderModal;
