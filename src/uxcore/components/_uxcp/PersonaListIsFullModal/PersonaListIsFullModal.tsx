import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import personaModals from '@uxcore/data/personaModals';

import Button from '@uxcore/components/Button';
import Modal from '@uxcore/components/Modal';

import styles from './PersonaListIsFullModal.module.scss';

interface PersonaListIsFullModalProps {
  setMaximumReached: (value: boolean) => void;
  cancelBtn?: string;
  personasIsFull?: string;
  setOpenPersonas?: (openPersonas: boolean) => void;
}

const PersonaListIsFullModal: FC<PersonaListIsFullModalProps> = ({
  setMaximumReached,
  cancelBtn,
  personasIsFull,
  setOpenPersonas,
}) => {
  const { locale } = useRouter() as TRouter;
  const { listIsFull, savedPersonasTxt, personaLimit } = personaModals[locale];

  const openPersonas = () => {
    setOpenPersonas(true);
    setMaximumReached(false);
  };

  return (
    <Modal
      size={'small'}
      onClick={() => setMaximumReached(false)}
      title={listIsFull}
      hasBorder
    >
      <div>
        <p>
          {personaLimit}
          <span onClick={openPersonas} className={styles.savedPersonasModal}>
            {' '}
            {savedPersonasTxt}
          </span>
        </p>
        <div className={styles.cancelBtn}>
          <Button
            label={cancelBtn}
            onClick={() => {
              setMaximumReached(false);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
export default PersonaListIsFullModal;
