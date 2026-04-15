import cn from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import type { TRouter } from '@local-types/global';
import type { UserProgress } from '@local-types/pageTypes/vibesuite';

import vibesuiteIntl from '@data/vibesuite/intl';
import { knowledgeGapsStages } from '@data/vibesuite/knowledgeGapsStages';
import { localizeSkill } from '@data/vibesuite/localizeSkills';
import { getSkillById } from '@data/vibesuite/skills';

import styles from './KnowledgeGapsMap.module.scss';

interface KnowledgeGapsMapProps {
  progress: UserProgress;
  onClose: () => void;
  onSelectSkill: (skillId: string) => void;
}

const stageKeys: Record<string, string> = {
  tooling: 'stageTooling',
  prototype: 'stagePrototype',
  backend: 'stageBackend',
  'ai-core': 'stageAiCore',
  'frontend-polish': 'stageFrontendPolish',
  infrastructure: 'stageInfrastructure',
  monetization: 'stageMonetization',
  integrations: 'stageIntegrations',
  security: 'stageSecurity',
  scale: 'stageScale',
};

const KnowledgeGapsMap = ({
  progress,
  onClose,
  onSelectSkill,
}: KnowledgeGapsMapProps) => {
  const { locale } = useRouter() as TRouter;
  const t = vibesuiteIntl[locale] as Record<string, string>;
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const stages = useMemo(
    () =>
      knowledgeGapsStages.map(stage => {
        const skills = stage.skillIds
          .map(id => {
            const skill = getSkillById(id);
            return skill ? localizeSkill(skill, locale) : null;
          })
          .filter(Boolean);
        const done = skills.filter(s => progress[s.id]?.completed).length;
        return { ...stage, skills, done, total: skills.length };
      }),
    [locale, progress],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 180);
  };

  return createPortal(
    <div
      className={cn(styles.Backdrop, 'vibesuite-root', {
        [styles.BackdropClosing]: closing,
      })}
      onClick={handleClose}
    >
      <div
        className={cn(styles.Modal, { [styles.ModalClosing]: closing })}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.Header}>
          <div>
            <h2 className={styles.Title}>{t.knowledgeGapsTitle}</h2>
            <p className={styles.Subtitle}>{t.knowledgeGapsSubtitle}</p>
          </div>
          <button className={styles.CloseBtn} onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className={styles.Track}>
          {stages.map((stage, i) => {
            const stageName = t[stageKeys[stage.id]] || stage.id;
            const hasAny = stage.done > 0;
            const isHovered = hoveredStage === stage.id;

            return (
              <div
                key={stage.id}
                className={styles.StageColumn}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <div className={styles.NodeRow}>
                  {i > 0 && <div className={styles.Connector} />}
                  <div
                    className={cn(styles.Node, {
                      [styles.NodeComplete]: hasAny,
                    })}
                  >
                    {hasAny && <span className={styles.NodeCheck}>✓</span>}
                  </div>
                  {i < stages.length - 1 && (
                    <div className={styles.Connector} />
                  )}
                </div>
                <span className={styles.StageName}>{stageName}</span>

                {isHovered && (
                  <div className={styles.Tooltip}>
                    {stage.skills.map(skill => {
                      const learned = !!progress[skill.id]?.completed;
                      return (
                        <button
                          key={skill.id}
                          className={cn(styles.SkillTile, {
                            [styles.SkillTileLearned]: learned,
                          })}
                          onClick={() => {
                            onClose();
                            onSelectSkill(skill.id);
                          }}
                        >
                          {learned && (
                            <span className={styles.SkillCheck}>✓</span>
                          )}
                          <div className={styles.SkillTileContent}>
                            <span className={styles.SkillName}>
                              {skill.name}
                            </span>
                            <span className={styles.SkillTools}>
                              {skill.tools?.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default KnowledgeGapsMap;
