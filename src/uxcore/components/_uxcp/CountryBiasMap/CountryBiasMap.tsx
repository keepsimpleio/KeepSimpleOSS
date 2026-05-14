import { useRouter } from 'next/router';
import { type FC, useEffect, useRef, useState } from 'react';

import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';

import { type Country, countryBiasByLocale } from '@data/countryBias';

import BiasPanel from './BiasPanel';
import CountryList from './CountryList';
import CountryMap from './CountryMap';

import styles from './CountryBiasMap.module.scss';

const TITLE_INTERVAL = 3000;

const TZ_TO_COUNTRY: Record<string, string> = {
  // Europe
  'Europe/Vienna': 'at',
  'Europe/Brussels': 'be',
  'Europe/Prague': 'cz',
  'Europe/Copenhagen': 'dk',
  'Europe/Helsinki': 'fi',
  'Europe/Paris': 'fr',
  'Europe/Berlin': 'de',
  'Europe/Athens': 'gr',
  'Europe/Dublin': 'ie',
  'Europe/Rome': 'it',
  'Europe/Amsterdam': 'nl',
  'Europe/Oslo': 'no',
  'Europe/Warsaw': 'pl',
  'Europe/Lisbon': 'pt',
  'Atlantic/Azores': 'pt',
  'Atlantic/Madeira': 'pt',
  'Europe/Bucharest': 'ro',
  'Europe/Madrid': 'es',
  'Atlantic/Canary': 'es',
  'Africa/Ceuta': 'es',
  'Europe/Stockholm': 'se',
  'Europe/Zurich': 'ch',
  'Europe/Istanbul': 'tr',
  'Europe/Kyiv': 'ua',
  'Europe/Kiev': 'ua',
  'Europe/Zaporozhye': 'ua',
  'Europe/Simferopol': 'ua',
  'Europe/Uzhgorod': 'ua',
  'Europe/London': 'gb',
  // Asia / Middle East
  'Asia/Yerevan': 'am',
  'Asia/Shanghai': 'cn',
  'Asia/Urumqi': 'cn',
  'Asia/Chongqing': 'cn',
  'Asia/Harbin': 'cn',
  'Asia/Kashgar': 'cn',
  'Asia/Kolkata': 'in',
  'Asia/Calcutta': 'in',
  'Asia/Jakarta': 'id',
  'Asia/Makassar': 'id',
  'Asia/Jayapura': 'id',
  'Asia/Pontianak': 'id',
  'Asia/Tehran': 'ir',
  'Asia/Jerusalem': 'il',
  'Asia/Tel_Aviv': 'il',
  'Asia/Tokyo': 'jp',
  'Asia/Kuala_Lumpur': 'my',
  'Asia/Kuching': 'my',
  'Asia/Karachi': 'pk',
  'Asia/Manila': 'ph',
  'Asia/Riyadh': 'sa',
  'Asia/Singapore': 'sg',
  'Asia/Seoul': 'kr',
  'Asia/Bangkok': 'th',
  'Asia/Dubai': 'ae',
  'Asia/Ho_Chi_Minh': 'vn',
  'Asia/Saigon': 'vn',
  // Africa
  'Africa/Cairo': 'eg',
  'Africa/Addis_Ababa': 'et',
  'Africa/Nairobi': 'ke',
  'Africa/Casablanca': 'ma',
  'Africa/Lagos': 'ng',
  'Africa/Johannesburg': 'za',
  // Americas — Colombia, Peru, Chile
  'America/Bogota': 'co',
  'America/Lima': 'pe',
  'America/Santiago': 'cl',
  'America/Punta_Arenas': 'cl',
  'Pacific/Easter': 'cl',
  // Mexico
  'America/Mexico_City': 'mx',
  'America/Cancun': 'mx',
  'America/Tijuana': 'mx',
  'America/Hermosillo': 'mx',
  'America/Mazatlan': 'mx',
  'America/Chihuahua': 'mx',
  'America/Monterrey': 'mx',
  'America/Bahia_Banderas': 'mx',
  'America/Merida': 'mx',
  'America/Matamoros': 'mx',
  'America/Ojinaga': 'mx',
  // Brazil
  'America/Sao_Paulo': 'br',
  'America/Manaus': 'br',
  'America/Recife': 'br',
  'America/Fortaleza': 'br',
  'America/Bahia': 'br',
  'America/Belem': 'br',
  'America/Cuiaba': 'br',
  'America/Campo_Grande': 'br',
  'America/Boa_Vista': 'br',
  'America/Porto_Velho': 'br',
  'America/Rio_Branco': 'br',
  'America/Maceio': 'br',
  'America/Santarem': 'br',
  'America/Eirunepe': 'br',
  'America/Araguaina': 'br',
  'America/Noronha': 'br',
  // United States
  'America/New_York': 'us',
  'America/Los_Angeles': 'us',
  'America/Chicago': 'us',
  'America/Denver': 'us',
  'America/Phoenix': 'us',
  'America/Anchorage': 'us',
  'America/Honolulu': 'us',
  'America/Detroit': 'us',
  'America/Indianapolis': 'us',
  'America/Boise': 'us',
  'America/Juneau': 'us',
  'America/Nome': 'us',
  'America/Sitka': 'us',
  'America/Adak': 'us',
  'America/Menominee': 'us',
  'America/Louisville': 'us',
  // Canada
  'America/Toronto': 'ca',
  'America/Vancouver': 'ca',
  'America/Edmonton': 'ca',
  'America/Halifax': 'ca',
  'America/Winnipeg': 'ca',
  'America/Regina': 'ca',
  'America/St_Johns': 'ca',
  'America/Whitehorse': 'ca',
  'America/Yellowknife': 'ca',
  'America/Iqaluit': 'ca',
  'America/Cambridge_Bay': 'ca',
  'America/Inuvik': 'ca',
  'America/Rankin_Inlet': 'ca',
  'America/Resolute': 'ca',
  'America/Atikokan': 'ca',
  'America/Blanc-Sablon': 'ca',
  'America/Creston': 'ca',
  'America/Dawson': 'ca',
  'America/Dawson_Creek': 'ca',
  'America/Fort_Nelson': 'ca',
  'America/Glace_Bay': 'ca',
  'America/Goose_Bay': 'ca',
  'America/Moncton': 'ca',
  'America/Montreal': 'ca',
  // Oceania
  'Pacific/Auckland': 'nz',
  'Pacific/Chatham': 'nz',
};

