import BiasItem from '@uxcore/components/_uxcp/BiasItem';
import Pagination from '@uxcore/components/_uxcp/Pagination';
import Section from '@uxcore/components/Section';
import uxcpLocalization from '@uxcore/data/uxcp';
import useMobile from '@uxcore/hooks/useMobile';
import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';
import { useRouter } from 'next/router';
import {
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import styles from './SelectionView.module.scss';

type TSelectionView = {
  biases: StrapiBiasType[];
  personaName: string;
  selectedBiases: StrapiBiasType[];
  onChange: (action: SetStateAction<StrapiBiasType[]>) => void;
  setRemovableBiasId: (action: SetStateAction<number>) => void;
  biasWillBeRemoved?: string;
  setBiasWillBeRemoved?: (biasWillBeRemoved: string) => void;
  removableBiasId?: number;
};

const itemsPerPage = 10;

const SelectionView: FC<TSelectionView> = ({
  biases,
  personaName,
  selectedBiases,
  onChange,
  setRemovableBiasId,
  biasWillBeRemoved,
  setBiasWillBeRemoved,
  removableBiasId,
}) => {
  const { isMobile } = useMobile()[1];
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { locale } = router as TRouter;
  const {
    personaInputPlaceholder,
    personaInputMobilePlaceholder,
    biasPlaceholder,
  } = uxcpLocalization[locale];

  const selectedBiasesText = {
    en: 'Number of selected biases: ',
    ru: 'Количество выбранных искажений: ',
    hy: 'Ընտրված հակումների քանակը: ',
  };

  const numberOfSelectedBiases = `${selectedBiasesText[locale]}${selectedBiases.length}`;

  const handleRemove = useCallback(biasNumber => {
    onChange((prevState: StrapiBiasType[]) => {
      const index = prevState.indexOf(biasNumber);
      prevState.splice(index, 1);
      return [...prevState];
    });
  }, []);

  const totalPages = useMemo(() => {
    return Math.ceil(selectedBiases.length / itemsPerPage);
  }, [selectedBiases]);

  const visibleItems = useMemo(() => {
    return selectedBiases.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [selectedBiases, currentPage]);

  useEffect(() => {
    if (visibleItems.length === 0 && currentPage > 1) {
      setCurrentPage(prevState => prevState - 1);
    }
  }, [visibleItems, currentPage]);

  const placeholder = useMemo(
    () => (isMobile ? personaInputMobilePlaceholder : personaInputPlaceholder),
    [isMobile, personaInputPlaceholder],
  );

  return (
    <Section>
      <div className={styles.SelectionView}>
        <div className={styles.PersonaName}>{personaName || placeholder}</div>
        <div className={styles.BiasList}>
          {selectedBiases.length > 0 && (
            <span className={styles.selectedBiasesNum}>
              {numberOfSelectedBiases}
            </span>
          )}
          {biases.map(bias => (
            <BiasItem
              key={bias.number}
              bias={bias}
              visible={
                !!visibleItems.find(({ number }) => number === bias.number)
              }
              onRemove={handleRemove}
              setRemovableBiasId={setRemovableBiasId}
              removableBiasId={removableBiasId}
              biasWillBeRemoved={biasWillBeRemoved}
              setBiasWillBeRemoved={setBiasWillBeRemoved}
            />
          ))}
        </div>
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        )}
        {visibleItems.length === 0 && (
          <div className={styles.Placeholder}>
            <img src="/assets/icons/uxcp-arrow.svg" alt="arrow" />{' '}
            <div>{biasPlaceholder}</div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default SelectionView;
