import Button from '@uxcore/components/Button';
import Modal from '@uxcore/components/Modal';
import Textarea from '@uxcore/components/Textarea';
import decisionTable from '@uxcore/data/decisionTable';
import { sanitizeHtml } from '@uxcore/lib/sanitizeHtml';
import { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import styles from './DecisionTableModal.module.scss';

type BiasUpdates = {
  reason?: string;
  method?: string;
  instruction?: string;
  biasId?: number;
};
type LoadFromLocalFunction = (key: string) => string | null;

type DecisionTableModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  key: number;
  updateBias: (id: number, updates: BiasUpdates) => void;
  id: number;
  reason?: string;
  method?: string;
  instruction?: string;
  biasName?: string;
  descriptionOfBias?: string;
  loggedIn?: boolean;
  setSelectedReason: (reason: string) => void;
  handleLoginToEditClick?: (
    localReason: string,
    localMethod: string,
    localInstruction: string,
    savedIDNumber?: number,
  ) => Promise<void>;
  placeHolderText?: string;
  saveBeforeLogin?: (save: boolean) => void;
  loadFromLocal: LoadFromLocalFunction;
  temporarySavedData?: boolean;
  setIsChangesUnsaved?: (isChangesUnsaved: string) => void;
  isGoogleRefferer?: boolean;
};

const DecisionTableModal = (props: DecisionTableModalProps) => {
  const [localReason, setLocalReason] = useState(props.reason);
  const [localMethod, setLocalMethod] = useState(props.method);
  const [localInstruction, setLocalInstruction] = useState(props.instruction);
  const { locale } = useRouter() as TRouter;

  const { tableTitles, saveTxt, cancelBtn, loginToEdit, title, biasNameTxt } =
    decisionTable[locale];

  const getTabTitles = tableTitles.map(tab => {
    return tab.title;
  });

  const instructions = getTabTitles[0];
  const reasons = getTabTitles[2];
  const methods = getTabTitles[3];
  const savedLocalID = props.loadFromLocal('savedIDNumber');
  const savedIDNumber = savedLocalID ? Number(savedLocalID) : null;

  const handleClose = () => {
    props.setShow(false);
  };

  const savedReason = props.loadFromLocal('localReason');
  const savedMethod = props.loadFromLocal('localMethod');
  const savedInstruction = props.loadFromLocal('localInstruction');

  useEffect(() => {
    if (savedIDNumber && props.id === savedIDNumber) {
      if (savedReason) setLocalReason(savedReason);
      if (savedMethod) setLocalMethod(savedMethod);
      if (savedInstruction) setLocalInstruction(savedInstruction);
      localStorage.removeItem('localReason');
      localStorage.removeItem('localMethod');
      localStorage.removeItem('localInstruction');
      localStorage.removeItem('savedIDNumber');
    }
  }, []);

  return (
    <Fragment>
      <Modal title={title} key={props.key} onClick={handleClose} hasBorder>
        <form>
          <div className={styles.toolTipWrapper}>
            <p
              className={styles.biasNameWrapper}
              data-tooltip-id={'bias-description'}
            >
              <span className={styles.biasNameTxt}>{biasNameTxt} </span>
              <span className={styles.biasName}>{props.biasName}</span>
            </p>

            <ReactTooltip
              className={styles.tooltip}
              id={'bias-description'}
              place={'top'}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(props.descriptionOfBias),
                }}
              />
            </ReactTooltip>
          </div>
          <Textarea
            label={instructions}
            className={styles.textArea}
            onChange={value => setLocalInstruction(value)}
            placeholder={props.placeHolderText}
            text={localInstruction}
          />
          <Textarea
            label={reasons}
            className={styles.textArea}
            onChange={value => setLocalReason(value)}
            placeholder={props.placeHolderText}
            text={localReason}
          />
          <Textarea
            label={methods}
            className={styles.textArea}
            onChange={value => setLocalMethod(value)}
            placeholder={props.placeHolderText}
            text={localMethod}
          />
          <div className={styles.modalBtns}>
            {!props.loggedIn && (
              <Fragment>
                <Button
                  label={loginToEdit}
                  onClick={() => {
                    props
                      .handleLoginToEditClick(
                        localReason,
                        localMethod,
                        localInstruction,
                        props.id,
                      )
                      .then(r => props.setSelectedReason(localReason));
                  }}
                />
                <Button label={cancelBtn} onClick={handleClose} />
              </Fragment>
            )}
            {props.loggedIn && (
              <Fragment>
                <Button label={cancelBtn} onClick={handleClose} />
                <Button
                  label={saveTxt}
                  onClick={() => {
                    props.updateBias(props.id, {
                      reason: localReason,
                      method: localMethod,
                      instruction: localInstruction,
                    });
                    handleClose();
                    props.setIsChangesUnsaved('unsaved');
                  }}
                  type={'primary'}
                />
              </Fragment>
            )}
          </div>
        </form>
      </Modal>
    </Fragment>
  );
};
export default DecisionTableModal;
