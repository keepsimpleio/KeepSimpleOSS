import { useRouter } from 'next/router';
import { useCallback, useEffect,useMemo, useRef, useState } from 'react';

import type { TRouter } from '@local-types/global';
import { UserProgress } from '@local-types/pageTypes/vibesuite';

import { getRecommendations } from '@lib/vibesuite/recommendations';

import vibesuiteIntl from '@data/vibesuite/intl';
import { localizeCategory } from '@data/vibesuite/localizeSkills';
import {
  allSkills,
  categories,
  getCategoryBySkillId,
  getSkillById,
} from '@data/vibesuite/skills';

import CategoryIcon from '@components/vibesuite/CategoryIcons';
import CategoryNav from '@components/vibesuite/CategoryNav';
import ProgressHeader from '@components/vibesuite/ProgressHeader';
import RecommendationModal from '@components/vibesuite/RecommendationModal';
import SkillCard from '@components/vibesuite/SkillCard';
import SkillDetailPanel from '@components/vibesuite/SkillDetailPanel';

import styles from './MapClient.module.scss';

interface MapClientProps {
  initialProgress: UserProgress;
}

export default function MapClient({ initialProgress }: MapClientProps) {
  const { locale } = useRouter() as TRouter;
  const t = vibesuiteIntl[locale];
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [focusCategoryId, setFocusCategoryId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [whyClosing, setWhyClosing] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideClosing, setGuideClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState<
    'all' | 'learned' | 'not-learned'
  >('all');
  const [panelCloseRequested, setPanelCloseRequested] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const searchRowRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (searchRowRef.current) {
        const rect = searchRowRef.current.getBoundingClientRect();
        setShowScrollTop(rect.bottom < 0);
      } else {
        setShowScrollTop(window.scrollY > 300);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      if (
        selectedSkillId ||
        showWhyModal ||
        showGuideModal ||
        showRecommendations
      ) {
        if (selectedSkillId) setPanelCloseRequested(true);
        if (showWhyModal) {
          setWhyClosing(true);
          setTimeout(() => setShowWhyModal(false), 180);
        }
        if (showGuideModal) {
          setGuideClosing(true);
          setTimeout(() => setShowGuideModal(false), 180);
        }
        if (showRecommendations) {
          setShowRecommendations(false);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showWhyModal, showGuideModal, showRecommendations, selectedSkillId]);

  const selectedSkill = selectedSkillId ? getSkillById(selectedSkillId) : null;
  const selectedCategory = selectedSkillId
    ? getCategoryBySkillId(selectedSkillId)
    : null;

  const { prevSkillId, nextSkillId } = useMemo(() => {
    if (!selectedSkillId) return { prevSkillId: null, nextSkillId: null };
    const idx = allSkills.findIndex(s => s.id === selectedSkillId);
    return {
      prevSkillId: idx > 0 ? allSkills[idx - 1].id : null,
      nextSkillId: idx < allSkills.length - 1 ? allSkills[idx + 1].id : null,
    };
  }, [selectedSkillId]);

  const localizedCategories = useMemo(
    () => categories.map(c => localizeCategory(c, locale)),
    [locale],
  );

  const recommendations = useMemo(
    () => getRecommendations(progress, 3, locale),
    [progress, locale],
  );
  const allCompleted = useMemo(
    () => allSkills.every(s => progress[s.id]?.completed),
    [progress],
  );

  const handleSelectSkill = useCallback((skillId: string) => {
    setSelectedSkillId(skillId);
  }, []);

  const handleToggle = useCallback(
    async (skillId: string, completed: boolean) => {
      setProgress(prev => {
        const next = { ...prev };
        if (completed) {
          next[skillId] = {
            completed: true,
            completedAt: new Date().toISOString(),
          };
        } else {
          delete next[skillId];
        }
        return next;
      });

      if (completed) {
        setSelectedSkillId(null);
      }

      try {
        const res = await fetch('/api/vibesuite/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skillId, completed }),
        });
        if (!res.ok) setProgress(initialProgress);
      } catch {
        setProgress(initialProgress);
      }
    },
    [initialProgress],
  );

  const handleSelectCategory = useCallback((categoryId: string | null) => {
    setFocusCategoryId(categoryId);
    if (categoryId && sectionRefs.current[categoryId]) {
      const el = sectionRefs.current[categoryId];
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 128;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const searchLower = searchQuery.toLowerCase().trim();
  const displayCategories = useMemo(() => {
    return localizedCategories
      .map(cat => ({
        ...cat,
        skills: cat.skills.filter(s => {
          if (
            searchLower &&
            !(
              s.name.toLowerCase().includes(searchLower) ||
              s.projectTitle.toLowerCase().includes(searchLower) ||
              s.projectDescription.toLowerCase().includes(searchLower)
            )
          )
            return false;
          if (showFilter === 'learned' && !progress[s.id]?.completed)
            return false;
          if (showFilter === 'not-learned' && progress[s.id]?.completed)
            return false;
          return true;
        }),
      }))
      .filter(cat => cat.skills.length > 0);
  }, [localizedCategories, searchLower, showFilter, progress]);

  return (
    <div className={`${styles.Root} vibesuite-root`}>
      <ProgressHeader progress={progress} />

      <div className={styles.DesktopOnly}>
        <CategoryNav
          progress={progress}
          activeCategoryId={focusCategoryId}
          onSelectCategory={handleSelectCategory}
          onOpenRecommendations={() => setShowRecommendations(true)}
          onOpenWhyModal={() => {
            setWhyClosing(false);
            setShowWhyModal(true);
          }}
          allCompleted={allCompleted}
        />
      </div>

      <main className={styles.Main}>
        <div className={styles.ContentWrapper}>
          {/* Page title */}
          <div className={styles.PageTitle}>
            <div className={styles.TitleRow}>
              <span className={styles.DiamondAccent} />
              <h1 className={styles.PageH1}>{t.pageTitle}</h1>
              <span className={styles.DiamondAccent} />
            </div>
            <p className={styles.PageSubtitle}>{t.pageSubtitle}</p>
            <button
              className={styles.GuideLink}
              onClick={() => {
                setGuideClosing(false);
                setShowGuideModal(true);
              }}
            >
              {t.firstTimeClick}
            </button>
          </div>

          {/* Search bar + filter */}
          <div ref={searchRowRef} className={styles.SearchRow}>
            <div className={styles.SearchWrap}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={styles.SearchInput}
                style={{ paddingRight: searchQuery ? '2.5rem' : '1rem' }}
              />
              {searchQuery && (
                <button
                  className={styles.SearchClear}
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className={styles.FilterRow}>
              <span className={styles.ShowLabel}>{t.showLabel}</span>
              {(['all', 'learned', 'not-learned'] as const).map(opt => {
                const label =
                  opt === 'all'
                    ? t.filterAll
                    : opt === 'learned'
                      ? t.filterLearned
                      : t.filterNotLearned;
                const isActive = showFilter === opt;
                return (
                  <button
                    key={opt}
                    className={styles.FilterBtn}
                    onClick={() => {
                      if (opt !== showFilter) {
                        setTransitioning(true);
                        setTimeout(() => {
                          setShowFilter(opt);
                          setTimeout(() => setTransitioning(false), 50);
                        }, 150);
                      }
                    }}
                    style={{
                      background: isActive ? 'var(--accent)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-strong)'}`,
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                        e.currentTarget.style.color = 'var(--accent)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor =
                          'var(--border-strong)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category sections */}
          <div
            className={styles.CategoryArea}
            style={{ opacity: transitioning ? 0 : 1 }}
          >
            {displayCategories.map(cat => {
              const originalCat = localizedCategories.find(
                c => c.id === cat.id,
              );
              const total = originalCat
                ? originalCat.skills.length
                : cat.skills.length;
              const done = originalCat
                ? originalCat.skills.filter(s => progress[s.id]?.completed)
                    .length
                : cat.skills.filter(s => progress[s.id]?.completed).length;
              const allDone = done === total && total > 0;

              return (
                <section
                  key={cat.id}
                  ref={el => {
                    sectionRefs.current[cat.id] = el;
                  }}
                  className={styles.CategorySection}
                >
                  <div className={styles.SectionHeader}>
                    <h2 className={styles.SectionH2}>
                      <CategoryIcon categoryId={cat.id} /> {cat.name}
                    </h2>
                    <div className={styles.SectionRule} />
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: allDone
                          ? 'var(--accent)'
                          : 'var(--text-tertiary)',
                        border: `1px solid ${allDone ? 'var(--accent)' : 'var(--border-strong)'}`,
                        padding: '0.25rem 0.75rem',
                        whiteSpace: 'nowrap',
                        userSelect: 'none',
                      }}
                    >
                      {done}/{total}
                    </span>
                  </div>

                  <p className={styles.SectionDesc}>{cat.description}</p>

                  <div
                    className={styles.CardGrid}
                    onClick={e => e.stopPropagation()}
                  >
                    {cat.skills.map(skill => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        category={cat}
                        completed={!!progress[skill.id]?.completed}
                        selected={selectedSkillId === skill.id}
                        onClick={() => handleSelectSkill(skill.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      {/* Scroll to top */}
      <button
        className={styles.ScrollTopBtn}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        style={{
          opacity: showScrollTop ? 1 : 0,
          pointerEvents: showScrollTop ? 'auto' : 'none',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3.5L3.75 9.75L4.64375 10.6438L9.375 5.90625V16.25H10.625V5.90625L15.3563 10.6437L16.25 9.75L10 3.5Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Detail panel */}
      {selectedSkill && selectedCategory && (
        <SkillDetailPanel
          skill={selectedSkill}
          category={selectedCategory}
          progress={progress}
          onToggle={handleToggle}
          onClose={() => {
            setSelectedSkillId(null);
            setPanelCloseRequested(false);
          }}
          onSelectSkill={handleSelectSkill}
          prevSkillId={prevSkillId}
          nextSkillId={nextSkillId}
          requestClose={panelCloseRequested}
        />
      )}

      {/* Recommendation modal */}
      {showRecommendations && recommendations.length > 0 && (
        <RecommendationModal
          recommendations={recommendations}
          onSelectSkill={skillId => {
            setShowRecommendations(false);
            handleSelectSkill(skillId);
          }}
          onClose={() => setShowRecommendations(false)}
        />
      )}

      {/* Guide modal */}
      {showGuideModal &&
        (() => {
          const closeGuide = () => {
            setGuideClosing(true);
            setTimeout(() => setShowGuideModal(false), 180);
          };

          return (
            <div
              className={styles.GuideBackdrop}
              style={{
                background: guideClosing
                  ? 'rgba(0, 0, 0, 0)'
                  : 'rgba(0, 0, 0, 0.35)',
              }}
              onClick={closeGuide}
            >
              <div
                className={`${styles.GuideModal} ${guideClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className={styles.GuideHeader}>
                  <div>
                    <span className={styles.GuideTitleAccent}>
                      {t.guideAccent}
                    </span>
                    <p className={styles.GuideTitleMain}>{t.guideTitle}</p>
                  </div>
                  <button className={styles.GuideCloseBtn} onClick={closeGuide}>
                    ✕
                  </button>
                </div>

                <div className={styles.GuideRedRule} />

                {/* Steps */}
                <div className={styles.GuideSteps}>
                  <div className={styles.GuideStep}>
                    <span className={styles.GuideStepBadge}>1</span>
                    <div>
                      <p className={styles.GuideStepTitle}>
                        {t.guideStep1Title}
                      </p>
                      <p className={styles.GuideStepDesc}>{t.guideStep1Desc}</p>
                    </div>
                  </div>

                  <div className={styles.GuideStepDivider} />

                  <div className={styles.GuideStep}>
                    <span className={styles.GuideStepBadge}>2</span>
                    <div>
                      <p className={styles.GuideStepTitle}>
                        {t.guideStep2Title}
                      </p>
                      <p className={styles.GuideStepDesc}>{t.guideStep2Desc}</p>
                    </div>
                  </div>

                  <div className={styles.GuideStepDivider} />

                  <div className={styles.GuideStep}>
                    <span className={styles.GuideStepBadge}>3</span>
                    <div>
                      <p className={styles.GuideStepTitle}>
                        {t.guideStep3Title}
                      </p>
                      <p className={styles.GuideStepDesc}>{t.guideStep3Desc}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <button className={styles.GuideGotItBtn} onClick={closeGuide}>
                  {t.guideGotIt}
                </button>
              </div>
            </div>
          );
        })()}

      {/* Why modal */}
      {showWhyModal && (
        <div
          className={styles.WhyBackdrop}
          style={{
            background: whyClosing
              ? 'rgba(28, 28, 26, 0)'
              : 'rgba(28, 28, 26, 0.35)',
          }}
          onClick={() => {
            setWhyClosing(true);
            setTimeout(() => setShowWhyModal(false), 180);
          }}
        >
          <div
            className={`${styles.WhyModal} ${whyClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Background images */}
            <div className={`${styles.WhyBgImg} ${styles.WhyBgImg1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/keepsimple_/assets/vibesuite/why-bg-3.jpg" alt="" />
            </div>
            <div className={`${styles.WhyBgImg} ${styles.WhyBgImg2}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/keepsimple_/assets/vibesuite/why-bg-1.jpg" alt="" />
            </div>
            <div className={`${styles.WhyBgImg} ${styles.WhyBgImg3}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/keepsimple_/assets/vibesuite/why-bg-2.webp" alt="" />
            </div>

            <div className={styles.WhyContent}>
              <div className={styles.WhyCloseRow}>
                <button
                  className={styles.WhyCloseBtn}
                  onClick={() => {
                    setWhyClosing(true);
                    setTimeout(() => setShowWhyModal(false), 180);
                  }}
                >
                  ✕
                </button>
              </div>
              <div className={styles.WhyRedRule} />
              <div className={styles.WhyBody}>
                <p>{t.whyP1}</p>
                <p>{t.whyP2}</p>
                <p>{t.whyP3}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
