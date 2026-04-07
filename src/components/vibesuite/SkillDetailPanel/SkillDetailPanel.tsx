import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import { Skill, SkillCategory, UserProgress } from '@local-types/pageTypes/vibesuite';
import { getDependencies, getSkillById } from '@data/vibesuite/skills';

import CategoryIcon from '@components/vibesuite/CategoryIcons';

import styles from './SkillDetailPanel.module.scss';

const KATAKANA_MAP: Record<string, string> = {
  a: 'ア', b: 'ビ', c: 'ク', d: 'デ', e: 'エ', f: 'フ', g: 'グ', h: 'ハ',
  i: 'イ', j: 'ジ', k: 'カ', l: 'ル', m: 'マ', n: 'ナ', o: 'オ', p: 'プ',
  q: 'ク', r: 'ラ', s: 'サ', t: 'タ', u: 'ウ', v: 'ヴ', w: 'ワ', x: 'シ',
  y: 'ヤ', z: 'ズ',
};

function getKatakana(name: string): string {
  const first = name.charAt(0).toLowerCase();
  return KATAKANA_MAP[first] || 'ス';
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

const difficultyDisplay: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: '#6B8E6B' },
  intermediate: { label: 'Intermediate', color: '#B8960B' },
  advanced: { label: 'Advanced', color: 'var(--accent)' },
};

