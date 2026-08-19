import { biases } from '../biasList/biases';
import anchoringEffect from './anchoringEffect';
import attentionalBias from './attentionalBias';
import availabilityHeuristics from './availabilityHeuristics';
import baseRateFallacy from './baseRateFallacy';
import bizarrenessEffect from './bizarrenessEffect';
import confirmationBias from './confirmationBias';
import congruenceBias from './congruenceBias';
import conservatism from './conservatism';
import contextEffect from './contextEffect';
import contrastEffect from './contrastEffect';
import cueDependentForgetting from './cueDependentForgetting';
import distinctionBias from './distinctionBias';
import empathyGap from './empathyGap';
import framingEffect from './framingEffect';
import frequencyIllusion from './frequencyIllusion';
import humorEffect from './humorEffect';
import illusoryTruthEffect from './illusoryTruthEffect';
import mereExposureEffect from './mereExposureEffect';
import moneyIllusion from './moneyIllusion';
import moodCongruentMemoryBias from './moodCongruentMemoryBias';
import negativityBias from './negativityBias';
import observerExpectancyEffect from './observerExpectancyEffect';
import omissionBias from './omissionBias';
import ostrichEffect from './ostrichEffect';
import pictureSuperiorityEffect from './pictureSuperiorityEffect';
import postPurchaseRationalization from './postPurchaseRationalization';
import selectivePerception from './selectivePerception';
import selfReferenceEffect from './selfReferenceEffect';
import type { OffsecBiasCard, OffsecBiasContent } from './types';
import vonRestorffEffect from './vonRestorffEffect';
import weberFechnerLaw from './weberFechnerLaw';

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
  'von-restorff-effect': vonRestorffEffect,
  'self-reference-effect': selfReferenceEffect,
  'negativity-bias': negativityBias,
  'anchoring-effect': anchoringEffect,
  conservatism: conservatism,
  'contrast-effect': contrastEffect,
  'distinction-bias': distinctionBias,
  'framing-effect': framingEffect,
  'money-illusion': moneyIllusion,
  'weber-fechner-law': weberFechnerLaw,
  'confirmation-bias': confirmationBias,
  'congruence-bias': congruenceBias,
  'post-purchase-rationalization': postPurchaseRationalization,
  'selective-perception': selectivePerception,
  'observer-expectancy-effect': observerExpectancyEffect,
  'ostrich-effect': ostrichEffect,
};

export const getOffsecBiasContent = (
  biasNumber: number,
): OffsecBiasContent | null => {
  const entry = biases.find(b => b.id === biasNumber);
  if (!entry) return null;
  return offsecBySlug[entry.slug] ?? null;
};

export type { OffsecBiasCard, OffsecBiasContent };
