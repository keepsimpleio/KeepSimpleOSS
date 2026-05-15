import Button from '@uxcore/components/Button';
import Modal from '@uxcore/components/Modal';
import { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import styles from './PersonaDeleteModal.module.scss';

interface PersonaDeleteModalProps {
  confirmationModal: boolean;
  setConfirmationModal: (value: boolean) => void;
  cancelBtn?: string;
  deleteChosenPersona?: () => void;
  deleteBtn?: string;
  deletablePersonaName?: string;
}

const PersonaDeleteModal: FC<PersonaDeleteModalProps> = ({
  confirmationModal,
  setConfirmationModal,
  cancelBtn,
  deleteChosenPersona,
  deleteBtn,
  deletablePersonaName,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  return (
    <Modal
      size={'small'}
      onClick={() => setConfirmationModal(false)}
      close={confirmationModal}
      title={'Action confirmation'}
      hasBorder
      isConfirmationModal
    >
      {locale === 'en' ? (
        <p>
          You’re about to delete “<b>{deletablePersonaName}</b>” from your saved
          personas list. This action is irreversible. Are you sure?
        </p>
      ) : (
        <p>
          Вы собираетесь удалить Персону “<b>{deletablePersonaName}</b>” из
          списка сохраненных персон. Удаленные Персоны невозможно восстановить.
          Вы уверены?
        </p>
      )}

      <div className={styles.btnWrapper}>
        <Button label={cancelBtn} onClick={() => setConfirmationModal(false)} />
        <Button
          label={deleteBtn}
          onClick={deleteChosenPersona}
          type={'primary'}
        />
      </div>
    </Modal>
  );
};
export default PersonaDeleteModal;
