import cn from 'classnames';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { TRouter } from '@local-types/global';

import vibesuiteIntl from '@data/vibesuite/intl';
import { localizeCategory } from '@data/vibesuite/localizeSkills';
import { categories, getTotalSkillCount } from '@data/vibesuite/skills';

import { ProgressHeaderProps } from './ProgressHeader.types';

import styles from './ProgressHeader.module.scss';

const MILESTONE_KEYS = [
  { pct: 20, key: 'milestoneObserver' as const, kanji: '\u89B3' },
  { pct: 50, key: 'milestoneExplorer' as const, kanji: '\u63A2' },
  { pct: 80, key: 'milestoneMaster' as const, kanji: '\u5E2B' },
  { pct: 100, key: 'milestoneSingularity' as const, kanji: '\u221E' },
];

const HIT_RADIUS = 24;

export default function ProgressHeader({ progress }: ProgressHeaderProps) {
  const { locale } = useRouter() as TRouter;
  const t = vibesuiteIntl[locale];

  const milestones = useMemo(
    () => MILESTONE_KEYS.map(m => ({ ...m, label: t[m.key] })),
    [t],
  );

  const localizedCats = useMemo(
    () => categories.map(c => localizeCategory(c, locale)),
    [locale],
  );

  const total = getTotalSkillCount();
  const completed = Object.values(progress).filter(p => p.completed).length;
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressClosing, setProgressClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const displayPctRef = useRef(0);
  const hoveredMilestoneRef = useRef<number>(-1);
  const hoveredMilestoneAnimRef = useRef<number[]>(milestones.map(() => 0));
  const [tooltipData, setTooltipData] = useState<{
    text: string;
    x: number;
    reached: boolean;
  } | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const milestonePositions = useRef<
    { pct: number; x: number; label: string; skillsNeeded: number }[]
  >([]);

  const draw = useCallback(
    (canvas: HTMLCanvasElement, time: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const isDark = document.body.classList.contains('darkTheme');

      const target = pct;
      const current = displayPctRef.current;
      displayPctRef.current += (target - current) * 0.04;
      if (Math.abs(displayPctRef.current - target) < 0.05)
        displayPctRef.current = target;
      const displayPct = displayPctRef.current;

      const hoverAnims = hoveredMilestoneAnimRef.current;
      for (let i = 0; i < milestones.length; i++) {
        const tgt = hoveredMilestoneRef.current === i ? 1 : 0;
        hoverAnims[i] += (tgt - hoverAnims[i]) * 0.12;
        if (Math.abs(hoverAnims[i] - tgt) < 0.01) hoverAnims[i] = tgt;
      }

      const barY = h / 2 + 1;
      const barH = 2;
      const padL = 16;
      const padR = 40;
      const barW = w - padL - padR;

      ctx.beginPath();
      ctx.moveTo(padL, barY);
      ctx.lineTo(padL + barW, barY);
      ctx.strokeStyle = isDark ? '#3a4050' : '#DDD7CE';
      ctx.lineWidth = barH;
      ctx.lineCap = 'round';
      ctx.stroke();

      const fillEnd = padL + (displayPct / 100) * barW;
      if (displayPct > 0) {
        ctx.beginPath();
        ctx.moveTo(padL, barY);
        ctx.lineTo(fillEnd, barY);
        ctx.strokeStyle = 'rgba(184, 50, 50, 0.1)';
        ctx.lineWidth = barH + 8;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padL, barY);
        ctx.lineTo(fillEnd, barY);
        ctx.strokeStyle = '#B83232';
        ctx.lineWidth = barH;
        ctx.lineCap = 'round';
        ctx.stroke();

        const pulse = (Math.sin(time * 1.8) + 1) / 2;
        const glowR = 6 + pulse * 4;
        const glowA = 0.08 + pulse * 0.07;
        ctx.beginPath();
        ctx.arc(fillEnd, barY, glowR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 50, 50, ${glowA})`;
        ctx.fill();

        const dotR = 3 + pulse * 1;
        ctx.beginPath();
        ctx.arc(fillEnd, barY, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 50, 50, ${0.6 + pulse * 0.3})`;
        ctx.fill();
      }

      const positions: typeof milestonePositions.current = [];

      milestones.forEach((m, i) => {
        const mx = padL + (m.pct / 100) * barW;
        const reached = displayPct >= m.pct;
        const skillsNeeded = Math.ceil((m.pct / 100) * total) - completed;
        const hoverAmt = hoverAnims[i];
        const isLast = i === milestones.length - 1;

        positions.push({
          pct: m.pct,
          x: mx,
          label: m.label,
          skillsNeeded: Math.max(0, skillsNeeded),
        });

        if (hoverAmt > 0.01) {
          const glowR2 = 18 + hoverAmt * 6;
          const glowA2 = hoverAmt * (reached ? 0.15 : 0.1);
          const gradient = ctx.createRadialGradient(
            mx,
            barY,
            0,
            mx,
            barY,
            glowR2,
          );
          gradient.addColorStop(0, `rgba(184, 50, 50, ${glowA2})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.beginPath();
          ctx.arc(mx, barY, glowR2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        const tickH = 7 + hoverAmt * 2;
        const tickAlpha = reached
          ? 0.45 + hoverAmt * 0.3
          : 0.25 + hoverAmt * 0.5;
        ctx.beginPath();
        ctx.moveTo(mx, barY - tickH);
        ctx.lineTo(mx, barY + tickH);
        ctx.strokeStyle =
          reached || hoverAmt > 0.01
            ? `rgba(184, 50, 50, ${tickAlpha})`
            : isDark
              ? '#3a4050'
              : '#D5CFC7';
        ctx.lineWidth = 1 + hoverAmt * 0.5;
        ctx.lineCap = 'butt';
        ctx.stroke();

        const dS = (reached ? 3.5 : 2.5) + hoverAmt * 1.5;
        ctx.save();
        ctx.translate(mx, barY - 11 - hoverAmt * 1);
        ctx.rotate(Math.PI / 4);
        if (reached || hoverAmt > 0.3) {
          const fillAlpha = reached ? 1 : hoverAmt;
          ctx.fillStyle = `rgba(184, 50, 50, ${fillAlpha})`;
          ctx.fillRect(-dS / 2, -dS / 2, dS, dS);
          const pR = dS + 1.5 + Math.sin(time * 1.5 + m.pct * 0.1) * 1;
          ctx.strokeStyle = `rgba(184, 50, 50, ${
            0.15 + Math.sin(time * 1.5 + m.pct * 0.1) * 0.08 + hoverAmt * 0.15
          })`;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(-pR / 2, -pR / 2, pR, pR);
        } else if (hoverAmt > 0.01) {
          ctx.strokeStyle = `rgba(184, 50, 50, ${0.3 + hoverAmt * 0.7})`;
          ctx.lineWidth = 0.75 + hoverAmt * 0.5;
          ctx.strokeRect(-dS / 2, -dS / 2, dS, dS);
        } else {
          ctx.strokeStyle = isDark ? '#3a4050' : '#D5CFC7';
          ctx.lineWidth = 0.75;
          ctx.strokeRect(-dS / 2, -dS / 2, dS, dS);
        }
        ctx.restore();

        const labelSize = 8 + hoverAmt * 1;
        ctx.font = `${400 + hoverAmt * 100} ${labelSize}px Jost, system-ui, sans-serif`;
        ctx.textAlign = isLast ? 'right' : 'center';
        ctx.fillStyle =
          reached || hoverAmt > 0.01
            ? `rgba(184, 50, 50, ${reached ? 1 : 0.4 + hoverAmt * 0.6})`
            : isDark
              ? 'rgba(160, 160, 160, 0.5)'
              : 'rgba(181, 175, 168, 0.6)';
        ctx.fillText(m.label.toUpperCase(), isLast ? mx : mx, barY + 18);

        const kanjiSize = 10 + hoverAmt * 2;
        ctx.font = `${kanjiSize}px "Noto Serif JP", serif`;
        ctx.textAlign = isLast ? 'right' : 'center';
        ctx.fillStyle = `rgba(184, 50, 50, ${
          reached
            ? 0.2 + Math.sin(time * 1.2 + m.pct * 0.05) * 0.08 + hoverAmt * 0.15
            : 0.08 + hoverAmt * 0.25
        })`;
        ctx.fillText(m.kanji, isLast ? mx : mx, barY - 21 - hoverAmt * 1);
      });

      milestonePositions.current = positions;

      ctx.font = '300 7px Jost, system-ui, sans-serif';
      ctx.textAlign = 'center';
      const ga = 0.07 + Math.sin(time * 0.6) * 0.03;
      ctx.fillStyle = isDark
        ? `rgba(218, 218, 218, ${ga})`
        : `rgba(28, 28, 26, ${ga})`;
      ctx.fillText(t.toTheGlory, padL + barW / 2, barY + 28);
    },
    [pct, total, completed, milestones, t],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let running = true;
    const loop = (ts: number) => {
      if (!running) return;
      timeRef.current = ts / 1000;
      draw(canvas, timeRef.current);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  const showTooltip = useCallback(
    (text: string, x: number, reached: boolean) => {
      clearTimeout(tooltipTimer.current);
      setTooltipData({ text, x, reached });
      requestAnimationFrame(() => setTooltipVisible(true));
    },
    [],
  );

  const hideTooltip = useCallback(() => {
    setTooltipVisible(false);
    hoveredMilestoneRef.current = -1;
    tooltipTimer.current = setTimeout(() => setTooltipData(null), 250);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const barY = rect.height / 2 + 1;

      let found = false;
      for (let i = 0; i < milestonePositions.current.length; i++) {
        const mp = milestonePositions.current[i];
        const dist = Math.sqrt((mx - mp.x) ** 2 + (my - barY) ** 2);
        if (dist < HIT_RADIUS) {
          hoveredMilestoneRef.current = i;
          const n = mp.skillsNeeded;
          const reached = n === 0;
          const text = reached
            ? `${mp.label} \u2014 ${t.reached}`
            : `${n} ${n === 1 ? t.skillSingular : t.skillPlural} ${t.toMilestone} ${mp.label}`;
          showTooltip(text, mp.x, reached);
          found = true;
          break;
        }
      }
      if (!found) {
        hoveredMilestoneRef.current = -1;
        if (tooltipData) hideTooltip();
      }
    },
    [tooltipData, showTooltip, hideTooltip, t],
  );

  const handleMouseLeave = useCallback(() => {
    hoveredMilestoneRef.current = -1;
    hideTooltip();
  }, [hideTooltip]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <strong className={styles.logoBold}>vibe</strong>code
      </div>

      <div className={styles.progressWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: tooltipData ? 'pointer' : 'default' }}
        />
        {tooltipData && (
          <div
            className={cn(styles.tooltip, {
              [styles.tooltipReached]: tooltipData.reached,
              [styles.tooltipVisible]: tooltipVisible,
            })}
            style={{
              left: tooltipData.x,
              transform: `translateX(-50%) translateY(${tooltipVisible ? '0' : '-6px'})`,
            }}
          >
            {tooltipData.text}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <span className={styles.statsText}>
          {completed}
          <span className={styles.statsDim}> / {total}</span>
          <span className={styles.statsDim}> ({Math.round(pct)}%)</span>
        </span>

        <button
          className={styles.actionBtn}
          onClick={() => {
            setProgressClosing(false);
            setCopied(false);
            setShowProgressModal(true);
          }}
        >
          {t.myProgress}
        </button>
      </div>

      {showProgressModal && (
        <div
          className={cn(styles.modalBackdrop)}
          onClick={() => {
            setProgressClosing(true);
            setTimeout(() => {
              setShowProgressModal(false);
              setProgressClosing(false);
            }, 180);
          }}
        >
          <div
            role="dialog"
            aria-label={t.myProgress}
            className={cn(
              styles.modalBox,
              progressClosing ? 'animate-modal-out' : 'animate-modal-in',
            )}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>{t.myProgress}</h2>
              <p className={styles.modalBody}>{t.progressBody1}</p>
              <p className={styles.modalBodyBottom}>{t.progressBody2}</p>

              <div className={styles.modalBtns}>
                <button
                  className={cn(styles.copyStateBtn, {
                    [styles.copyStateBtnCopied]: copied,
                  })}
                  onClick={() => {
                    const lines: string[] = [];
                    lines.push(t.copyStateLine1);
                    lines.push('');
                    lines.push(t.copyStateLine2);
                    lines.push(t.copyStateLine3);
                    lines.push(t.copyStateLine4);
                    lines.push(t.copyStateLine5);
                    lines.push('');
                    lines.push(
                      `${t.progressPrefix} ${completed}/${total} ${t.skillsWord} (${Math.round(pct)}%)`,
                    );
                    lines.push('');
                    localizedCats.forEach(cat => {
                      const catDone = cat.skills.filter(
                        s => progress[s.id]?.completed,
                      ).length;
                      lines.push(
                        `## ${cat.name} (${catDone}/${cat.skills.length})`,
                      );
                      cat.skills.forEach(skill => {
                        const learned = !!progress[skill.id]?.completed;
                        lines.push(
                          `- [${learned ? t.learned : t.notLearned}] ${skill.name}: ${skill.projectDescription}`,
                        );
                      });
                      lines.push('');
                    });
                    lines.push('---');
                    lines.push(t.copyStateEnd);
                    navigator.clipboard.writeText(lines.join('\n'));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? t.copied : t.copyMyLearningState}
                </button>
                <button
                  className={styles.closeModalBtn}
                  onClick={() => {
                    setProgressClosing(true);
                    setTimeout(() => {
                      setShowProgressModal(false);
                      setProgressClosing(false);
                    }, 180);
                  }}
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
