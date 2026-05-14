import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  type FC,
  forwardRef,
  type Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { StrapiBiasType } from '@uxcore/local-types/data';
import type { TRouter } from '@uxcore/local-types/global';

import { sanitizeHtml } from '@uxcore/lib/sanitizeHtml';

import { countryBiasByLocale, REGION_COLORS } from '@uxcore/data/countryBias';

import FlagImage from '../FlagImage';

import styles from './BiasPanel.module.scss';

const SpinningGlobe: FC = () => {
  const [hovering, setHovering] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!hovering) return;
    let raf: number;
    let start: number | null = null;
    const baseRotation = rotation;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      setRotation(baseRotation + (elapsed / 1000) * 18);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovering]);

  return (
    <div
      className={styles.Globe}
      style={{
        opacity: 0.3,
        transform: `rotate(${rotation}deg)`,
        transition: hovering ? 'none' : 'transform 0.5s ease-out',
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      title="Give me a spin!"
    >
      🌍
    </div>
  );
};

interface BiasPanelProps {
  selectedId: string | null;
  biases: StrapiBiasType[];
  onUseBiases: (biasNumbers: number[], countryName: string) => void;
}

const BiasPanel = forwardRef<HTMLDivElement, BiasPanelProps>(
  ({ selectedId, biases, onUseBiases }, ref) => {
    const { locale } = useRouter() as TRouter;
    const { countries, ui, regions } = countryBiasByLocale[locale];

    const country = countries.find(c => c.id === selectedId) ?? null;
    const [showHelp, setShowHelp] = useState(false);
    const helpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const biasByNumber = useMemo(() => {
      const map = new Map<number, StrapiBiasType>();
      for (const b of biases) map.set(b.number, b);
      return map;
    }, [biases]);

    if (!country) {
      return (
        <div className={styles.EmptyState}>
          <SpinningGlobe />
          <p className={styles.EmptyText}>
            {ui.emptyStateLead}
            <span className="animated-underline-wrap">
              <span className={styles.UnderlineWrap}>
                {ui.emptyStateLink}
                <span className="animated-underline" />
              </span>
            </span>
          </p>
          <p className={styles.EmptyHint}>{ui.emptyStateHint}</p>
        </div>
      );
    }

    const baseRegionColor = REGION_COLORS[country.region] || '#337AB7';
    const confidencePct = Math.round(country.confidence * 100);
    const regionLabel = regions[country.region] ?? country.region;

    const badgeBg =
      confidencePct >= 85
        ? '#DCFCE7'
        : confidencePct >= 75
          ? '#FEF3C7'
          : '#FEE2E2';
    const badgeColor =
      confidencePct >= 85
        ? '#166534'
        : confidencePct >= 75
          ? '#92400E'
          : '#991B1B';

    const handleUse = () => {
      onUseBiases(country.biases, country.name);
    };

    return (
      <div className={styles.Root} ref={ref as Ref<HTMLDivElement>}>
        <div key={country.id} className={`${styles.Card} animate-in`}>
          <div className={styles.Header}>
            <FlagImage
              countryCode={country.id}
              size={40}
              className={styles.HeaderFlag}
            />
            <div className={styles.HeaderBody}>
              <div className={styles.TitleRow}>
                <h3 className={styles.Title}>{country.name}</h3>
                <div className={styles.ConfidenceWrap}>
                  <span
                    className={styles.ConfidenceBadge}
                    style={{ background: badgeBg, color: badgeColor }}
                    onMouseEnter={() => {
                      if (helpTimeoutRef.current)
                        clearTimeout(helpTimeoutRef.current);
                      setShowHelp(true);
                    }}
                    onMouseLeave={() => {
                      helpTimeoutRef.current = setTimeout(
                        () => setShowHelp(false),
                        120,
                      );
                    }}
                  >
                    {confidencePct}
                    {ui.matchSuffix}
                  </span>
                  {showHelp && (
                    <div
                      className={styles.HelpPopover}
                      onMouseEnter={() => {
                        if (helpTimeoutRef.current)
                          clearTimeout(helpTimeoutRef.current);
                      }}
                      onMouseLeave={() => {
                        helpTimeoutRef.current = setTimeout(
                          () => setShowHelp(false),
                          120,
                        );
                      }}
                    >
                      <p className={styles.HelpLabel}>{ui.whyTheseBiases}</p>
                      <p className={styles.HelpText}>{ui.whyApproxNote}</p>
                      <p className={styles.HelpText}>{country.biasRationale}</p>
                      <div className={styles.HelpFootnote}>
                        <p>{ui.hofstedeNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className={styles.Rationale}>{country.rationale}</p>
            </div>
            <span
              className={styles.RegionTag}
              style={{
                background: `${baseRegionColor}15`,
                color: baseRegionColor,
                border: `1px solid ${baseRegionColor}30`,
              }}
            >
              {regionLabel}
            </span>
          </div>

          <div className={styles.BiasGrid}>
            {country.biases.map(bId => {
              const bias = biasByNumber.get(bId);
              if (!bias) return null;
              return (
                <Link
                  key={bId}
                  href={`/uxcore/${bias.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.BiasChip}
                >
                  <span className={styles.BiasNumber}>#{bId}</span>
                  <span className={styles.BiasName}>{bias.title}</span>
                  <div
                    className={styles.BiasShort}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(bias.description),
                    }}
                  />
                </Link>
              );
            })}
          </div>

          <div className={styles.Footer}>
            <span className={styles.FooterMeta}>
              {country.biases.length} {ui.footerBiases} &middot; {regionLabel}{' '}
              &middot; {confidencePct}% {ui.footerConfidence}
            </span>
            <button
              type="button"
              onClick={handleUse}
              className={styles.UseButton}
            >
              {ui.useInPersonaBuilder.replace('{country}', country.name)}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

BiasPanel.displayName = 'BiasPanel';

export default BiasPanel;
