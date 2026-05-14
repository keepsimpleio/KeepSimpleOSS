import {
  geoGraticule10,
  geoNaturalEarth1,
  geoPath,
  type GeoPermissibleObjects,
} from 'd3-geo';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { useRouter } from 'next/router';
import {
  type FC,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';

import type { TRouter } from '@uxcore/local-types/global';

import { countryBiasByLocale, REGION_COLORS } from '@data/countryBias';

import FlagImage from '../FlagImage';

import styles from './CountryMap.module.scss';

const ISO_TO_ID: Record<string, string> = {
  '032': 'ar',
  '051': 'am',
  '036': 'au',
  '040': 'at',
  '056': 'be',
  '076': 'br',
  '124': 'ca',
  '152': 'cl',
  '156': 'cn',
  '170': 'co',
  '203': 'cz',
  '208': 'dk',
  '818': 'eg',
  '231': 'et',
  '246': 'fi',
  '250': 'fr',
  '276': 'de',
  '300': 'gr',
  '356': 'in',
  '360': 'id',
  '364': 'ir',
  '372': 'ie',
  '376': 'il',
  '380': 'it',
  '392': 'jp',
  '404': 'ke',
  '458': 'my',
  '484': 'mx',
  '504': 'ma',
  '528': 'nl',
  '554': 'nz',
  '566': 'ng',
  '578': 'no',
  '586': 'pk',
  '604': 'pe',
  '608': 'ph',
  '616': 'pl',
  '620': 'pt',
  '642': 'ro',
  '682': 'sa',
  '702': 'sg',
  '710': 'za',
  '410': 'kr',
  '724': 'es',
  '752': 'se',
  '756': 'ch',
  '764': 'th',
  '792': 'tr',
  '784': 'ae',
  '804': 'ua',
  '826': 'gb',
  '840': 'us',
  '704': 'vn',
};

const LABEL_OFFSETS: Record<string, [number, number]> = {
  us: [0, -6],
  gb: [-10, -10],
  fr: [0, 6],
  de: [10, -6],
  se: [10, 0],
  il: [-14, 4],
  tr: [0, -4],
  sa: [0, 6],
  kr: [10, -4],
  jp: [12, 0],
  ke: [0, 6],
  ng: [0, -4],
  be: [0, -10],
  nl: [8, -10],
  ch: [0, 8],
  at: [8, 4],
  ie: [-14, -6],
  dk: [6, -8],
  no: [6, -4],
  fi: [8, 4],
  it: [-8, 4],
  es: [-6, 4],
  pt: [-14, 2],
  pl: [8, 2],
  cz: [0, -8],
  gr: [0, 6],
  ro: [8, 2],
  ua: [8, -4],
  am: [10, 4],
  ae: [8, 6],
  eg: [0, -4],
  ma: [-6, 4],
  sg: [10, 6],
  my: [0, -6],
  th: [-8, 2],
  vn: [8, 4],
  ph: [12, 0],
  pk: [0, -6],
};

interface CountryFeature extends Feature<Geometry> {
  id: string;
  properties: { name: string };
}

interface CountryMapProps {
  selected: string | null;
  hoveredCountry: string | null;
  filterRegion: string;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

const WIDTH = 960;
const HEIGHT = 500;

const projection = geoNaturalEarth1()
  .scale(155)
  .translate([WIDTH / 2, HEIGHT / 2])
  .precision(0.1);

const pathGen = geoPath(projection);

const regionColor = (c: { region: string }) =>
  REGION_COLORS[c.region] ?? '#337AB7';

const CountryMap: FC<CountryMapProps> = ({
  selected,
  hoveredCountry,
  filterRegion,
  onSelect,
  onHover,
}) => {
  const { locale } = useRouter() as TRouter;
  const { countries, ui, regions } = countryBiasByLocale[locale];

  const [worldData, setWorldData] = useState<FeatureCollection | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch('/uxcore_/data/countries-110m.json')
      .then(r => r.json())
      .then((topo: Topology) => {
        const geo = feature(
          topo,
          topo.objects.countries as GeometryCollection,
        ) as FeatureCollection;
        setWorldData(geo);
      });
  }, []);

  const { targetFeatures, bgFeatures } = useMemo(() => {
    if (!worldData) return { targetFeatures: [], bgFeatures: [] };
    const targets: CountryFeature[] = [];
    const bg: Feature[] = [];
    for (const f of worldData.features) {
      const fId = String((f as CountryFeature).id);
      if (ISO_TO_ID[fId]) {
        targets.push(f as CountryFeature);
      } else {
        bg.push(f);
      }
    }
    return { targetFeatures: targets, bgFeatures: bg };
  }, [worldData]);

  const centroids = useMemo(() => {
    const map: Record<string, [number, number]> = {};
    for (const f of targetFeatures) {
      const countryId = ISO_TO_ID[String(f.id)];
      if (countryId) {
        const c = pathGen.centroid(f);
        if (c && !isNaN(c[0])) {
          const offset = LABEL_OFFSETS[countryId] ?? [0, 0];
          map[countryId] = [c[0] + offset[0], c[1] + offset[1]];
        }
      }
    }
    return map;
  }, [targetFeatures]);

  const graticule = useMemo(() => pathGen(geoGraticule10()) ?? '', []);

  const outlinePath = useMemo(
    () => pathGen({ type: 'Sphere' } as GeoPermissibleObjects) ?? '',
    [],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (hoveredCountry) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    },
    [hoveredCountry],
  );

  const hoveredData = useMemo(() => {
    if (!hoveredCountry) return null;
    return countries.find(c => c.id === hoveredCountry) ?? null;
  }, [hoveredCountry, countries]);

  if (!worldData) {
    return (
      <div className={styles.LoadingWrapper}>
        <div className={styles.LoadingInner}>
          <svg className={styles.Spinner} viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              className={styles.SpinnerTrack}
            />
            <path
              d="M4 12a8 8 0 018-8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className={styles.SpinnerHead}
            />
          </svg>
          {ui.loadingMap}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Root} onMouseMove={handleMouseMove}>
      <svg
        ref={svgRef}
        className={styles.Svg}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="mapBg" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="2"
              floodColor="#000"
              floodOpacity="0.08"
            />
          </filter>
        </defs>

        <rect width={WIDTH} height={HEIGHT} fill="url(#mapBg)" rx="16" />

        <path d={outlinePath} fill="none" stroke="#CBD5E1" strokeWidth="0.5" />

        <path
          d={graticule}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="0.3"
          strokeDasharray="2,2"
          opacity="0.6"
        />

        {bgFeatures.map((f, i) => {
          const d = pathGen(f) ?? '';
          return (
            <path
              key={`bg-${i}`}
              d={d}
              fill="#E8ECF0"
              stroke="#D1D5DB"
              strokeWidth="0.3"
              strokeLinejoin="round"
            />
          );
        })}

        {targetFeatures.map(f => {
          const countryId = ISO_TO_ID[String(f.id)];
          if (!countryId) return null;
          const country = countries.find(c => c.id === countryId);
          if (!country) return null;

          const d = pathGen(f) ?? '';
          const baseColor = REGION_COLORS[country.region] ?? '#337AB7';
          const isActive = selected === countryId;
          const isHovered = hoveredCountry === countryId;
          const isDimmed =
            filterRegion !== 'All' && country.region !== filterRegion;

          let fill: string;
          let strokeColor: string;
          let strokeW: number;

          if (isDimmed) {
            fill = '#D5DAE0';
            strokeColor = '#B8BEC6';
            strokeW = 0.4;
          } else if (isActive) {
            fill = baseColor;
            strokeColor = '#1A1A2E';
            strokeW = 1.8;
          } else if (isHovered) {
            fill = `${baseColor}CC`;
            strokeColor = baseColor;
            strokeW = 1.2;
          } else {
            fill = `${baseColor}55`;
            strokeColor = `${baseColor}99`;
            strokeW = 0.6;
          }

          return (
            <path
              key={countryId}
              d={d}
              fill={fill}
              stroke={strokeColor}
              strokeWidth={strokeW}
              strokeLinejoin="round"
              className={styles.CountryPath}
              style={{
                filter: isActive
                  ? `drop-shadow(0 0 8px ${baseColor}66)`
                  : isHovered
                    ? `drop-shadow(0 0 4px ${baseColor}44)`
                    : 'none',
              }}
              onClick={() => onSelect(countryId)}
              onMouseEnter={() => onHover(countryId)}
              onMouseLeave={() => onHover(null)}
            />
          );
        })}

        {targetFeatures.map(f => {
          const countryId = ISO_TO_ID[String(f.id)];
          if (!countryId) return null;
          const country = countries.find(c => c.id === countryId);
          if (!country) return null;
          const pos = centroids[countryId];
          if (!pos) return null;

          const isActive = selected === countryId;
          const isHovered = hoveredCountry === countryId;
          const isDimmed =
            filterRegion !== 'All' && country.region !== filterRegion;
          const baseColor = REGION_COLORS[country.region] ?? '#337AB7';

          return (
            <g key={`label-${countryId}`} className={styles.LabelGroup}>
              <circle
                cx={pos[0]}
                cy={pos[1]}
                r={isActive ? 4 : isHovered ? 3.5 : 2.5}
                fill={
                  isDimmed
                    ? '#B8BEC6'
                    : isActive || isHovered
                      ? regionColor(country)
                      : `${baseColor}88`
                }
                stroke="white"
                strokeWidth={isActive || isHovered ? 1.5 : 1}
                className={styles.LabelDot}
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 3px ${baseColor}88)`
                    : 'none',
                }}
              />
              {(isActive || isHovered) && (
                <text
                  x={pos[0]}
                  y={pos[1] - (isActive ? 10 : 8)}
                  textAnchor="middle"
                  className={styles.LabelText}
                  style={{
                    fontSize: isActive ? '10px' : '9.5px',
                    fontWeight: isActive ? 700 : 600,
                    fill: isActive ? '#1A1A2E' : '#334155',
                  }}
                >
                  {country.id.toUpperCase()}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hoveredData && mousePos && (
        <div
          className={styles.Tooltip}
          style={{
            left: mousePos.x + 16,
            top: mousePos.y - 60,
          }}
        >
          <div className={styles.TooltipHead}>
            <FlagImage countryCode={hoveredData.id} size={16} />
            <span className={styles.TooltipName}>{hoveredData.name}</span>
          </div>
          <div className={styles.TooltipMeta}>
            {regions[hoveredData.region]} · {hoveredData.biases.length}{' '}
            {ui.tooltipBiases} · {Math.round(hoveredData.confidence * 100)}%
          </div>
          <div className={styles.TooltipHint}>{ui.tooltipHint}</div>
        </div>
      )}
    </div>
  );
};

export default CountryMap;
