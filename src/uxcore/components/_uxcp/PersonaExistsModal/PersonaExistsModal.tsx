import cn from 'classnames';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import personaModals from '@data/personaModals';

import Button from '@uxcore/components/Button';
import Modal from '@uxcore/components/Modal';

import styles from './PersonaExistsModal.module.scss';

interface PersonaExistsModalProps {
  setPersonaExistWarning: (value: boolean) => void;
  overWriteText?: string;
  cancelBtn?: string;
  overwriteDecisionTableData?: () => void;
  personaName?: string;
}

const PersonaExistsModal: FC<PersonaExistsModalProps> = ({
  setPersonaExistWarning,
  overWriteText,
  overwriteDecisionTableData,
  cancelBtn,
  personaName,
}) => {
  const router = useRouter();
  const { locale } = router as TRouter;
  const { title } = personaModals[locale];
  const descriptions = {
    en: `Persona with the name "${personaName}" already exists. This action will overwrite the existing entry. Are you sure?`,
    ru: `Персона "${personaName}" уже существует. Перезаписать?`,
    hy: `"${personaName}" անունով պերսոնան արդեն գոյություն ունի։ Վստա՞հ եք, որ ցանկանում եք այն փոխարինել։`,
  };

  return (
    <Modal
      size={'small'}
      onClick={() => setPersonaExistWarning(false)}
      title={title}
      hasBorder
    >
      <div
        className={cn(styles.modalContent, {
          [styles.modalContentHy]: locale === 'hy',
        })}
      >
        <p> {descriptions[locale]}</p>

        <div className={styles.btnWrapper}>
          <Button
            label={cancelBtn}
            onClick={() => {
              setPersonaExistWarning(false);
            }}
          />
          <Button
            label={overWriteText}
            onClick={overwriteDecisionTableData}
            type={'primary'}
          />
        </div>
      </div>
    </Modal>
  );
};
export default PersonaExistsModal;
