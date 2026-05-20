import { biases } from '../biasList/biases';
import availabilityHeuristics, {
  OffsecBiasContent,
} from './availabilityHeuristics';

const offsecBySlug: Record<string, OffsecBiasContent> = {
  'availability-heuristics': availabilityHeuristics,
};

export const getOffsecBiasContent = (
  biasNumber: number,
): OffsecBiasContent | null => {
  const entry = biases.find(b => b.id === biasNumber);
  if (!entry) return null;
  return offsecBySlug[entry.slug] ?? null;
};

export type { OffsecBiasContent };
