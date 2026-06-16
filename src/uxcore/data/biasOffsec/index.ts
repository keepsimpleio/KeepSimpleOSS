import { biases } from '../biasList/biases';
import attentionalBias from './attentionalBias';
import availabilityHeuristics from './availabilityHeuristics';
import illusoryTruthEffect from './illusoryTruthEffect';
import mereExposureEffect from './mereExposureEffect';
import type { OffsecBiasCard, OffsecBiasContent } from './types';

const offsecBySlug: Record<string, OffsecBiasContent> = {
  'availability-heuristics': availabilityHeuristics,
  'attentional-bias': attentionalBias,
  'illusory-truth-effect': illusoryTruthEffect,
  'mere-exposure-effect': mereExposureEffect,
};

export const getOffsecBiasContent = (
  biasNumber: number,
): OffsecBiasContent | null => {
  const entry = biases.find(b => b.id === biasNumber);
  if (!entry) return null;
  return offsecBySlug[entry.slug] ?? null;
};

export type { OffsecBiasCard, OffsecBiasContent };
