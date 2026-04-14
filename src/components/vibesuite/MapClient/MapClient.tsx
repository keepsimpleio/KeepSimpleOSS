import { useRouter } from 'next/router';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { TRouter } from '@local-types/global';
import { UserProgress } from '@local-types/pageTypes/vibesuite';

import { getRecommendations } from '@lib/vibesuite/recommendations';

import { updateLearnedSkills } from '@api/vibesuite';

import vibesuiteIntl from '@data/vibesuite/intl';
import { localizeCategory } from '@data/vibesuite/localizeSkills';
import {
  allSkills,
  categories,
  getCategoryBySkillId,
  getSkillById,
} from '@data/vibesuite/skills';

import ArrowUp from '@icons/tools/vibesuite/ArrowUp';

import { GlobalContext } from '@components/Context/GlobalContext';
import Heading from '@components/Heading';
import LogIn from '@components/LogIn';
import CategoryIcon from '@components/vibesuite/CategoryIcons';
import CategoryNav from '@components/vibesuite/CategoryNav';
import ProgressHeader from '@components/vibesuite/ProgressHeader';
import RecommendationModal from '@components/vibesuite/RecommendationModal';
import SkillCard from '@components/vibesuite/SkillCard';
import SkillDetailPanel from '@components/vibesuite/SkillDetailPanel';

import { MapClientProps } from './MapClient.types';

import styles from './MapClient.module.scss';

