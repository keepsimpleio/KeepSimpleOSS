import { biases } from '../biasList/biases';
import attentionalBias from './attentionalBias';
import availabilityHeuristics from './availabilityHeuristics';
import illusoryTruthEffect from './illusoryTruthEffect';
import type { OffsecBiasContent } from './types';

const offsecBySlug: Record<string, OffsecBiasContent> = {
  'availability-heuristics': availabilityHeuristics,
  'attentional-bias': attentionalBias,
  'illusory-truth-effect': illusoryTruthEffect,
};

export const getOffsecBiasContent = (
  biasNumber: number,
): OffsecBiasContent | null => {
  const entry = biases.find(b => b.id === biasNumber);
  if (!entry) return null;
  return offsecBySlug[entry.slug] ?? null;
};

export type { OffsecBiasContent };
