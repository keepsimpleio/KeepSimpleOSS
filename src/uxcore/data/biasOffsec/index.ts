import { biases } from '../biasList/biases';
import anchoringEffect from './anchoringEffect';
import anecdotalEvidence from './anecdotalEvidence';
import attentionalBias from './attentionalBias';
import authorityBias from './authorityBias';
import automationBias from './automationBias';
import availabilityHeuristics from './availabilityHeuristics';
import bandwagonEffect from './bandwagonEffect';
import baseRateFallacy from './baseRateFallacy';
import biasBlindSpot from './biasBlindSpot';
import bizarrenessEffect from './bizarrenessEffect';
import clusteringIllusion from './clusteringIllusion';
import confirmationBias from './confirmationBias';
import congruenceBias from './congruenceBias';
import conservatism from './conservatism';
import contextEffect from './contextEffect';
import continuedInfluenceEffect from './continuedInfluenceEffect';
import contrastEffect from './contrastEffect';
import cueDependentForgetting from './cueDependentForgetting';
import distinctionBias from './distinctionBias';
import empathyGap from './empathyGap';
import framingEffect from './framingEffect';
import frequencyIllusion from './frequencyIllusion';
import functionalFixedness from './functionalFixedness';
import fundamentalAttributionError from './fundamentalAttributionError';
import gamblersFallacy from './gamblersFallacy';
import groupAttributionError from './groupAttributionError';
import hotHandFallacy from './hotHandFallacy';
import humorEffect from './humorEffect';
import illusionOfValidity from './illusionOfValidity';
import illusoryCorrelation from './illusoryCorrelation';
import illusoryTruthEffect from './illusoryTruthEffect';
import insensitivityToSampleSize from './insensitivityToSampleSize';
import justWorldFallacy from './justWorldFallacy';
import mereExposureEffect from './mereExposureEffect';
import moneyIllusion from './moneyIllusion';
import moodCongruentMemoryBias from './moodCongruentMemoryBias';
import negativityBias from './negativityBias';
import neglectOfProbability from './neglectOfProbability';
import observerExpectancyEffect from './observerExpectancyEffect';
import omissionBias from './omissionBias';
import ostrichEffect from './ostrichEffect';
import pictureSuperiorityEffect from './pictureSuperiorityEffect';
import postPurchaseRationalization from './postPurchaseRationalization';
import recencyIllusion from './recencyIllusion';
import selectivePerception from './selectivePerception';
import selfReferenceEffect from './selfReferenceEffect';
import stereotype from './stereotype';
import subjectiveValidation from './subjectiveValidation';
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
  'subjective-validation': subjectiveValidation,
  'continued-influence-effect': continuedInfluenceEffect,
  'bias-blind-spot': biasBlindSpot,
  'clustering-illusion': clusteringIllusion,
  'insensitivity-to-sample-size': insensitivityToSampleSize,
  'neglect-of-probability': neglectOfProbability,
  'anecdotal-evidence': anecdotalEvidence,
  'illusion-of-validity': illusionOfValidity,
  'recency-illusion': recencyIllusion,
  'gamblers-fallacy': gamblersFallacy,
  'hot-hand-fallacy': hotHandFallacy,
  'illusory-correlation': illusoryCorrelation,
  'group-attribution-error': groupAttributionError,
  'fundamental-attribution-error': fundamentalAttributionError,
  stereotype: stereotype,
  'functional-fixedness': functionalFixedness,
  'just-world-fallacy': justWorldFallacy,
  'authority-bias': authorityBias,
  'automation-bias': automationBias,
  'bandwagon-effect': bandwagonEffect,
};

export const getOffsecBiasContent = (
  biasNumber: number,
): OffsecBiasContent | null => {
  const entry = biases.find(b => b.id === biasNumber);
  if (!entry) return null;
  return offsecBySlug[entry.slug] ?? null;
};

export type { OffsecBiasCard, OffsecBiasContent };
