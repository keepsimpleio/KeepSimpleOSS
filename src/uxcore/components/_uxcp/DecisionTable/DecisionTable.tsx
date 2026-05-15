import Checkmark from '@uxcore/assets/icons/Checkmark';
import ExportIcon from '@uxcore/assets/icons/ExportIcon';
import FullScreenIcon from '@uxcore/assets/icons/FullScreenIcon';
import InfoIcon from '@uxcore/assets/icons/InfoIcon';
import PictureIcon from '@uxcore/assets/icons/PictureIcon';
import DecisionTableModal from '@uxcore/components/_uxcp/DecisionTableModal/DecisionTableModal';
import LogInModal from '@uxcore/components/_uxcp/LogInModal';
import Pagination from '@uxcore/components/_uxcp/Pagination';
import PersonaListIsFullModal from '@uxcore/components/_uxcp/PersonaListIsFullModal';
import TabHeader from '@uxcore/components/_uxcp/TabHeader/TabHeader';
import Table from '@uxcore/components/_uxcp/Table/Table';
import Button from '@uxcore/components/Button';
import ContentParser from '@uxcore/components/ContentParser';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import Modal from '@uxcore/components/Modal';
import Tooltip from '@uxcore/components/Tooltip';
import decisionTable from '@uxcore/data/decisionTable';
import placeholderText from '@uxcore/data/decisionTable/placeholder';
import useMobile from '@uxcore/hooks/useMobile';
import { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, {
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import styles from './DecisionTable.module.scss';

type LoadFromLocalFunction = (key: string) => string | null;

type DecisionTableProps = {
  selectedBiasList: {
    title: string;
    id: number;
    name: string;
    method: string;
    reason: string;
    instruction: string;
    descriptionOfBias: string;
  }[];
  saved?: boolean;
  errorMessage?: string;
  selectedReason?: string;
  selectedMethod?: string;
  removableBiasId?: number;
  firstSaveClick?: boolean;
  maxPersonaQuantity?: number;
  selectedInstruction?: string;
  saveDecisionTableData?: () => void;
  setSelectedBiasesDetails?: any;
  overwriteDecisionTableData?: () => void;
  setFirstSaveClick?: (firstSaveClick: boolean) => void;
  setSelectedMethod?: (method: string) => void;
  setSelectedInstruction?: (instruction: string) => void;
  setSelectedReason?: (reason: string) => void;
  setBiasWillBeRemoved?: (biasWillBeRemoved: string) => void;
  setOpenPersonas?: (openPersonas: boolean) => void;
  handleLoginToEditClick?: (
    localReason: string,
    localMethod: string,
    localInstruction: string,
    savedIDNumber: number,
  ) => Promise<void>;
  isMatchedPersonaName?: boolean;
  setPersonaExistWarning?: (personaExistWarning: boolean) => void;
  loadFromLocal?: LoadFromLocalFunction;
  temporarySavedData?: boolean;
  setIsChangesUnsaved?: (isChangesUnsaved: string) => void;
  setShow?: any;
  show?: boolean;
  isGoogleRefferer?: boolean;
};

const DecisionTable: FC<DecisionTableProps> = ({
  selectedBiasList,
  selectedReason,
  setSelectedReason,
  setSelectedBiasesDetails,
  setSelectedMethod,
  setSelectedInstruction,
  selectedMethod,
  selectedInstruction,
  saved,
  saveDecisionTableData,
  removableBiasId,
  errorMessage,
  maxPersonaQuantity,
  setBiasWillBeRemoved,
  overwriteDecisionTableData,
  setFirstSaveClick,
  setIsChangesUnsaved,
  firstSaveClick,
  temporarySavedData,
  loadFromLocal,
  setOpenPersonas,
  handleLoginToEditClick,
  isMatchedPersonaName,
  setPersonaExistWarning,
  setShow,
  show,
  isGoogleRefferer,
}) => {
  const [selectedId, setSelectedId] = useState(0);
  const [tempSelectedId, setTempSelectedId] = useState(0);
  const [selectedBias, setSelectedBias] = useState('');
  const [error, setError] = useState(errorMessage);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [maximumReached, setMaximumReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMobileTable, setShowMobileTable] = useState(false);
  const [showMakk, setShowMakk] = useState(true);
  const exportedTable = useRef(null);
  const { accountData } = useContext(GlobalContext);
  const { locale } = useRouter() as TRouter;
  const {
    title,
    saveBtn,
    cancelBtn,
    savedState,
    loginToEdit,
    tableTitles,
    fullScreenBtn,
    exportBtnText,
    learnHowToUse,
    tableExampleText,
    article,
    image,
    addBiasToUseIt,
    iUnderstandBtn,
    placeHolderTxt,
    pleaseInputName,
  } = decisionTable[locale];

  const itemPerPage = 4;

  const totalPages = useMemo(() => {
    return Math.ceil(selectedBiasList.length / itemPerPage);
  }, [selectedBiasList]);
  const { isMobile } = useMobile()[1];

  const visibleRows = useMemo(() => {
    return selectedBiasList.slice(
      (currentPage - 1) * itemPerPage,
      currentPage * itemPerPage,
    );
  }, [selectedBiasList, currentPage]);

  const updateBias = (id: number, updates) => {
    const updatedDetails = selectedBiasList.map(bias => {
      if (bias.id === id) {
        return {
          ...bias,
          ...updates,
        };
      }
      return bias;
    });
    setSelectedBiasesDetails(updatedDetails);
  };

  const exportComponentAsImage = async () => {
    if (exportedTable.current) {
      exportedTable.current.classList.add(styles.exportedStyle);

      setTimeout(() => {
        exportedTable.current.classList.remove(styles.exportedStyle);
      }, 1);

      const canvas = await html2canvas(exportedTable.current);
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'exported-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const maximumReachedError = () => {
    if (isMatchedPersonaName && maxPersonaQuantity === 10) {
      setPersonaExistWarning(true);
      return;
    }
    if (!isMatchedPersonaName && maxPersonaQuantity === 10) {
      setMaximumReached(true);
    } else {
      saveDecisionTableData();
      setTimeout(() => {
        setFirstSaveClick(false);
      }, 2000);
      if (firstSaveClick) {
        overwriteDecisionTableData();
      }
    }
  };

  const emptyTableArray = Array.from(
    { length: placeholderText.length - visibleRows?.length },
    (_, index) => {
      return placeholderText[index];
    },
  );

  const showModal = !!isGoogleRefferer ? tempSelectedId : selectedId;

  useEffect(() => {
    if (visibleRows?.length === 0 && currentPage > 1) {
      setCurrentPage(prevState => prevState - 1);
    }
  }, [visibleRows, currentPage]);

  useEffect(() => {
    if (!removableBiasId) return;
    const biasDetail = selectedBiasList.find(
      detail => detail.id === removableBiasId,
    );
    if (!biasDetail) return;

    if (biasDetail.method || biasDetail.reason || biasDetail.instruction) {
      setBiasWillBeRemoved('AwaitingConfirmation');
    } else {
      setBiasWillBeRemoved('DirectRemove');
    }
  }, [removableBiasId, selectedBiasList]);

  useEffect(() => {
    const savedID = loadFromLocal('savedIDNumber');

    if (!!savedID && visibleRows) {
      const matchingRow = selectedBiasList.find(
        row => row.id === Number(savedID),
      );
      setTempSelectedId(savedID ? Number(savedID) : 0);
      setSelectedBias(matchingRow?.title);
      setShow(true);
    }
  }, [selectedId, selectedBiasList]);

  useEffect(() => {
    setLoading(true);

    const loadingTime = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(loadingTime);
    };
  }, []);

  useEffect(() => {
    if (errorMessage.length) {
      setError(pleaseInputName);
    }
  }, [locale, errorMessage]);

  return (
    <Fragment>
      <h2 className={styles.mainTitle}> {title} </h2>
      {isMobile ? (
        <div
          className={styles.mobileView}
          onClick={() => {
            setShowMobileTable(true);
          }}
        >
          <Image
            src={'/assets/biases/info-icon-blue.svg'}
            width={20}
            height={20}
            alt={'Info blue icon'}
          />
          <span>Tap to view</span>
        </div>
      ) : (
        <div className={styles.decisionTableWrapper}>
          <div className={styles.decision}>
            <TabHeader
              title={article}
              description={learnHowToUse}
              icon={<InfoIcon />}
              url={'/articles/uiux'}
            />
            <TabHeader
              title={image}
              description={tableExampleText}
              icon={<PictureIcon />}
              style={'pink'}
              url={'/assets/biases/FullERPPersona.png'}
            />
          </div>
          <div className={styles.wrapper}>
            {visibleRows?.length === 0 && showMakk && (
              <div className={styles.disabledTable}>
                <span> {addBiasToUseIt} </span>
                <Button
                  label={iUnderstandBtn}
                  onClick={() => {
                    setShowMakk(false);
                  }}
                  type={'primary'}
                />
              </div>
            )}
            <table className={styles.table} ref={exportedTable}>
              <thead>
                <tr>
                  {tableTitles.map((el, key) => {
                    return (
                      <th key={key}>
                        <Tooltip content={el.toolTipContent}>
                          <span>{el.title}</span>
                        </Tooltip>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {!!visibleRows &&
                  visibleRows.map((val, key) => {
                    const descriptionOfBias = val.descriptionOfBias;
                    return (
                      <Fragment key={key}>
                        <tr
                          onClick={() => {
                            if (visibleRows.length !== 0) {
                              setSelectedId(val.id);
                              setShow(true);
                              setSelectedBias(val.title);
                              setSelectedDescription(descriptionOfBias);
                              setSelectedReason(val?.reason);
                              setSelectedMethod(val?.method);
                              setSelectedInstruction(val?.instruction);
                            }
                          }}
                        >
                          <td>
                            {visibleRows?.length === 0 ? (
                              <p className={styles.tableTextEmpty}>
                                {val.instruction}
                              </p>
                            ) : val.instruction.length === 0 ? (
                              <p className={styles.tableTextEmpty}></p>
                            ) : (
                              <Tooltip content={val.instruction}>
                                <p className={styles.tableText}>
                                  {val.instruction}
                                </p>
                              </Tooltip>
                            )}
                          </td>
                          <td>
                            {visibleRows?.length === 0 ? (
                              <p className={styles.tableTextEmpty}>
                                {val?.title}
                              </p>
                            ) : !val?.title?.length ? (
                              <p className={styles.tableTextEmpty}></p>
                            ) : (
                              <Tooltip
                                content={
                                  <ContentParser data={val.descriptionOfBias} />
                                }
                              >
                                <p className={styles.tableText}>{val.title}</p>
                              </Tooltip>
                            )}
                          </td>
                          <td>
                            {visibleRows.length === 0 ? (
                              <p className={styles.tableTextEmpty}>
                                {val.reason}
                              </p>
                            ) : val.reason.length === 0 ? (
                              <p className={styles.tableTextEmpty}></p>
                            ) : (
                              <Tooltip content={val.reason}>
                                <p className={styles.tableText}>{val.reason}</p>
                              </Tooltip>
                            )}
                          </td>
                          <td>
                            {visibleRows.length === 0 ? (
                              <p className={styles.tableTextEmpty}>
                                {val.method}
                              </p>
                            ) : val.method.length === 0 ? (
                              <p className={styles.tableTextEmpty}></p>
                            ) : (
                              <Tooltip content={val.method}>
                                <p className={styles.tableText}>{val.method}</p>
                              </Tooltip>
                            )}
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                {emptyTableArray.map((val, id) => {
                  return (
                    <Fragment key={id}>
                      <tr className={styles.emptyLine}>
                        <td>
                          <Tooltip
                            content={<ContentParser data={val.instruction} />}
                          >
                            <p className={styles.tableTextEmpty}>
                              {val.instruction}
                            </p>
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip content={<ContentParser data={val.name} />}>
                            <p className={styles.tableTextEmpty}>{val.name}</p>
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip
                            content={<ContentParser data={val.reason} />}
                          >
                            <p className={styles.tableTextEmpty}>
                              {val.reason}
                            </p>
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip
                            content={<ContentParser data={val.method} />}
                          >
                            <p className={styles.tableTextEmpty}>
                              {val.method}
                            </p>
                          </Tooltip>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
            <div className={styles.pagination}>
              {totalPages > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={setCurrentPage}
                />
              )}
            </div>
            <div className={styles.btnWrapper}>
              <div className={styles.rightSideBtns}>
                <Button
                  label={exportBtnText}
                  onClick={exportComponentAsImage}
                  icon={<ExportIcon />}
                  disabled={visibleRows.length === 0}
                  dataCy={'export-button'}
                />
                <Button
                  label={fullScreenBtn}
                  onClick={() => setFullScreen(!fullScreen)}
                  icon={<FullScreenIcon />}
                  disabled={visibleRows.length === 0}
                  dataCy={'full-screen-button'}
                />
              </div>
              {accountData ? (
                <Button
                  label={saved ? savedState : saveBtn}
                  onClick={() => {
                    maximumReachedError();
                  }}
                  type={'primary'}
                  icon={saved && <Checkmark />}
                  className={cn(saved && styles.saveBtn, {
                    [styles.saveBtnHy]: locale === 'hy' && saved,
                  })}
                  iconClassName={saved && styles.saveBtnIcon}
                  disabled={saved}
                />
              ) : (
                <Button
                  label={loginToEdit}
                  onClick={() => {
                    setShowLoginModal(true);
                  }}
                  type={'primary'}
                  loading={loading}
                  dataCy={'login-button'}
                />
              )}
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
          </div>
          <Fragment>
            {show && showModal && (
              <DecisionTableModal
                loggedIn={!!accountData}
                show={show}
                setShow={setShow}
                key={showModal}
                updateBias={updateBias}
                id={showModal}
                reason={selectedReason}
                setSelectedReason={setSelectedReason}
                method={selectedMethod}
                instruction={selectedInstruction}
                biasName={selectedBias}
                descriptionOfBias={selectedDescription}
                placeHolderText={placeHolderTxt}
                handleLoginToEditClick={handleLoginToEditClick}
                loadFromLocal={loadFromLocal}
                temporarySavedData={temporarySavedData}
                setIsChangesUnsaved={setIsChangesUnsaved}
                isGoogleRefferer={isGoogleRefferer}
              />
            )}
          </Fragment>
          {showLoginModal && (
            <LogInModal
              setShowModal={setShowLoginModal}
              source={'Decision Table'}
            />
          )}
          {fullScreen && (
            <Modal
              dataCy={'expanded-decision-table-modal'}
              size={'large'}
              onClick={() => {
                setFullScreen(false);
              }}
              withoutHeader
            >
              <Table tableContent={selectedBiasList} titles={tableTitles} />
            </Modal>
          )}
          {maximumReached && (
            <PersonaListIsFullModal
              setMaximumReached={setMaximumReached}
              cancelBtn={cancelBtn}
              setOpenPersonas={setOpenPersonas}
            />
          )}
        </div>
      )}
      {showMobileTable && (
        <Modal
          size={'custom-decision-table'}
          onClick={() => {
            setShowMobileTable(false);
          }}
          withoutHeader
        >
          <div className={styles.tableWrapper}>
            <Table tableContent={selectedBiasList} titles={tableTitles} />
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default DecisionTable;
