import cn from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import type { TRouter } from '@local-types/global';
import { Skill } from '@local-types/pageTypes/vibesuite';

import vibesuiteIntl from '@data/vibesuite/intl';
import { categoriesRu } from '@data/vibesuite/intl/skills.ru';
import { localizeSkill } from '@data/vibesuite/localizeSkills';
import { getDependencies, getSkillById } from '@data/vibesuite/skills';

import CategoryIcon from '@components/vibesuite/CategoryIcons';

import { SkillDetailPanelProps } from './SkillDetailPanel.types';

import styles from './SkillDetailPanel.module.scss';

const KATAKANA_MAP: Record<string, string> = {
  a: '\u30A2',
  b: '\u30D3',
  c: '\u30AF',
  d: '\u30C7',
  e: '\u30A8',
  f: '\u30D5',
  g: '\u30B0',
  h: '\u30CF',
  i: '\u30A4',
  j: '\u30B8',
  k: '\u30AB',
  l: '\u30EB',
  m: '\u30DE',
  n: '\u30CA',
  o: '\u30AA',
  p: '\u30D7',
  q: '\u30AF',
  r: '\u30E9',
  s: '\u30B5',
  t: '\u30BF',
  u: '\u30A6',
  v: '\u30F4',
  w: '\u30EF',
  x: '\u30B7',
  y: '\u30E4',
  z: '\u30BA',
};

function getKatakana(name: string): string {
  const first = name.charAt(0).toLowerCase();
  return KATAKANA_MAP[first] || '\u30B9';
}

function buildInstruction(skill: Skill, locale: string): string {
  const tools = skill.tools.join(', ');
  const plural = skill.tools.length > 1;

  if (locale === 'ru') {
    return `Я хочу изучить «${skill.name}». Задача: ${skill.projectTitle}. Инструменты: ${tools}. Давай построим это вместе, шаг за шагом.`;
  }

  const title = skill.projectTitle
    .replace(/\byour\b/gi, 'my')
    .replace(/\byou\b/gi, 'I');
  const lower = title.charAt(0).toLowerCase() + title.slice(1);
  return `I want to learn "${skill.name}" to know how to ${lower}. I've been looking into ${tools} for this \u2014 if ${plural ? "they're a good fit" : "it's a good fit"} for my project, let's use ${plural ? 'them' : 'it'}. Can we build this together?`;
}

