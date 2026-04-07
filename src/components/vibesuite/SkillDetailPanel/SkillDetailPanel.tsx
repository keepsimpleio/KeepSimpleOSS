import cn from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useRef,useState } from 'react';

import type { TRouter } from '@local-types/global';
import {
  Skill,
  SkillCategory,
  UserProgress,
} from '@local-types/pageTypes/vibesuite';

import vibesuiteIntl from '@data/vibesuite/intl';
import { categoriesRu } from '@data/vibesuite/intl/skills.ru';
import { localizeSkill } from '@data/vibesuite/localizeSkills';
import { getDependencies, getSkillById } from '@data/vibesuite/skills';

import CategoryIcon from '@components/vibesuite/CategoryIcons';

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

interface SkillDetailPanelProps {
  skill: Skill;
  category: SkillCategory;
  progress: UserProgress;
  onToggle: (skillId: string, completed: boolean) => void;
  onClose: () => void;
  onSelectSkill: (skillId: string) => void;
  prevSkillId: string | null;
  nextSkillId: string | null;
  requestClose?: boolean;
}

function buildInstruction(skill: Skill, locale: string): string {
  const tools = skill.tools.join(', ');
  const plural = skill.tools.length > 1;

  if (locale === 'ru') {
    return `\u042F \u0445\u043E\u0447\u0443 \u0438\u0437\u0443\u0447\u0438\u0442\u044C \u00AB${skill.name}\u00BB. \u0417\u0430\u0434\u0430\u0447\u0430: ${skill.projectTitle}. \u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u044B: ${tools}. \u0414\u0430\u0432\u0430\u0439 \u043F\u043E\u0441\u0442\u0440\u043E\u0438\u043C \u044D\u0442\u043E \u0432\u043C\u0435\u0441\u0442\u0435, \u0448\u0430\u0433 \u0437\u0430 \u0448\u0430\u0433\u043E\u043C.`;
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
    <div className={styles.Backdrop} onClick={handleClose}>
      <div
        className={cn(
          styles.Panel,
          closing ? 'animate-modal-out' : 'animate-modal-in',
        )}
        onClick={e => e.stopPropagation()}
      >
        <div
          className={styles.ScrollContent}
          style={{ opacity: contentVisible ? 1 : 0 }}
        >
          <div className={styles.HeaderRow}>
            <span className={styles.CategoryLabel}>
              <CategoryIcon categoryId={category.id} /> {catName}
            </span>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <div className={styles.NavBtns}>
                <button
                  className={cn(styles.NavBtn, {
                    [styles.NavBtnDisabled]: !prevSkill,
                  })}
                  disabled={!prevSkill}
                  onClick={() => prevSkillId && onSelectSkill(prevSkillId)}
                  title={prevSkill?.name}
                >
                  &#8249;
                </button>
                <button
                  className={cn(styles.NavBtn, {
                    [styles.NavBtnDisabled]: !nextSkill,
                  })}
                  disabled={!nextSkill}
                  onClick={() => nextSkillId && onSelectSkill(nextSkillId)}
                  title={nextSkill?.name}
                >
                  &#8250;
                </button>
              </div>
              <button
                className={styles.CloseBtn}
                onClick={handleClose}
                title="Close"
              >
                &#10005;
              </button>
            </div>
          </div>

          <h2 className={styles.SkillTitle}>
            <span className={styles.TitleKatakana}>
              {getKatakana(skill.name)}
            </span>
            {locSkill.name}
          </h2>

          <div className={styles.MetaRow}>
            <span
              className={styles.DifficultyBadge}
              style={{ color: diff.color, border: `1px solid ${diff.color}40` }}
            >
              {diff.label}
            </span>
            <span className={styles.TimeLabel}>{locSkill.timeEstimate}</span>
          </div>

          <div className={styles.AccentRule} />

          <p className={styles.SectionLabel}>{t.whatYoullBuild}</p>
          <p className={styles.ProjectTitle}>{locSkill.projectTitle}</p>

          <p className={styles.ProjectDesc}>{locSkill.projectDescription}</p>

          <div className={styles.ToolsSection}>
            <p className={styles.SectionLabel}>{t.tools}</p>
            <div className={styles.ToolsWrap}>
              {skill.tools.map(tool => (
                <span key={tool} className={styles.ToolTag}>
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {deps.length > 0 && (
            <div className={styles.DepsSection}>
              <p className={styles.SectionLabel}>{t.prerequisites}</p>
              {deps.map(dep => {
                const depDone = !!progress[dep.id]?.completed;
                const locDep = localizeSkill(dep, locale);
                return (
                  <button
                    key={dep.id}
                    className={cn(styles.DepBtn, { [styles.DepDone]: depDone })}
                    onClick={() => onSelectSkill(dep.id)}
                  >
                    <span>{depDone ? '\u2713' : '\u25CB'}</span>
                    {locDep.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className={styles.InstructionBlock}>
            <div className={styles.InstructionHeader}>
              <p className={styles.InstructionSectionLabel}>
                {t.howToLearnThis}
              </p>
              <button
                className={styles.GuideToggleBtn}
                onClick={() => setShowGuide(!showGuide)}
              >
                {showGuide ? t.hideGuide : t.firstTimeReadThis}
              </button>
            </div>

            {showGuide && (
              <div className={styles.GuideContent}>
                <div className={styles.GuideText}>
                  <p className={styles.GuideHeading}>{t.detailGuideHeading}</p>
                  <div className={styles.GuideStep}>
                    <span className={styles.GuideStepNum}>1.</span>
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {t.detailGuideStep1Bold}
                      </strong>{' '}
                      {t.detailGuideStep1Rest}
                    </span>
                  </div>
                  <div className={styles.GuideStep}>
                    <span className={styles.GuideStepNum}>2.</span>
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {t.detailGuideStep2Bold}
                      </strong>{' '}
                      {t.detailGuideStep2Rest}
                    </span>
                  </div>
                  <div className={styles.GuideStep}>
                    <span className={styles.GuideStepNum}>3.</span>
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {t.detailGuideStep3Bold}
                      </strong>{' '}
                      {t.detailGuideStep3Rest}
                    </span>
                  </div>
                  <p className={styles.GuideTip}>{t.detailGuideTip}</p>
                </div>
              </div>
            )}

            <div className={styles.InstructionText}>
              <p className={styles.InstructionParagraph}>{instruction}</p>
            </div>

            <button
              className={cn(styles.CopyBtn, { [styles.CopyBtnCopied]: copied })}
              onClick={handleCopy}
            >
              {copied ? t.copiedExcl : t.copyInstruction}
            </button>
          </div>
        </div>

        <div className={styles.BottomBar}>
          <button
            className={cn(styles.ToggleBtn, {
              [styles.ToggleBtnUnmark]: isCompleted,
            })}
            onClick={() => onToggle(skill.id, !isCompleted)}
          >
            {isCompleted ? t.unmarkAsLearned : t.markAsLearned}
          </button>
        </div>
      </div>
    </div>
  );
}