function buildInstruction(skill: Skill): string {
  const title = skill.projectTitle
    .replace(/\byour\b/gi, 'my')
    .replace(/\byou\b/gi, 'I');
  const lower = title.charAt(0).toLowerCase() + title.slice(1);
  const tools = skill.tools.join(', ');
  const plural = skill.tools.length > 1;
  return `I want to learn "${skill.name}" to know how to ${lower}. I've been looking into ${tools} for this — if ${plural ? "they're a good fit" : "it's a good fit"} for my project, let's use ${plural ? 'them' : 'it'}. Can we build this together?`;
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
  const isCompleted = !!progress[skill.id]?.completed;
  const deps = getDependencies(skill.id);
  const diff = difficultyDisplay[skill.difficulty];
  const instruction = buildInstruction(skill);
  const [copied, setCopied] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const prevSkillRef = useRef(skill.id);

  const prevSkill = prevSkillId ? getSkillById(prevSkillId) : null;
  const nextSkill = nextSkillId ? getSkillById(nextSkillId) : null;

  // Smooth fade when switching between skills
  useEffect(() => {
    if (skill.id !== prevSkillRef.current) {
      prevSkillRef.current = skill.id;
      setContentVisible(false);
      setCopied(false);
      const t = requestAnimationFrame(() => {
        requestAnimationFrame(() => setContentVisible(true));
      });
      return () => cancelAnimationFrame(t);
    }
  }, [skill.id]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 180);
  };

  // Parent can request close (e.g. ESC key)
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable content */}
        <div
          className={styles.ScrollContent}
          style={{ opacity: contentVisible ? 1 : 0 }}
        >
          {/* Category label + nav + close button */}
          <div className={styles.HeaderRow}>
            <span className={styles.CategoryLabel}>
              <CategoryIcon categoryId={category.id} /> {category.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className={styles.NavBtns}>
                <button
                  className={cn(styles.NavBtn, { [styles.NavBtnDisabled]: !prevSkill })}
                  disabled={!prevSkill}
                  onClick={() => prevSkillId && onSelectSkill(prevSkillId)}
                  title={prevSkill?.name}
                >
                  ‹
                </button>
                <button
                  className={cn(styles.NavBtn, { [styles.NavBtnDisabled]: !nextSkill })}
                  disabled={!nextSkill}
                  onClick={() => nextSkillId && onSelectSkill(nextSkillId)}
                  title={nextSkill?.name}
                >
                  ›
                </button>
              </div>
              <button className={styles.CloseBtn} onClick={handleClose} title="Close">
                ✕
              </button>
            </div>
          </div>

          {/* Skill name with katakana */}
          <h2 className={styles.SkillTitle}>
            <span className={styles.TitleKatakana}>{getKatakana(skill.name)}</span>
            {skill.name}
          </h2>

          {/* Difficulty + Time */}
          <div className={styles.MetaRow}>
            <span
              className={styles.DifficultyBadge}
              style={{ color: diff.color, border: `1px solid ${diff.color}40` }}
            >
              {diff.label}
            </span>
            <span className={styles.TimeLabel}>{skill.timeEstimate}</span>
          </div>

          {/* Red accent rule */}
          <div className={styles.AccentRule} />

          {/* What you'll build */}
          <p className={styles.SectionLabel}>What you&apos;ll build</p>
          <p className={styles.ProjectTitle}>{skill.projectTitle}</p>

          {/* Description */}
          <p className={styles.ProjectDesc}>{skill.projectDescription}</p>

          {/* Tools */}
          <div className={styles.ToolsSection}>
            <p className={styles.SectionLabel}>Tools</p>
            <div className={styles.ToolsWrap}>
              {skill.tools.map((tool) => (
                <span key={tool} className={styles.ToolTag}>
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Dependencies */}
          {deps.length > 0 && (
            <div className={styles.DepsSection}>
              <p className={styles.SectionLabel}>Prerequisites</p>
              {deps.map((dep) => {
                const depDone = !!progress[dep.id]?.completed;
                return (
                  <button
                    key={dep.id}
                    className={cn(styles.DepBtn, { [styles.DepDone]: depDone })}
                    onClick={() => onSelectSkill(dep.id)}
                  >
                    <span>{depDone ? '✓' : '○'}</span>
                    {dep.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* HOW TO LEARN — emphasized instruction block */}
          <div className={styles.InstructionBlock}>
            {/* Section header with guide toggle */}
            <div className={styles.InstructionHeader}>
              <p className={styles.InstructionSectionLabel}>How to learn this</p>
              <button
                className={styles.GuideToggleBtn}
                onClick={() => setShowGuide(!showGuide)}
              >
                {showGuide ? 'Hide guide' : 'First time? Read this'}
              </button>
            </div>

            {/* Intro guide — collapsible */}
            {showGuide && (
              <div className={styles.GuideContent}>
                <div className={styles.GuideText}>
                  <p className={styles.GuideHeading}>
                    Each skill is a real project you build with AI:
                  </p>
                  <div className={styles.GuideStep}>
                    <span className={styles.GuideStepNum}>1.</span>
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        Copy the instruction
                      </strong>{' '}
                      below and paste it into your AI assistant (Claude, ChatGPT, Cursor, etc.)
                    </span>
                  </div>
                  <div className={styles.GuideStep}>
                    <span className={styles.GuideStepNum}>2.</span>
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>Follow along</strong> as
                      the AI walks you through building it step by step in your own project
                    </span>
                  </div>
                  <div className={styles.GuideStep}>
                    <span className={styles.GuideStepNum}>3.</span>
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>Mark as learned</strong>{' '}
                      once you&apos;ve completed it. No quizzes, no grades &mdash; you built it,
                      you learned it.
                    </span>
                  </div>
                  <p className={styles.GuideTip}>
                    That&apos;s it. No videos. No courses. You learn by building real things.
                  </p>
                </div>
              </div>
            )}

            {/* Instruction text */}
            <div className={styles.InstructionText}>
              <p className={styles.InstructionParagraph}>{instruction}</p>
            </div>

            {/* Copy button */}
            <button
              className={cn(styles.CopyBtn, { [styles.CopyBtnCopied]: copied })}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy Instruction'}
            </button>
          </div>
        </div>

        {/* Toggle button — pinned to bottom */}
        <div className={styles.BottomBar}>
          <button
            className={cn(styles.ToggleBtn, { [styles.ToggleBtnUnmark]: isCompleted })}
            onClick={() => onToggle(skill.id, !isCompleted)}
          >
            {isCompleted ? 'Unmark as Learned' : 'Mark as Learned'}
          </button>
        </div>
      </div>
    </div>
  );
}
