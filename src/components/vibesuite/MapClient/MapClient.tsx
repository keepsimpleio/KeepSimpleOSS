import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { UserProgress } from '@local-types/pageTypes/vibesuite';
import { categories, allSkills, getSkillById, getCategoryBySkillId } from '@data/vibesuite/skills';
import ProgressHeader from '@components/vibesuite/ProgressHeader';
import CategoryNav from '@components/vibesuite/CategoryNav';
import SkillDetailPanel from '@components/vibesuite/SkillDetailPanel';
import SkillCard from '@components/vibesuite/SkillCard';
import CategoryIcon from '@components/vibesuite/CategoryIcons';
import RecommendationModal from '@components/vibesuite/RecommendationModal';
import { getRecommendations } from '@lib/vibesuite/recommendations';
import styles from './MapClient.module.scss';

interface MapClientProps {
  initialProgress: UserProgress;
}

export default function MapClient({ initialProgress }: MapClientProps) {
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
  const [showFilter, setShowFilter] = useState<'all' | 'learned' | 'not-learned'>('all');
  const [panelCloseRequested, setPanelCloseRequested] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      if (selectedSkillId || showWhyModal || showGuideModal || showRecommendations) {
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
  const selectedCategory = selectedSkillId ? getCategoryBySkillId(selectedSkillId) : null;

  const { prevSkillId, nextSkillId } = useMemo(() => {
    if (!selectedSkillId) return { prevSkillId: null, nextSkillId: null };
    const idx = allSkills.findIndex((s) => s.id === selectedSkillId);
    return {
      prevSkillId: idx > 0 ? allSkills[idx - 1].id : null,
      nextSkillId: idx < allSkills.length - 1 ? allSkills[idx + 1].id : null,
    };
  }, [selectedSkillId]);

  const recommendations = useMemo(() => getRecommendations(progress, 3), [progress]);
  const allCompleted = useMemo(() => allSkills.every((s) => progress[s.id]?.completed), [progress]);

  const handleSelectSkill = useCallback((skillId: string) => {
    setSelectedSkillId(skillId);
  }, []);

  const handleToggle = useCallback(
    async (skillId: string, completed: boolean) => {
      setProgress((prev) => {
        const next = { ...prev };
        if (completed) {
          next[skillId] = { completed: true, completedAt: new Date().toISOString() };
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
        const top = el.getBoundingClientRect().top + window.scrollY - 58 - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const searchLower = searchQuery.toLowerCase().trim();
  const displayCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        skills: cat.skills.filter((s) => {
          if (searchLower && !(
            s.name.toLowerCase().includes(searchLower) ||
            s.projectTitle.toLowerCase().includes(searchLower) ||
            s.projectDescription.toLowerCase().includes(searchLower)
          )) return false;
          if (showFilter === 'learned' && !progress[s.id]?.completed) return false;
          if (showFilter === 'not-learned' && progress[s.id]?.completed) return false;
          return true;
        }),
      }))
      .filter((cat) => cat.skills.length > 0);
  }, [searchLower, showFilter, progress]);

  return (
    <div className={`${styles.Root} vibesuite-root`}>
      <ProgressHeader progress={progress} />

      <div className={styles.DesktopOnly}>
        <CategoryNav
          progress={progress}
          activeCategoryId={focusCategoryId}
          onSelectCategory={handleSelectCategory}
          onOpenRecommendations={() => setShowRecommendations(true)}
          onOpenWhyModal={() => { setWhyClosing(false); setShowWhyModal(true); }}
          allCompleted={allCompleted}
        />
      </div>

      <main className={styles.Main}>
        <div className={styles.ContentWrapper}>
          {/* Page title */}
          <div className={styles.PageTitle}>
            <div className={styles.TitleRow}>
              <span className={styles.DiamondAccent} />
              <h1 className={styles.PageH1}>Vibe Suite — AI Skill Guide</h1>
              <span className={styles.DiamondAccent} />
            </div>
            <p className={styles.PageSubtitle}>Your path from first prompt to shipped product</p>
            <button
              className={styles.GuideLink}
              onClick={() => { setGuideClosing(false); setShowGuideModal(true); }}
            >
              First time? Click here
            </button>
          </div>

          {/* Search bar + filter */}
          <div className={styles.SearchRow}>
            <div className={styles.SearchWrap}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills..."
                className={styles.SearchInput}
                style={{ paddingRight: searchQuery ? '2.5rem' : '1rem' }}
              />
              {searchQuery && (
                <button className={styles.SearchClear} onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>

            <div className={styles.FilterRow}>
              <span className={styles.ShowLabel}>Show</span>
              {(['all', 'learned', 'not-learned'] as const).map((opt) => {
                const label = opt === 'all' ? 'All' : opt === 'learned' ? 'Learned' : 'Not Learned';
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
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                        e.currentTarget.style.color = 'var(--accent)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = 'var(--border-strong)';
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
          <div className={styles.CategoryArea} style={{ opacity: transitioning ? 0 : 1 }}>
            {displayCategories.map((cat) => {
              const originalCat = categories.find((c) => c.id === cat.id);
              const total = originalCat ? originalCat.skills.length : cat.skills.length;
              const done = originalCat
                ? originalCat.skills.filter((s) => progress[s.id]?.completed).length
                : cat.skills.filter((s) => progress[s.id]?.completed).length;
              const allDone = done === total && total > 0;

              return (
                <section
                  key={cat.id}
                  ref={(el) => { sectionRefs.current[cat.id] = el; }}
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
                        color: allDone ? 'var(--accent)' : 'var(--text-tertiary)',
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

                  <div className={styles.CardGrid} onClick={(e) => e.stopPropagation()}>
                    {cat.skills.map((skill) => (
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
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          onClose={() => { setSelectedSkillId(null); setPanelCloseRequested(false); }}
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
          onSelectSkill={(skillId) => {
            setShowRecommendations(false);
            handleSelectSkill(skillId);
          }}
          onClose={() => setShowRecommendations(false)}
        />
      )}

      {/* Guide overlay */}
      {showGuideModal && (() => {
        const guideCategory = categories[0];
        const guideSkill = guideCategory.skills[0];
        const KATAKANA_MAP: Record<string, string> = { a:'ア',b:'ビ',c:'ク',d:'デ',e:'エ',f:'フ',g:'グ',h:'ハ',i:'イ',j:'ジ',k:'カ',l:'ル',m:'マ',n:'ナ',o:'オ',p:'プ',q:'ク',r:'ラ',s:'サ',t:'タ',u:'ウ',v:'ヴ',w:'ワ',x:'シ',y:'ヤ',z:'ズ' };
        const guideKatakana = KATAKANA_MAP[guideSkill.name.charAt(0).toLowerCase()] || 'ス';
        const closeGuide = () => { setGuideClosing(true); setTimeout(() => setShowGuideModal(false), 180); };

        return (
          <div
            className={`${styles.GuideOverlay} ${guideClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
            onClick={closeGuide}
          >
            {/* Navbar */}
            <div className={styles.GuideNavbar} onClick={(e) => e.stopPropagation()}>
              <div>
                <span className={styles.GuideTitleAccent}>How this works</span>
                <span className={styles.GuideTitleMain}>
                  Your AI does the teaching. This map tells it what.
                </span>
              </div>
              <button className={styles.GuideGotItBtn} onClick={closeGuide}>
                Got it
              </button>
            </div>

            {/* Layout */}
            <div className={styles.GuideLayout} onClick={(e) => e.stopPropagation()}>
              {/* Left panel */}
              <div className={styles.GuideLeftPanel}>
                <div className={styles.GuideCatHeader}>
                  <span className={styles.GuideCatLabel}>Categories</span>
                </div>
                <div className={styles.GuideAccentRule} />

                <div className={styles.GuideLearnNextBanner}>
                  <span className={styles.GuideLearnNextTitle}>What to learn next?</span>
                  <span className={styles.GuideLearnNextSub}>Personalized for you</span>
                </div>

                <button className={styles.GuideAllCatsBtn}>All Categories</button>
                <div className={styles.GuideCatDivider} />
                {categories.map((cat) => {
                  const total = cat.skills.length;
                  const done = cat.skills.filter((s) => progress[s.id]?.completed).length;
                  return (
                    <div key={cat.id} className={styles.GuideCatItem}>
                      <span className={styles.GuideCatItemName}>
                        <CategoryIcon categoryId={cat.id} /> {cat.name}
                      </span>
                      <span className={styles.GuideCatItemCount}>{done}/{total}</span>
                    </div>
                  );
                })}

                <div className={styles.GuidePanelAnnotation}>
                  <div className={styles.GuidePanelAnnotationBox}>
                    <p className={styles.GuideAnnotationTitle}>Navigate</p>
                    <p className={styles.GuideAnnotationText}>
                      Filter by category. &ldquo;What to learn next?&rdquo; recommends your next move.
                    </p>
                  </div>
                </div>

                <div
                  className={styles.GuideDimOverlay}
                  style={{ background: 'rgba(244, 239, 230, 0.75)' }}
                />
              </div>

              {/* Center */}
              <div className={styles.GuideCenter}>
                <div className={styles.GuideCenterContent}>
                  <div className={styles.GuideCenterTitle}>
                    <div className={styles.GuideCenterTitleRow}>
                      <span className={styles.DiamondAccent} />
                      <h1 className={styles.GuideCenterH1}>Vibe Suite — AI Skill Guide</h1>
                      <span className={styles.DiamondAccent} />
                    </div>
                    <p className={styles.GuideCenterSubtitle}>
                      Your path from first prompt to shipped product
                    </p>
                  </div>

                  {categories.slice(0, 2).map((cat) => {
                    const total = cat.skills.length;
                    const done = cat.skills.filter((s) => progress[s.id]?.completed).length;
                    return (
                      <section key={cat.id} className={styles.GuideCenterSection}>
                        <div className={styles.GuideCenterSectionHeader}>
                          <h2 className={styles.GuideCenterH2}>
                            <CategoryIcon categoryId={cat.id} /> {cat.name}
                          </h2>
                          <div className={styles.SectionRule} />
                          <span style={{
                            fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 500,
                            letterSpacing: '0.15em', color: 'var(--text-tertiary)',
                            border: '1px solid var(--border-strong)', padding: '0.25rem 0.75rem',
                          }}>{done}/{total}</span>
                        </div>
                        <p className={styles.GuideCenterDesc}>{cat.description}</p>
                        <div className={styles.GuideCenterCardGrid}>
                          {cat.skills.map((skill) => {
                            const k = (() => {
                              const m: Record<string, string> = {a:'ア',b:'ビ',c:'ク',d:'デ',e:'エ',f:'フ',g:'グ',h:'ハ',i:'イ',j:'ジ',k:'カ',l:'ル',m:'マ',n:'ナ',o:'オ',p:'プ',r:'ラ',s:'サ',t:'タ',u:'ウ',v:'ヴ',w:'ワ'};
                              return m[skill.name.charAt(0).toLowerCase()] || 'ス';
                            })();
                            const isCompleted = !!progress[skill.id]?.completed;
                            const isSelected = skill.id === guideSkill.id;
                            const hl = isCompleted || isSelected;
                            return (
                              <div key={skill.id} style={{
                                position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'flex-end', padding: '1.25rem 0.75rem 1rem', minHeight: '102px',
                                background: hl ? 'var(--bg-card-active)' : 'var(--bg-card)',
                                border: `1px solid ${hl ? 'var(--accent)' : 'var(--border)'}`,
                                margin: '-1px 0 0 -1px', zIndex: hl ? 2 : 1,
                                textAlign: 'center', userSelect: 'none',
                              }}>
                                <span style={{
                                  position: 'absolute', top: '0.6rem', left: '50%', transform: 'translateX(-50%)',
                                  fontFamily: 'var(--font-japanese)', fontSize: '2.16rem',
                                  color: isCompleted ? 'var(--accent-kanji-active)' : 'var(--accent-kanji)',
                                  lineHeight: 1, pointerEvents: 'none',
                                }}>{k}</span>
                                {isCompleted && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--accent)' }} />}
                                {isCompleted && (
                                  <span style={{
                                    position: 'absolute', top: '0.5rem', left: '0.5rem', fontSize: '0.75rem',
                                    color: '#fff', background: 'var(--accent)', width: '16px', height: '16px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: 'var(--font-ui)', fontWeight: 600,
                                  }}>✓</span>
                                )}
                                <p style={{
                                  position: 'relative', fontFamily: 'var(--font-body)', fontSize: '1rem',
                                  color: isCompleted ? 'var(--accent)' : 'var(--text-primary)',
                                  lineHeight: 1.3, marginBottom: '0.25rem',
                                }}>{skill.name}</p>
                                <p style={{
                                  position: 'relative', fontFamily: 'var(--font-ui)', fontSize: '0.75rem',
                                  color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase',
                                }}>{skill.difficulty}</p>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>

                <div className={styles.GuideStep1Annotation}>
                  <div className={styles.GuideStep1Box}>
                    <div className={styles.GuideStepBadgeRow}>
                      <span className={styles.GuideStepBadge}>1</span>
                      <p className={styles.GuideStepTitle}>Pick a skill</p>
                    </div>
                    <p className={styles.GuideStepText}>
                      Each card is a real project. Click one to see what you&apos;ll build and get the instruction for your AI.
                    </p>
                  </div>
                </div>

                <div
                  className={styles.GuideDimOverlay}
                  style={{ background: 'rgba(244, 239, 230, 0.7)' }}
                />
              </div>

              {/* Right panel */}
              <div className={styles.GuideRightPanel}>
                <div className={styles.GuideRightInner}>
                  <div className={styles.GuideRightNavRow}>
                    <div className={styles.GuideRightNavBtns}>
                      <div className={styles.GuideRightNavBtn}>‹</div>
                      <div className={styles.GuideRightNavBtn}>›</div>
                    </div>
                    <div className={styles.GuideRightCloseBtn}>✕</div>
                  </div>

                  <span className={styles.GuideRightCatLabel}>
                    <CategoryIcon categoryId={guideCategory.id} /> {guideCategory.name}
                  </span>

                  <h2 className={styles.GuideRightSkillName}>
                    <span className={styles.GuideRightKatakana}>{guideKatakana}</span>
                    {guideSkill.name}
                  </h2>

                  <div className={styles.GuideRightBadgeRow}>
                    <span className={styles.GuideRightDiff}>Beginner</span>
                    <span className={styles.GuideRightTime}>{guideSkill.timeEstimate}</span>
                  </div>

                  <div className={styles.GuideRightRedRule} />

                  <p className={styles.GuideRightFieldLabel}>What you&apos;ll build</p>
                  <p className={styles.GuideRightFieldTitle}>{guideSkill.projectTitle}</p>
                  <p className={styles.GuideRightFieldDesc}>{guideSkill.projectDescription}</p>

                  <p className={styles.GuideRightFieldLabel}>Tools</p>
                  <div className={styles.GuideRightToolsRow}>
                    {guideSkill.tools.map((tool) => (
                      <span key={tool} className={styles.GuideRightToolTag}>{tool}</span>
                    ))}
                  </div>

                  <div className={styles.GuideInstructionBlock}>
                    <div className={styles.GuideInstructionPulse} />
                    <div className={styles.GuideInstructionHeader}>
                      <span className={styles.GuideStepBadge}>2</span>
                      <p className={styles.GuideStepTitle}>Give it to your AI</p>
                    </div>
                    <p className={styles.GuideInstructionDesc}>
                      Copy this and paste it into your AI &mdash; Claude, ChatGPT, Cursor. It tells the AI exactly what to build with you.
                    </p>
                    <div className={styles.GuideInstructionText}>
                      <p className={styles.GuideInstructionP}>
                        I want to learn &ldquo;{guideSkill.name}&rdquo; to know how to {guideSkill.projectTitle.charAt(0).toLowerCase() + guideSkill.projectTitle.slice(1).replace(/\byour\b/gi, 'my').replace(/\byou\b/gi, 'I')}. Can we do it in my project?
                      </p>
                    </div>
                    <div className={styles.GuideInstructionCopyBtn}>Copy instruction</div>
                  </div>
                </div>

                <div className={styles.GuideRightBottom}>
                  <div className={styles.GuideRightBottomInner}>
                    <div className={styles.GuideRightStep3Wrap}>
                      <div className={styles.GuideStep3BadgeRow}>
                        <span className={styles.GuideStepBadge}>3</span>
                        <p className={styles.GuideStepTitle}>Track your progress</p>
                      </div>
                      <p className={styles.GuideStep3Desc}>
                        Done building? Mark it. Your progress bar and recommendations update automatically.
                      </p>
                      <div className={styles.GuideMarkBtn}>Mark as Learned</div>
                      <div className={styles.GuideMarkPulse} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Why modal */}
      {showWhyModal && (
        <div
          className={styles.WhyBackdrop}
          style={{ background: whyClosing ? 'rgba(28, 28, 26, 0)' : 'rgba(28, 28, 26, 0.35)' }}
          onClick={() => {
            setWhyClosing(true);
            setTimeout(() => setShowWhyModal(false), 180);
          }}
        >
          <div
            className={`${styles.WhyModal} ${whyClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
            onClick={(e) => e.stopPropagation()}
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
                <p>
                  Most knowledge workers are becoming irrelevant. Not next year. Right now. Every single day.
                </p>
                <p>
                  This isn&apos;t doom-scrolling anxiety&nbsp;&mdash; it&apos;s math. AI replaces tasks, tasks make up jobs, jobs disappear quietly while people argue on Twitter about whether it&apos;s &ldquo;really&rdquo; happening.
                </p>
                <p>
                  This skill map is your chance to stay relevant. Learn to build with AI&nbsp;&mdash; not compete against it&nbsp;&mdash; so that in your 30s and 40s you still get to choose what you do for a living.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
