import {
  addPersona,
  getPersonaList,
  updatePersona,
} from '@uxcore/api/personas';
import BiasSearch from '@uxcore/components/_uxcp/BiasSearch';
import CountryBiasMap from '@uxcore/components/_uxcp/CountryBiasMap';
import DecisionTable from '@uxcore/components/_uxcp/DecisionTable';
import LogInModal from '@uxcore/components/_uxcp/LogInModal';
import MobileDisclimer from '@uxcore/components/_uxcp/MobileDisclimer';
import PersonaButton from '@uxcore/components/_uxcp/PersonaButton';
import PersonaRelatedQuestions from '@uxcore/components/_uxcp/PersonaRelatedQuestions';
import PersonaSection from '@uxcore/components/_uxcp/PersonaSection';
import PieChartSection from '@uxcore/components/_uxcp/PieChartSection';
import SelectionView from '@uxcore/components/_uxcp/SelectionView';
import SuggestedQuestions from '@uxcore/components/_uxcp/SuggestedQuestions';
import UXCPDescription from '@uxcore/components/_uxcp/UXCPDescription';
import { GlobalContext } from '@uxcore/components/Context/GlobalContext';
import Input from '@uxcore/components/Input';
import Section from '@uxcore/components/Section';
import ToolFooter from '@uxcore/components/ToolFooter';
import decisionTable from '@uxcore/data/decisionTable';
import uxcpLocalization from '@uxcore/data/uxcp';
import useMobile from '@uxcore/hooks/useMobile';
import { copyToClipboard } from '@uxcore/lib/helpers';
import { calculateData, generateUXCPLink } from '@uxcore/lib/uxcp-helpers';
import type {
  QuestionType,
  StrapiBiasType,
  TagType,
} from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import styles from './UXCPLayout.module.scss';

const TeamRelatedInsights = dynamic(
  () => import('@uxcore/components/_uxcp/TeamRelatedInsights'),
  {
    ssr: false,
  },
);

const PersonaExistsModal = dynamic(
  () => import('@uxcore/components/_uxcp/PersonaExistsModal'),
  {
    ssr: false,
  },
);

interface UXCPLayoutProps {
  questions: QuestionType[];
  allLangBiases: any;
  biases: StrapiBiasType[];
  tags: TagType[];
  isSinglePersona?: boolean;
  personaDecisionTable?: any;
  existingPersonaName?: string;
}