export default function MapClient({
  initialProgress,
  isDarkTheme,
}: MapClientProps) {
  const { locale } = useRouter() as TRouter;
  const t = vibesuiteIntl[locale];
  const { accountData } = useContext(GlobalContext) ?? {};
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
  const [showLogin, setShowLogin] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const searchRowRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const learned: string[] = accountData?.learnedSkills ?? [];
    if (learned.length === 0) return;
    const hydrated: UserProgress = {};
    for (const id of learned) {
      hydrated[id] = { completed: true, completedAt: '' };
    }
    setProgress(hydrated);
  }, [accountData]);

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

  const handleToggle = useCallback((skillId: string, completed: boolean) => {
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

      // Fire-and-forget: send updated state to backend
      const learnedSkills = Object.keys(next).filter(id => next[id]?.completed);
      updateLearnedSkills(learnedSkills).catch(() => {});

      return next;
    });

    if (completed) {
      setSelectedSkillId(null);
    }
  }, []);

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
    <div className={`${styles.root} vibesuite-root`}>
      <ProgressHeader progress={progress} />

      <div className={styles.desktopOnly}>
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

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* Page title */}
          <div className={styles.pageTitle}>
            <Heading
              text={t.pageTitle}
              Tag="h1"
              showLeftIcon
              showRightIcon
              textAlign="center"
              className={styles.titleRow}
              textColor={isDarkTheme ? '#ffffffd9' : undefined}
            />
            <p className={styles.pageSubtitle}>{t.pageSubtitle}</p>
            <button
              className={styles.guideLink}
              onClick={() => {
                setGuideClosing(false);
                setShowGuideModal(true);
              }}
            >
              {t.firstTimeClick}
            </button>
          </div>

          {/* Search bar + filter */}
          <div ref={searchRowRef} role="search" className={styles.searchRow}>
            <div className={styles.searchWrap}>
              <input
                type="text"
                role="searchbox"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className={styles.searchInput}
                style={{ paddingRight: searchQuery ? '2.5rem' : '1rem' }}
              />
              {searchQuery && (
                <button
                  className={styles.searchClear}
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div
              className={styles.filterRow}
              role="group"
              aria-label={t.showLabel}
            >
              <span className={styles.showLabel} aria-hidden="true">
                {t.showLabel}
              </span>
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
                    className={styles.filterBtn}
                    aria-pressed={isActive}
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
            className={styles.categoryArea}
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
                  className={styles.categorySection}
                >
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionH2}>
                      <CategoryIcon categoryId={cat.id} /> {cat.name}
                    </h2>
                    <div className={styles.sectionRule} />
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

                  <p className={styles.sectionDesc}>{cat.description}</p>

                  <ul
                    className={styles.cardGrid}
                    onClick={e => e.stopPropagation()}
                  >
                    {cat.skills.map(skill => (
                      <li key={skill.id} className={styles.cardGridItem}>
                        <SkillCard
                          skill={skill}
                          category={cat}
                          completed={!!progress[skill.id]?.completed}
                          selected={selectedSkillId === skill.id}
                          onClick={() => handleSelectSkill(skill.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      {/* Scroll to top */}
      <button
        className={styles.scrollTopBtn}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        style={{
          opacity: showScrollTop ? 1 : 0,
          pointerEvents: showScrollTop ? 'auto' : 'none',
        }}
      >
        <ArrowUp />
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
          isLoggedIn={!!accountData}
          onOpenLogin={() => setShowLogin(true)}
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
              className={styles.guideBackdrop}
              style={{
                background: guideClosing
                  ? 'rgba(0, 0, 0, 0)'
                  : 'rgba(0, 0, 0, 0.35)',
              }}
              onClick={closeGuide}
            >
              <div
                role="dialog"
                aria-label={t.guideTitle}
                className={`${styles.guideModal} ${guideClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className={styles.guideHeader}>
                  <div>
                    <span className={styles.guideTitleAccent}>
                      {t.guideAccent}
                    </span>
                    <p className={styles.guideTitleMain}>{t.guideTitle}</p>
                  </div>
                  <button
                    className={styles.guideCloseBtn}
                    onClick={closeGuide}
                    aria-label="Close guide"
                  >
                    ✕
                  </button>
                </div>

                <div className={styles.guideRedRule} />

                {/* Steps */}
                <ol className={styles.guideSteps}>
                  <li className={styles.guideStep}>
                    <span className={styles.guideStepBadge} aria-hidden="true">
                      1
                    </span>
                    <div>
                      <p className={styles.guideStepTitle}>
                        {t.guideStep1Title}
                      </p>
                      <p className={styles.guideStepDesc}>{t.guideStep1Desc}</p>
                    </div>
                  </li>

                  <li className={styles.guideStepDivider} aria-hidden="true" />

                  <li className={styles.guideStep}>
                    <span className={styles.guideStepBadge} aria-hidden="true">
                      2
                    </span>
                    <div>
                      <p className={styles.guideStepTitle}>
                        {t.guideStep2Title}
                      </p>
                      <p className={styles.guideStepDesc}>{t.guideStep2Desc}</p>
                    </div>
                  </li>

                  <li className={styles.guideStepDivider} aria-hidden="true" />

                  <li className={styles.guideStep}>
                    <span className={styles.guideStepBadge} aria-hidden="true">
                      3
                    </span>
                    <div>
                      <p className={styles.guideStepTitle}>
                        {t.guideStep3Title}
                      </p>
                      <p className={styles.guideStepDesc}>{t.guideStep3Desc}</p>
                    </div>
                  </li>
                </ol>

                {/* Footer */}
                <button className={styles.guideGotItBtn} onClick={closeGuide}>
                  {t.guideGotIt}
                </button>
              </div>
            </div>
          );
        })()}

      {/* Why modal */}
      {showWhyModal && (
        <div
          className={styles.whyBackdrop}
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
            role="dialog"
            aria-label={t.whyDoINeedThis}
            className={`${styles.whyModal} ${whyClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Background images */}
            <div className={`${styles.whyBgImg} ${styles.whyBgImg1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/keepsimple_/assets/vibesuite/why-bg-3.jpg" alt="" />
            </div>
            <div className={`${styles.whyBgImg} ${styles.whyBgImg2}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/keepsimple_/assets/vibesuite/why-bg-1.jpg" alt="" />
            </div>
            <div className={`${styles.whyBgImg} ${styles.whyBgImg3}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/keepsimple_/assets/vibesuite/why-bg-2.webp" alt="" />
            </div>

            <div className={styles.whyContent}>
              <div className={styles.whyCloseRow}>
                <button
                  className={styles.whyCloseBtn}
                  onClick={() => {
                    setWhyClosing(true);
                    setTimeout(() => setShowWhyModal(false), 180);
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className={styles.whyRedRule} />
              <div className={styles.whyBody}>
                <p>{t.whyP1}</p>
                <p>{t.whyP2}</p>
                <p>{t.whyP3}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showLogin && <LogIn setShowLogIn={setShowLogin} />}
    </div>
  );
}
