import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, Fragment, useContext, useState } from 'react';

import { TRouter } from '@uxcore/local-types/global';

import { deletePersona } from '@uxcore/api/personas';

import decisionTable from '@uxcore/data/decisionTable';

import PersonaDeleteModal from '@uxcore/components/_uxcp/PersonaDeleteModal';
import Button from '@uxcore/components/Button';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import Modal from '@uxcore/components/Modal';

import styles from './SavedPersonas.module.scss';

type personas = {
  id: number;
  name: string;
  publishedAt: string;
  updatedAt: string;
};

interface SavedPersonasProps {
  personaTableTitles: string[];
  savedPersonas?: personas[];
  setOpenPersonas?: (openPersonas: boolean) => void;
  setSavedPersonas?: (savedPersonas: personas[]) => void;
  changedUsername?: string;
}

const SavedPersonas: FC<SavedPersonasProps> = ({
  personaTableTitles,
  savedPersonas,
  setOpenPersonas,
  setSavedPersonas,
  changedUsername,
}) => {
  const [deletePersonaById, setDeletePersonaById] = useState(null);
  const [deletePersonaName, setDeletePersonaName] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [copyStatuses, setCopyStatuses] = useState({});

  const router = useRouter();
  const { locale } = router as TRouter;
  const {
    open,
    savedPersonasText,
    deleteBtn,
    cancelBtn,
    closeBtn,
    copyLink,
    copiedTxt,
    availablePersonasTxt,
  } = decisionTable[locale];
  const { accountData } = useContext(GlobalContext);

  function getDateFromISO(isoString) {
    return isoString.split('T')[0];
  }

  const emptyBlocks = [
    {
      id: 1,
      name: ' ',
      publishedAt: '',
      updatedAt: '',
    },
  ];
  const emptyTableArray = Array.from(
    { length: 10 - savedPersonas?.length },
    () => ({ ...emptyBlocks[0] }),
  );

  const copyToClipboard = id => {
    const urlToCopy = `${process.env.NEXT_PUBLIC_DOMAIN}/user/${accountData?.username}/${id}`;

    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => {
        setCopyStatuses(prevStatuses => ({
          ...prevStatuses,
          [id]: copiedTxt,
        }));

        setTimeout(() => {
          setCopyStatuses(prevStatuses => ({
            ...prevStatuses,
            [id]: copyLink,
          }));
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy the URL:', err);
      });
  };

  const getLabel = id => {
    return copyStatuses[id] || copyLink;
  };

  const handleClose = () => setOpenPersonas(false);

  const deleteChosenPersona = () => {
    if (deletePersonaById) {
      deletePersona(deletePersonaById).then(r => {
        console.log(r);
        const updatedPersonas = savedPersonas.filter(
          persona => persona.id !== deletePersonaById,
        );
        setSavedPersonas(updatedPersonas);
        setDeletePersonaById(null);
      });
    }
    setConfirmationModal(false);
  };

  return (
    <>
      {!!savedPersonas && (
        <Modal
          size={'medium'}
          onClick={handleClose}
          hasBorder
          title={savedPersonasText}
        >
          <span
            className={styles.savedPersonasTxt}
          >{`${availablePersonasTxt} ${savedPersonas?.length}/10`}</span>
          <table className={styles.table}>
            <thead>
              <tr>
                {personaTableTitles.map((el, key) => {
                  return <th key={key}>{el}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {savedPersonas?.map((val, key) => {
                const publish =
                  !!val?.publishedAt &&
                  new Date(getDateFromISO(val?.publishedAt));
                const update =
                  !!val?.updatedAt && new Date(getDateFromISO(val?.updatedAt));
                const publishedDate = format(publish, 'd MMMM yyyy');
                const updatedDate = format(update, 'd MMMM yyyy');

                return (
                  <Fragment key={key}>
                    <tr>
                      <td>
                        <p className={styles.tableText}>{val.name}</p>
                      </td>
                      <td>
                        <p className={styles.tableText}>{publishedDate}</p>
                      </td>
                      <td>
                        <p className={styles.tableText}>{updatedDate}</p>
                      </td>
                      <td className={styles.btnWrapper}>
                        <a>
                          <Link
                            legacyBehavior
                            href={`/user/${changedUsername ? changedUsername : accountData?.username}/${val.id}`}
                          >
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.openLink}
                            >
                              {open}
                            </a>
                          </Link>
                          <Image
                            src={'/assets/biases/open-link-icon.svg'}
                            width={10}
                            height={10}
                            alt={'Open link icon'}
                          />
                        </a>
                        <Button
                          key={val.id}
                          label={getLabel(val.id)}
                          onClick={() => copyToClipboard(val.id)}
                          className={styles.copyBtn}
                        />
                        <button
                          className={styles.deleteBtn}
                          onClick={() => {
                            setDeletePersonaById(val.id);
                            setConfirmationModal(true);
                            setDeletePersonaName(val.name);
                          }}
                        >
                          {deleteBtn}
                        </button>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
              {emptyTableArray.map((val, key) => {
                return (
                  <Fragment key={key}>
                    <tr className={styles.emptyLine}>
                      <td>
                        <p className={styles.tableText}>{val.name}</p>
                      </td>
                      <td>
                        <p className={styles.tableText}>
                          {getDateFromISO(val.publishedAt)}
                        </p>
                      </td>
                      <td>
                        <p className={styles.tableText}>
                          {getDateFromISO(val.updatedAt)}
                        </p>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          <div className={styles.cancelBtn}>
            <Button label={closeBtn} onClick={handleClose} type={'primary'} />
          </div>
        </Modal>
      )}
      {confirmationModal && (
        <PersonaDeleteModal
          confirmationModal={confirmationModal}
          setConfirmationModal={setConfirmationModal}
          cancelBtn={cancelBtn}
          deleteChosenPersona={deleteChosenPersona}
          deleteBtn={deleteBtn}
          deletablePersonaName={deletePersonaName}
        />
      )}
    </>
  );
};

export default SavedPersonas;