const UXCPLayout: FC<UXCPLayoutProps> = ({
  questions,
  personaDecisionTable,
  isSinglePersona,
  existingPersonaName,
  biases,
  tags,
  allLangBiases,
}) => {
  const router = useRouter();
  const { isMobile } = useMobile()[1];
  const { locale } = router as TRouter;
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [personas, setPersonas] = useState(null);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [shortLink, setShortLink] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [personaName, setPersonaName] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [selectedInstruction, setSelectedInstruction] = useState('');
  const [firstSaveClick, setFirstSaveClick] = useState(false);
  const [show, setShow] = useState(false);
  const [isInitiated, setIsInitiated] = useState<boolean>(false);
  const [isTeamMember, setIsTeamMember] = useState<boolean>(false);
  const [temporarySavedData, setTemporarySavedData] = useState<boolean>(false);
  const [personaExistWarning, setPersonaExistWarning] = useState(false);
  const [selectedBiases, setSelectedBiases] = useState<StrapiBiasType[]>([]);
  const [isGoogleRefferer, setIsGoogleReferrer] = useState(false);
  const [localisedSelectedBiases, setLocalisedSelectedBiases] = useState<
    StrapiBiasType[]
  >([]);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedBiasesDetails, setSelectedBiasesDetails] = useState([]);
  const [isChangesUnsaved, setIsChangesUnsaved] = useState('default state');
  const [removableBiasId, setRemovableBiasId] = useState<number | undefined>();
  const [biasWillBeRemoved, setBiasWillBeRemoved] = useState<string | null>(
    null,
  );
  const [temporarySavedBiases, setTemporarySavedBiases] = useState(null);
  const personaSectionRef = useRef<HTMLDivElement>(null);
  const { title, subSectionTitle, copyURL, copied } = uxcpLocalization[locale];
  const { overWriteText, cancelBtn, pleaseInputName, saveFailed } =
    decisionTable[locale];
  const { accountData } = useContext(GlobalContext);
  const { relevantQuestions, tagRelevancy, suggestedQuestionsList } = useMemo(
    () => calculateData(questions, selectedBiases),
    [questions, biases, selectedBiases],
  );

  const prevHasRelevantDataRef = useRef(false);
  useEffect(() => {
    const entries = Object.entries(tagRelevancy);
    const hasData = entries.some(([, count]) => count > 0);

    if (hasData && !prevHasRelevantDataRef.current) {
      const [bestKey] = entries.reduce((best, current) =>
        current[1] > best[1] ? current : best,
      );
      setSelectedStage(Number(bestKey) - 1);
    }

    prevHasRelevantDataRef.current = hasData;
  }, [tagRelevancy]);

  const insightList = useMemo(
    () => selectedBiases.filter(({ m }) => m),
    [selectedBiases],
  );

  useEffect(() => {
    const uxcpLink = generateUXCPLink(
      personaName,
      selectedBiases,
      isTeamMember,
    );
    setShortLink(uxcpLink);
    if (isInitiated && !router.pathname.includes('user')) {
      const languages = {
        en: '',
        ru: '/ru',
        hy: '/hy',
      };
      const stringifiedBiases = selectedBiases
        .map(bias => bias.number)
        .join(',');
      if (personaName.length > 0 || selectedBiases.length > 0) {
        const url = `${languages[locale]}/uxcp?name=${encodeURIComponent(
          personaName,
        )}&biases=${stringifiedBiases}&isTeamMember=${isTeamMember}`;

        window.history.pushState({}, '', url);
      } else {
        const url = `${languages[locale]}${router.asPath.split('?')[0]}`;
        window.history.pushState({}, '', url);
      }
    }
  }, [personaName, selectedBiases, isTeamMember, locale, isInitiated, router]);

  const handleCopy = useCallback(() => {
    copyToClipboard(shortLink);
  }, [copyToClipboard, shortLink]);

  useEffect(() => {
    if (selectedBiases.length > 0 && router.asPath.includes('user')) {
      localStorage.setItem(
        'localisedSelectedBiases',
        JSON.stringify(selectedBiases),
      );
    }
  }, [selectedBiases]);

  useEffect(() => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    const languageSwitched = localStorage.getItem('languageSwitched');
    if (languageSwitched === 'true') {
      const savedBiases = localStorage.getItem('localisedSelectedBiases');
      if (savedBiases) {
        setLocalisedSelectedBiases(JSON.parse(savedBiases));
      }
      localStorage.removeItem('languageSwitched');
    }

    const data = vars.reduce<{
      biases: any;
      name: string;
      isTeamMember: any;
    }>(
      (acc, pair) => {
        const quesryPair = pair.split('=');
        // @ts-ignore
        acc[quesryPair[0]] = quesryPair[1];

        return acc;
      },
      {
        biases: '',
        name: '',
        isTeamMember: '',
      },
    );

    data.biases = data.biases.split(',').map((n: string) => Number(n));
    data.isTeamMember = data.isTeamMember === 'true';

    const incomingBiases = biases.filter(({ number }) =>
      data.biases.includes(number),
    );

    if (isSinglePersona) {
      let biasesToSet = [];

      if (localisedSelectedBiases && localisedSelectedBiases.length > 0) {
        biasesToSet = biases.filter(persona =>
          localisedSelectedBiases.some(bias => bias._id === persona._id),
        );
      } else {
        biasesToSet = biases.filter(persona =>
          personaDecisionTable?.some(bias => bias._id === persona._id),
        );
      }
      setSelectedBiases(biasesToSet);
    } else {
      setSelectedBiases(incomingBiases);
    }

    setPersonaName(decodeURIComponent(data.name));
    if (existingPersonaName) {
      setPersonaName(existingPersonaName);
    }

    setIsTeamMember(data.isTeamMember);
    setIsInitiated(true);
  }, [
    biases,
    temporarySavedBiases,
    existingPersonaName,
    personaDecisionTable,
    locale,
    router,
  ]);

  const mergeSelectedBiasesWithDetails = (
    localizedBiases: StrapiBiasType[],
    selectedBiases: any[],
    currentDetails: any[],
  ) => {
    const detailsMap = new Map(currentDetails.map(bias => [bias.id, bias]));

    return selectedBiases.map(selectedBias => {
      const existingDetail = detailsMap.get(selectedBias.number);

      const localizedBias = localizedBiases.find(
        b => b.number === selectedBias.number,
      );

      return {
        ...(existingDetail || {
          _id: selectedBias._id,
          id: selectedBias.number,
          method: '',
          reason: '',
          instruction: '',
        }),
        title: `#${selectedBias.number} ${localizedBias?.title || selectedBias.title}`,
        descriptionOfBias:
          localizedBias?.description || selectedBias.description,
      };
    });
  };

  const findMatchingPersonaName =
    personas && Array.isArray(personas)
      ? personas.find(persona => persona.name === personaName)
      : undefined;

  const fetchData = async () => {
    const result = await getPersonaList();
    setPersonas(result);
  };

  useEffect(() => {
    fetchData().then(r => console.log(r));
  }, []);

  function clearLocalStorageItems() {
    localStorage.removeItem('temporaryBias');
  }

  const saveDecisionTableData = () => {
    if (findMatchingPersonaName) {
      setPersonaExistWarning(true);
      return;
    }
    if (!personaName || personaName.trim() === '') {
      setErrorMessage(pleaseInputName);
      return;
    }
    if (personaName && personaName.trim() !== '') {
      setErrorMessage('');
      // Confirm "saved" only after the request lands: an optimistic flag
      // would tell the user their persona is safe when it never reached
      // the server.
      addPersona(
        personaName,
        JSON.stringify(selectedBiasesDetails),
        accountData?.username,
      )
        .then(() => {
          setSaved(true);
          setIsChangesUnsaved('saved');
          setFirstSaveClick(true);
          fetchData();
          clearLocalStorageItems();
          setTimeout(() => {
            setSaved(false);
          }, 2000);
        })
        .catch(err => {
          console.error('Persona save failed:', err);
          setErrorMessage(saveFailed);
        });
    }
  };

  const overwriteDecisionTableData = () => {
    if (!personaName || personaName.trim() === '') {
      setErrorMessage(pleaseInputName);
    }
    if (findMatchingPersonaName) {
      updatePersona(
        findMatchingPersonaName.id,
        findMatchingPersonaName.name,
        JSON.stringify(selectedBiasesDetails),
        accountData?.username,
      )
        .then(() => {
          clearLocalStorageItems();
          setPersonaExistWarning(false);
          setSaved(true);
          setIsChangesUnsaved('saved');
          setTimeout(() => {
            setSaved(false);
          }, 2000);
        })
        .catch(err => {
          console.error('Persona overwrite failed:', err);
          setPersonaExistWarning(false);
          setErrorMessage(saveFailed);
        });
    }
  };
  const saveToLocal = (key, value) => {
    localStorage.setItem(key, value);
  };

  const loadFromLocal = key => localStorage.getItem(key);

  const handleLoginToEditClick = async (
    localReason: string,
    localMethod: string,
    localInstruction: string,
    savedIDNumber: number,
  ) => {
    saveToLocal('selectedBiases', JSON.stringify(selectedBiases));
    setTemporarySavedData(true);
    if (
      localReason.length > 0 ||
      localMethod.length > 0 ||
      localInstruction.length > 0
    ) {
      saveToLocal('localReason', localReason);
      saveToLocal('localMethod', localMethod);
      saveToLocal('localInstruction', localInstruction);
      saveToLocal('savedIDNumber', savedIDNumber);
    }
    setShowLoginModal(true);
    setShow(false);
  };

  useEffect(() => {
    let newDetails = [];
    if (personaDecisionTable) {
      setSelectedBiasesDetails(personaDecisionTable);
    } else {
      newDetails = mergeSelectedBiasesWithDetails(
        allLangBiases[locale],
        selectedBiases,
        selectedBiasesDetails,
      );
      setSelectedBiasesDetails(newDetails);
    }
  }, [
    biases,
    selectedBiases,
    locale,
    personaDecisionTable,
    temporarySavedData,
  ]);

  useEffect(() => {
    if (accountData) {
      const savedSelectedBiases = loadFromLocal('selectedBiases');
      if (savedSelectedBiases)
        setTemporarySavedBiases(JSON.parse(savedSelectedBiases));
    }
  }, [accountData]);

  useEffect(() => {
    if (accountData) {
      const handleBeforeUnload = e => {
        if (isChangesUnsaved === 'unsaved') {
          e.preventDefault();
          e.returnValue =
            'You have unsaved changes. Are you sure you want to leave?';
        }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [selectedBiasesDetails]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('localisedSelectedBiases');
      localStorage.removeItem('languageSwitched');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const referrer = document.referrer;

    try {
      const url = new URL(referrer);
      const provider = url.searchParams.get('provider');
      setIsGoogleReferrer(
        url.pathname === '/auth' &&
          (provider === 'google' || provider === 'discord'),
      );
    } catch {
      setIsGoogleReferrer(false);
    }
  }, []);

  return (
    <div className={styles.body}>
      <div
        className={cn(styles.Content, {
          [styles.hyLang]: locale === 'hy',
        })}
      >
        <h1 className={styles.Title}>UX CORE PERSONA</h1>
        <h2 className={styles.ShortName}>(UXCP)</h2>
        <section className={styles.ShiftedContent}>
          <UXCPDescription />
          <CountryBiasMap
            biases={biases}
            onUseBiases={(biasNumbers, countryName) => {
              const matched = biases.filter(b =>
                biasNumbers.includes(b.number),
              );
              setSelectedBiases(matched);
              setPersonaName(countryName);
              requestAnimationFrame(() => {
                personaSectionRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              });
            }}
          />
          {isMobile && <MobileDisclimer />}
          <div ref={personaSectionRef} style={{ scrollMarginTop: 16 }} />
          {!isMobile && <h2 className={styles.Heading}>{title}</h2>}
          <Section style={isMobile ? {} : { padding: 12 }} noStyles={isMobile}>
            {!isMobile && (
              <PersonaSection
                inputValue={personaName}
                onInputChange={setPersonaName}
                isActive={isTeamMember}
                onSwitchChange={setIsTeamMember}
              />
            )}
            <div className={styles.PersonaGrid}>
              {!isMobile && (
                <BiasSearch
                  onChange={setSelectedBiases}
                  biases={biases}
                  selectedBiases={selectedBiases}
                  setRemovableBiasId={setRemovableBiasId}
                />
              )}
              <SelectionView
                onChange={setSelectedBiases}
                biases={biases}
                personaName={personaName}
                selectedBiases={selectedBiases}
                setRemovableBiasId={setRemovableBiasId}
                removableBiasId={removableBiasId}
                biasWillBeRemoved={biasWillBeRemoved}
                setBiasWillBeRemoved={setBiasWillBeRemoved}
              />
            </div>
            {!isMobile && (
              <div className={styles.LinkSection}>
                <div className={styles.LinkWrapper}>
                  <Input
                    value={shortLink}
                    disabled
                    marginBottom={0}
                    controlled
                  />
                  <PersonaButton
                    label={copyURL}
                    animate
                    animationText={copied}
                    onClick={handleCopy}
                    icon="copy"
                    style={locale === 'ru' ? { minWidth: 130 } : {}}
                  />
                </div>
                <div className={styles.SaveButtonWrapper} />
              </div>
            )}
          </Section>
          <h2 className={styles.Heading}>{subSectionTitle}</h2>
          <div
            className={styles.RelevantQuestionsGrid}
            style={{ marginTop: 10 }}
          >
            <PieChartSection
              stageIndex={selectedStage}
              onStageChange={setSelectedStage}
              tagRelevancy={tagRelevancy}
              tags={tags}
            />
            <PersonaRelatedQuestions
              stageIndex={selectedStage}
              relatedQuestions={relevantQuestions}
              totalAppearing={selectedBiases.length}
              tags={tags}
            />
          </div>
          <SuggestedQuestions
            suggestions={suggestedQuestionsList}
            totalAppearing={relevantQuestions.length}
          />
          {isTeamMember && (
            <TeamRelatedInsights
              personaName={personaName}
              insights={insightList}
              setRemovableBiasId={setRemovableBiasId}
            />
          )}
          <DecisionTable
            selectedBiasList={selectedBiasesDetails}
            setSelectedBiasesDetails={setSelectedBiasesDetails}
            selectedReason={selectedReason}
            setSelectedReason={setSelectedReason}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            selectedInstruction={selectedInstruction}
            setSelectedInstruction={setSelectedInstruction}
            saved={saved}
            saveDecisionTableData={saveDecisionTableData}
            overwriteDecisionTableData={overwriteDecisionTableData}
            setFirstSaveClick={setFirstSaveClick}
            firstSaveClick={firstSaveClick}
            setPersonaExistWarning={setPersonaExistWarning}
            errorMessage={errorMessage}
            removableBiasId={removableBiasId}
            maxPersonaQuantity={!!personas && personas.length}
            setBiasWillBeRemoved={setBiasWillBeRemoved}
            handleLoginToEditClick={handleLoginToEditClick}
            isMatchedPersonaName={findMatchingPersonaName?.name === personaName}
            loadFromLocal={loadFromLocal}
            temporarySavedData={temporarySavedData}
            setIsChangesUnsaved={setIsChangesUnsaved}
            setShow={setShow}
            show={!showLoginModal && show}
            isGoogleRefferer={isGoogleRefferer}
          />
        </section>
        <div className={styles.Motto}>Be Kind. Do Good.</div>
      </div>
      <ToolFooter page="uxcp" />
      {personaExistWarning && (
        <PersonaExistsModal
          overWriteText={overWriteText}
          personaName={findMatchingPersonaName?.name}
          overwriteDecisionTableData={overwriteDecisionTableData}
          cancelBtn={cancelBtn}
          setPersonaExistWarning={setPersonaExistWarning}
        />
      )}
      {showLoginModal && (
        <LogInModal
          setShowModal={setShowLoginModal}
          source={'Decision Table'}
        />
      )}
    </div>
  );
};
export default memo(UXCPLayout);
