import type { TLocales } from '@local-types/global';
import {
  Recommendation,
  RecommendationReason,
  UserProgress,
} from '@local-types/pageTypes/vibesuite';

import vibesuiteIntl from '@data/vibesuite/intl';
import { allSkills, getCategoryBySkillId } from '@data/vibesuite/skills';

function parseTimeEstimateHours(estimate: string): number {
  const lower = estimate.toLowerCase();
  if (lower.includes('min')) return 0.5;
  if (lower.includes('day')) {
    const match = lower.match(/(\d+)/);
    return (match ? parseInt(match[1]) : 1) * 8;
  }
  const match = lower.match(/(\d+)/);
  return match ? parseInt(match[1]) : 4;
}

// Build reverse dependency map: skillId → number of skills it unlocks
function buildUnlockCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const skill of allSkills) {
    if (skill.dependsOn) {
      for (const depId of skill.dependsOn) {
        counts[depId] = (counts[depId] || 0) + 1;
      }
    }
  }
  return counts;
}

export function getRecommendations(
  progress: UserProgress,
  count = 3,
  locale: TLocales = 'en',
): Recommendation[] {
  const completedCount = Object.values(progress).filter(
    p => p.completed,
  ).length;
  const progressPct = (completedCount / allSkills.length) * 100;

  // All done — nothing to recommend
  if (completedCount >= allSkills.length) return [];

  const unlockCounts = buildUnlockCounts();

  // Determine expected difficulty bracket
  const expectedDifficulty =
    progressPct < 30
      ? 'beginner'
      : progressPct < 70
        ? 'intermediate'
        : 'advanced';

  // Score every unlearned skill
  const scored: Recommendation[] = [];

  for (const skill of allSkills) {
    if (progress[skill.id]?.completed) continue;

    let score = 0;
    const reasons: RecommendationReason[] = [];

    // Check prerequisites
    const deps = skill.dependsOn || [];
    const allDepsCompleted = deps.every(d => progress[d]?.completed);

    if (allDepsCompleted) {
      score += 30;
      reasons.push('unlocked');
    } else {
      score -= 50;
    }

    // Hub bonus
    const unlocks = unlockCounts[skill.id] || 0;
    if (unlocks >= 2) {
      score += 20;
      reasons.push('hub');
    }

    // Difficulty match
    if (skill.difficulty === expectedDifficulty) {
      score += 10;
      reasons.push('difficulty_match');
    }

    // Quick win
    if (parseTimeEstimateHours(skill.timeEstimate) <= 2) {
      score += 5;
      reasons.push('quick_win');
    }

    scored.push({ skill, score, reasons, reasonText: '' });
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Greedy selection with category diversity penalty
  const selected: Recommendation[] = [];
  const usedCategories = new Set<string>();

  for (const rec of scored) {
    if (selected.length >= count) break;

    const cat = getCategoryBySkillId(rec.skill.id);
    const catId = cat?.id || '';

    if (usedCategories.has(catId)) {
      rec.score -= 15;
    }

    if (usedCategories.has(catId) && selected.length > 0) {
      const betterAlt = scored.find(
        s =>
          !selected.includes(s) &&
          s !== rec &&
          !usedCategories.has(getCategoryBySkillId(s.skill.id)?.id || '') &&
          s.score >= rec.score - 15,
      );
      if (betterAlt) {
        const altCat = getCategoryBySkillId(betterAlt.skill.id)?.id || '';
        usedCategories.add(altCat);
        betterAlt.reasons.push('diversity');
        betterAlt.reasonText = generateReasonText(
          betterAlt,
          unlockCounts,
          locale,
        );
        selected.push(betterAlt);
        continue;
      }
    }

    usedCategories.add(catId);
    rec.reasonText = generateReasonText(rec, unlockCounts, locale);
    selected.push(rec);
  }

  return selected;
}

function generateReasonText(
  rec: Recommendation,
  unlockCounts: Record<string, number>,
  locale: TLocales = 'en',
): string {
  const t = vibesuiteIntl[locale];
  const { reasons, skill } = rec;
  const unlocks = unlockCounts[skill.id] || 0;

  if (reasons.includes('hub') && reasons.includes('unlocked')) {
    return `${t.reasonUnlocks} ${unlocks} ${unlocks === 1 ? t.reasonNewSkill : t.reasonNewSkills}`;
  }
  if (reasons.includes('quick_win') && reasons.includes('unlocked')) {
    return `${t.reasonQuickWin} \u2014 ${skill.timeEstimate}`;
  }
  if (reasons.includes('difficulty_match') && reasons.includes('unlocked')) {
    return t.reasonMatchesLevel;
  }
  if (reasons.includes('unlocked')) {
    return t.reasonAllPrereqsDone;
  }
  return t.reasonGoodNextStep;
}