const TZ_PREFIX_TO_COUNTRY: Array<[string, string]> = [
  ['Australia/', 'au'],
  ['America/Argentina/', 'ar'],
];

const detectUserCountry = (countries: Country[]): string | null => {
  if (typeof window === 'undefined') return null;
  const has = (id: string) => countries.some(c => c.id === id);

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const exact = TZ_TO_COUNTRY[tz];
    if (exact && has(exact)) return exact;
    for (const [prefix, code] of TZ_PREFIX_TO_COUNTRY) {
      if (tz.startsWith(prefix) && has(code)) return code;
    }
  } catch {
    // Intl unavailable — fall through to language detection
  }

  const langs = [navigator.language, ...(navigator.languages ?? [])];
  for (const lang of langs) {
    const match = lang.match(/[-_]([A-Za-z]{2})$/);
    if (match) {
      const code = match[1].toLowerCase();
      if (has(code)) return code;
    }
  }

  return null;
};

interface CyclingSubtitleWordProps {
  words: string[];
  interval: number;
  boldWord?: string;
}

const CyclingSubtitleWord: FC<CyclingSubtitleWordProps> = ({
  words,
  interval,
  boldWord,
}) => {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'visible' | 'fading' | 'entering'>(
    'visible',
  );

  useEffect(() => {
    setIndex(0);
  }, [words]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase('fading');
      setTimeout(() => {
        setIndex(prev => (prev + 1) % words.length);
        setPhase('entering');
        setTimeout(() => setPhase('visible'), 50);
      }, 350);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  const word = words[index];
  const isBold = boldWord && word === boldWord;

  return (
    <span
      className={styles.CyclingWord}
      style={{
        opacity: phase === 'fading' ? 0 : 1,
        transform:
          phase === 'fading'
            ? 'translateY(-6px)'
            : phase === 'entering'
              ? 'translateY(6px)'
              : 'translateY(0)',
        fontWeight: isBold ? 900 : 700,
        color: isBold ? '#337AB7' : '#1A1A2E',
      }}
    >
      {word}
    </span>
  );
};

interface CountryBiasMapProps {
  biases: StrapiBiasType[];
  onUseBiases: (biasNumbers: number[], countryName: string) => void;
}

const CountryBiasMap: FC<CountryBiasMapProps> = ({ biases, onUseBiases }) => {
  const { locale } = useRouter() as TRouter;
  const { countries, ui } = countryBiasByLocale[locale];

  const [selected, setSelected] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');
  const biasPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(prev => prev ?? detectUserCountry(countries));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (id: string) => {
    setSelected(prev => (prev === id ? null : id));
  };

  const handleUseBiases = (biasNumbers: number[], countryName: string) => {
    onUseBiases(biasNumbers, countryName);
  };

  return (
    <div className={styles.Root}>
      <header className={styles.Header}>
        <h2 className={styles.Eyebrow}>{ui.chooseYour}</h2>
        <div className={styles.SubtitleSlot}>
          <CyclingSubtitleWord
            words={ui.cyclingWords}
            interval={TITLE_INTERVAL}
            boldWord={ui.cyclingBoldWord}
          />
        </div>
        <p className={styles.SubTagline}>
          <span className={styles.SubTaglineLead}>{ui.subTaglineLead}</span>
          {ui.subTagline}
        </p>
      </header>

      <CountryMap
        selected={selected}
        hoveredCountry={hoveredCountry}
        filterRegion={filterRegion}
        onSelect={handleSelect}
        onHover={setHoveredCountry}
      />

      <CountryList
        selected={selected}
        searchQuery={searchQuery}
        filterRegion={filterRegion}
        onSelect={handleSelect}
        onSearchChange={setSearchQuery}
        onRegionChange={setFilterRegion}
      />

      <div className={styles.Divider}>
        <hr />
      </div>

      <BiasPanel
        selectedId={selected}
        biases={biases}
        onUseBiases={handleUseBiases}
        ref={biasPanelRef}
      />
    </div>
  );
};

export default CountryBiasMap;