export default function SkillDetailPanel({
  skill,
  category,
  progress,
  onToggle,
  onClose,
  onSelectSkill,
  prevSkillId,
  nextSkillId,
  requestClose,
  isLoggedIn,
  onOpenLogin,
}: SkillDetailPanelProps) {
  const { locale } = useRouter() as TRouter;
  const t = vibesuiteIntl[locale];

  const locSkill = localizeSkill(skill, locale);
  const catName =
    locale === 'ru'
      ? categoriesRu[category.id]?.name || category.name
      : category.name;

  const difficultyDisplay: Record<string, { label: string; color: string }> = {
    beginner: { label: t.difficultyBeginner, color: '#6B8E6B' },
    intermediate: { label: t.difficultyIntermediate, color: '#B8960B' },
    advanced: { label: t.difficultyAdvanced, color: 'var(--accent)' },
  };

  const isCompleted = !!progress[skill.id]?.completed;
  const deps = getDependencies(skill.id);
  const diff = difficultyDisplay[skill.difficulty];
  const instruction = buildInstruction(locSkill, locale);
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const prevSkillRef = useRef(skill.id);

  const prevSkill = prevSkillId ? getSkillById(prevSkillId) : null;
  const nextSkill = nextSkillId ? getSkillById(nextSkillId) : null;

  useEffect(() => {
    const header = document.querySelector('header') as HTMLElement | null;
    if (header) header.style.zIndex = '0';
    return () => {
      if (header) header.style.zIndex = '';
    };
  }, []);

  useEffect(() => {
    if (skill.id !== prevSkillRef.current) {
      prevSkillRef.current = skill.id;
      setContentVisible(false);
      setCopied(false);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setContentVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [skill.id]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 180);
  };

  useEffect(() => {
    if (requestClose && !closing) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(instruction);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = instruction;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={cn(styles.background, {})} />
      <div
        role="dialog"
        aria-label={locSkill.name}
        className={cn(
          styles.panel,
          closing ? 'animate-modal-out' : 'animate-modal-in',
        )}
        onClick={e => e.stopPropagation()}
      >
        <div
          className={styles.scrollContent}
          style={{ opacity: contentVisible ? 1 : 0 }}
        >
          <div className={styles.headerRow}>
            <span className={styles.categoryLabel}>
              <CategoryIcon categoryId={category.id} /> {catName}
            </span>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <div className={styles.navBtns}>
                <button
                  className={cn(styles.navBtn, {
                    [styles.navBtnDisabled]: !prevSkill,
                  })}
                  disabled={!prevSkill}
                  onClick={() => prevSkillId && onSelectSkill(prevSkillId)}
                  title={prevSkill?.name}
                  aria-label={
                    prevSkill ? `Previous: ${prevSkill.name}` : 'Previous skill'
                  }
                >
                  &#8249;
                </button>
                <button
                  className={cn(styles.navBtn, {
                    [styles.navBtnDisabled]: !nextSkill,
                  })}
                  disabled={!nextSkill}
                  onClick={() => nextSkillId && onSelectSkill(nextSkillId)}
                  title={nextSkill?.name}
                  aria-label={
                    nextSkill ? `Next: ${nextSkill.name}` : 'Next skill'
                  }
                >
                  &#8250;
                </button>
              </div>
              <button
                className={styles.closeBtn}
                onClick={handleClose}
                title="Close"
                aria-label="Close skill details"
              >
                &#10005;
              </button>
            </div>
          </div>

          <h2 className={styles.skillTitle}>
            <span className={styles.titleKatakana}>
              {getKatakana(skill.name)}
            </span>
            {locSkill.name}
          </h2>

          <div className={styles.metaRow}>
            <span
              className={styles.difficultyBadge}
              style={{ color: diff.color, border: `1px solid ${diff.color}40` }}
            >
              {diff.label}
            </span>
            <span className={styles.timeLabel}>{locSkill.timeEstimate}</span>
          </div>

          <div className={styles.accentRule} />

          <p className={styles.sectionLabel}>{t.whatYoullBuild}</p>
          <p className={styles.projectTitle}>{locSkill.projectTitle}</p>

          <p className={styles.projectDesc}>{locSkill.projectDescription}</p>

          <div className={styles.toolsSection}>
            <p className={styles.sectionLabel}>{t.tools}</p>
            <ul className={styles.toolsWrap}>
              {skill.tools.map(tool => (
                <li key={tool} className={styles.toolTag}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          {deps.length > 0 && (
            <div className={styles.depsSection}>
              <p className={styles.sectionLabel}>{t.prerequisites}</p>
              <ul className={styles.depsList}>
                {deps.map(dep => {
                  const depDone = !!progress[dep.id]?.completed;
                  const locDep = localizeSkill(dep, locale);
                  return (
                    <li key={dep.id}>
                      <button
                        className={cn(styles.depBtn, {
                          [styles.depDone]: depDone,
                        })}
                        onClick={() => onSelectSkill(dep.id)}
                      >
                        <span>{depDone ? '\u2713' : '\u25CB'}</span>
                        {locDep.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className={styles.instructionBlock}>
            <div className={styles.instructionHeader}>
              <p className={styles.instructionSectionLabel}>
                {t.howToLearnThis}
              </p>
              <button
                className={styles.guideToggleBtn}
                onClick={() => setShowGuide(!showGuide)}
              >
                {showGuide ? t.hideGuide : t.firstTimeReadThis}
              </button>
            </div>

            {showGuide && (
              <div className={styles.guideContent}>
                <div className={styles.guideText}>
                  <p className={styles.guideHeading}>{t.detailGuideHeading}</p>
                  <ol className={styles.guideStepList}>
                    <li className={styles.guideStep}>
                      <span className={styles.guideStepNum} aria-hidden="true">
                        1.
                      </span>
                      <span>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {t.detailGuideStep1Bold}
                        </strong>{' '}
                        {t.detailGuideStep1Rest}
                      </span>
                    </li>
                    <li className={styles.guideStep}>
                      <span className={styles.guideStepNum} aria-hidden="true">
                        2.
                      </span>
                      <span>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {t.detailGuideStep2Bold}
                        </strong>{' '}
                        {t.detailGuideStep2Rest}
                      </span>
                    </li>
                    <li className={styles.guideStep}>
                      <span className={styles.guideStepNum} aria-hidden="true">
                        3.
                      </span>
                      <span>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {t.detailGuideStep3Bold}
                        </strong>{' '}
                        {t.detailGuideStep3Rest}
                      </span>
                    </li>
                  </ol>
                  <p className={styles.guideTip}>{t.detailGuideTip}</p>
                </div>
              </div>
            )}

            <div className={styles.instructionText}>
              <p className={styles.instructionParagraph}>{instruction}</p>
            </div>

            <button
              className={cn(styles.copyBtn, { [styles.copyBtnCopied]: copied })}
              onClick={handleCopy}
            >
              {copied ? t.copiedExcl : t.copyInstruction}
            </button>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <button
            className={cn(styles.toggleBtn, {
              [styles.toggleBtnUnmark]: isCompleted,
            })}
            onClick={() => {
              if (!isLoggedIn && onOpenLogin) {
                onOpenLogin();
                return;
              }
              onToggle(skill.id, !isCompleted);
            }}
          >
            {isCompleted ? t.unmarkAsLearned : t.markAsLearned}
          </button>
        </div>
      </div>
    </div>
  );
}
