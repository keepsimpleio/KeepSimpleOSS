import { biases } from '../biasList/biases';
import attentionalBias from './attentionalBias';
import availabilityHeuristics from './availabilityHeuristics';
import baseRateFallacy from './baseRateFallacy';
import bizarrenessEffect from './bizarrenessEffect';
import contextEffect from './contextEffect';
import cueDependentForgetting from './cueDependentForgetting';
import empathyGap from './empathyGap';
import frequencyIllusion from './frequencyIllusion';
import humorEffect from './humorEffect';
import illusoryTruthEffect from './illusoryTruthEffect';
import mereExposureEffect from './mereExposureEffect';
import moodCongruentMemoryBias from './moodCongruentMemoryBias';
import omissionBias from './omissionBias';
import pictureSuperiorityEffect from './pictureSuperiorityEffect';
import type { OffsecBiasCard, OffsecBiasContent } from './types';

const offsecBySlug: Record<string, OffsecBiasContent> = {
  'availability-heuristics': availabilityHeuristics,
  'attentional-bias': attentionalBias,
  'illusory-truth-effect': illusoryTruthEffect,
  'mere-exposure-effect': mereExposureEffect,
  'context-effect': contextEffect,
  'cue-dependent-forgetting': cueDependentForgetting,
  'mood-congruent-memory-bias': moodCongruentMemoryBias,
  'frequency-illusion': frequencyIllusion,
  'empathy-gap': empathyGap,
  'omission-bias': omissionBias,
  'base-rate-fallacy': baseRateFallacy,
  'bizarreness-effect': bizarrenessEffect,
  'humor-effect': humorEffect,
  'picture-superiority-effect': pictureSuperiorityEffect,
};

export const getOffsecBiasContent = (
  biasNumber: number,
): OffsecBiasContent | null => {
  const entry = biases.find(b => b.id === biasNumber);
  if (!entry) return null;
  return offsecBySlug[entry.slug] ?? null;
};

export type { OffsecBiasCard, OffsecBiasContent };
