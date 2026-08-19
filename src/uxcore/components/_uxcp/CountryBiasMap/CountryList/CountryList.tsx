import { countryBiasByLocale, REGION_COLORS } from '@uxcore/data/countryBias';
import type { TRouter } from '@uxcore/local-types/global';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { type ChangeEvent, type FC, useMemo, useState } from 'react';

import FlagImage from '../FlagImage';

import styles from './CountryList.module.scss';

const INITIAL_VISIBLE = 15;

interface CountryListProps {
  selected: string | null;
  searchQuery: string;
  filterRegion: string;
  onSelect: (id: string) => void;
  onSearchChange: (query: string) => void;
  onRegionChange: (region: string) => void;
}

const CountryList: FC<CountryListProps> = ({
  selected,
  searchQuery,
  filterRegion,
  onSelect,
  onSearchChange,
  onRegionChange,
}) => {
  const { locale } = useRouter() as TRouter;
  const { countries, ui, regions: regionLabels } = countryBiasByLocale[locale];

  const [expanded, setExpanded] = useState(false);

  const regionKeys = useMemo(() => {
    const unique: string[] = [];
    for (const c of countries) {
      if (!unique.includes(c.region)) unique.push(c.region);
    }
    return ['All', ...unique];
  }, [countries]);

  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return countries.filter(c => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.aliases.some(a => a.toLowerCase().includes(q));
      const matchRegion = filterRegion === 'All' || c.region === filterRegion;
      return matchSearch && matchRegion;
    });
  }, [countries, searchQuery, filterRegion]);

  const isFiltering = searchQuery.trim() !== '' || filterRegion !== 'All';
  const shouldCollapse = !expanded && !isFiltering;
  const visibleCountries = shouldCollapse
    ? filteredCountries.slice(0, INITIAL_VISIBLE)
    : filteredCountries;
  const hiddenCount = filteredCountries.length - visibleCountries.length;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setExpanded(false);
  };

  return (
    <div className={styles.Root}>
      <div className={styles.Controls}>
        <input
          type="text"
          placeholder={ui.searchPlaceholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.SearchInput}
        />
        <div className={styles.Pills}>
          {regionKeys.map(r => {
            const isActive = filterRegion === r;
            const color = REGION_COLORS[r] || '#337AB7';
            const label = regionLabels[r as keyof typeof regionLabels] ?? r;
            return (
              <button
                key={r}
                onClick={() => {
                  onRegionChange(r);
                  setExpanded(false);
                }}
                className={styles.Pill}
                style={
                  isActive
                    ? {
                        background: color,
                        borderColor: color,
                        color: '#FFFFFF',
                      }
                    : {
                        background: '#FFFFFF',
                        borderColor: '#E2E8F0',
                        color: '#64748B',
                      }
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.Grid}>
        {visibleCountries.map(c => {
          const isSelected = selected === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={cn(styles.Card, {
                [styles.CardSelected]: isSelected,
              })}
            >
              <FlagImage countryCode={c.id} countryName={c.name} size={18} />
              <span className={styles.CardName}>{c.name}</span>
              <span className={styles.CardConfidence}>
                {Math.round(c.confidence * 100)}%
              </span>
            </button>
          );
        })}
      </div>

      {hiddenCount > 0 && (
        <div className={styles.MoreRow}>
          <button
            onClick={() => setExpanded(true)}
            className={styles.MoreButton}
          >
            {ui.moreCountries(hiddenCount)}
          </button>
        </div>
      )}
      {expanded && !isFiltering && (
        <div className={styles.MoreRow}>
          <button
            onClick={() => setExpanded(false)}
            className={styles.LessButton}
          >
            {ui.showLess}
          </button>
        </div>
      )}
      {hiddenCount <= 0 && !expanded && <div className={styles.Spacer} />}
    </div>
  );
};

export default CountryList;
