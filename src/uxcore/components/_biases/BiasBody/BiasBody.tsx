import { ComponentType, useEffect, useState } from 'react';

import { biasesByLocale } from '@data/biasList';

import DemoErrorBoundary from './DemoErrorBoundary';
import { demoRegistry } from './demoRegistry';

import styles from './BiasBody.module.scss';

type SupportedLocale = keyof typeof biasesByLocale;

interface BiasBodyProps {
  biasNumber?: number;
  name?: string;
  locale: SupportedLocale;
}

const labels: Record<
  SupportedLocale,
  {
    visualExample: string;
    scenario: string;
    without: string;
    with: string;
    why: string;
    loading: string;
    missing: string;
  }
> = {
  en: {
    visualExample: 'Visual example',
    scenario: 'Scenario:',
    without: 'Without Bias',
    with: 'With Bias',
    why: 'Why It Works',
    loading: 'Loading demo...',
    missing: 'No demo available for this bias.',
  },
  ru: {
    visualExample: 'Наглядный пример',
    scenario: 'Сценарий:',
    without: 'Без искажения',
    with: 'С искажением',
    why: 'Почему это работает',
    loading: 'Загрузка демо...',
    missing: 'Для этого искажения демо пока нет.',
  },
  hy: {
    visualExample: 'Տեսողական օրինակ',
    scenario: 'Scenario:',
    without: 'Without Bias',
    with: 'With Bias',
    why: 'Why It Works',
    loading: 'Loading demo...',
    missing: 'No demo available for this bias.',
  },
};

const normalizeName = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9Ѐ-ӿ]/g, '');

const BiasBody = ({ biasNumber, name, locale }: BiasBodyProps) => {
  const [DemoBefore, setDemoBefore] = useState<ComponentType | null>(null);
  const [DemoAfter, setDemoAfter] = useState<ComponentType | null>(null);

  const biases = biasesByLocale[locale] ?? biasesByLocale.en;
  const t = labels[locale] ?? labels.en;
  const bias =
    biasNumber != null
      ? biases.find(b => b.id === biasNumber)
      : name
        ? biases.find(b => normalizeName(b.name) === normalizeName(name))
        : undefined;
  const biasSlug = bias?.slug;

  useEffect(() => {
    setDemoBefore(null);
    setDemoAfter(null);
    if (!biasSlug) return;
    const loader = demoRegistry[biasSlug];
    if (loader) {
      loader().then(mod => {
        setDemoBefore(() => mod.Before);
        setDemoAfter(() => mod.After);
      });
    }
  }, [biasSlug]);

  if (!bias) {
    return (
      <div className={styles.Body}>
        <p className={styles.Missing}>{t.missing}</p>
      </div>
    );
  }

  return (
    <div className={styles.Body} data-cy="bias-body">
      <span className={styles.MetaTitle}>{t.visualExample}</span>
      <p className={styles.Scenario}>
        <strong className={styles.ScenarioLabel}>{t.scenario}</strong>{' '}
        {bias.scenario}
      </p>

      <div className={styles.Demos}>
        <div className={styles.DemoPanel}>
          <h3 className={styles.PanelLabel}>{t.without}</h3>
          <div className={styles.PanelContent}>
            <DemoErrorBoundary key={`before-${bias.slug}`}>
              {DemoBefore ? (
                <DemoBefore />
              ) : (
                <div className={styles.Loading}>{t.loading}</div>
              )}
            </DemoErrorBoundary>
          </div>
          <p className={styles.PanelDescription}>{bias.withoutBias}</p>
        </div>
        <div className={styles.DemoPanel}>
          <h3 className={styles.PanelLabel}>{t.with}</h3>
          <div className={styles.PanelContent}>
            <DemoErrorBoundary key={`after-${bias.slug}`}>
              {DemoAfter ? (
                <DemoAfter />
              ) : (
                <div className={styles.Loading}>{t.loading}</div>
              )}
            </DemoErrorBoundary>
          </div>
          <p className={styles.PanelDescription}>{bias.withBias}</p>
        </div>
      </div>

      <div className={styles.Explanation}>
        <h3 className={styles.ExplanationLabel}>{t.why}</h3>
        <p>{bias.whyItWorks}</p>
      </div>
    </div>
  );
};

export default BiasBody;
