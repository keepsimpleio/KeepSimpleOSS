// Russian OffSec case content. Mirrors the English map in ../index.ts
// slug for slug. Any slug missing here falls back to English at lookup time.

import type { OffsecBiasContent } from '../types';
import anchoringEffect from './anchoringEffect';
import anecdotalEvidence from './anecdotalEvidence';
import attentionalBias from './attentionalBias';
import authorityBias from './authorityBias';
import automationBias from './automationBias';
import availabilityHeuristics from './availabilityHeuristics';
import bandwagonEffect from './bandwagonEffect';
import barnumEffect from './barnumEffect';
import baseRateFallacy from './baseRateFallacy';
import biasBlindSpot from './biasBlindSpot';
import bizarrenessEffect from './bizarrenessEffect';
import clusteringIllusion from './clusteringIllusion';
import confirmationBias from './confirmationBias';
import congruenceBias from './congruenceBias';
import consensusBias from './consensusBias';
import conservatism from './conservatism';
import contextEffect from './contextEffect';
import continuedInfluenceEffect from './continuedInfluenceEffect';
import contrastEffect from './contrastEffect';
import cueDependentForgetting from './cueDependentForgetting';
import curseOfKnowledge from './curseOfKnowledge';
import distinctionBias from './distinctionBias';
import dunningKrugerEffect from './dunningKrugerEffect';
import empathyGap from './empathyGap';
import framingEffect from './framingEffect';
import frequencyIllusion from './frequencyIllusion';
import functionalFixedness from './functionalFixedness';
import fundamentalAttributionError from './fundamentalAttributionError';
import gamblersFallacy from './gamblersFallacy';
import groupAttributionError from './groupAttributionError';
import haloEffect from './haloEffect';
import hardEasyEffect from './hardEasyEffect';
import hindsightBias from './hindsightBias';
import hotHandFallacy from './hotHandFallacy';
import humorEffect from './humorEffect';
import illusionOfAsymmetricInsight from './illusionOfAsymmetricInsight';
import illusionOfTransparency from './illusionOfTransparency';
import illusionOfValidity from './illusionOfValidity';
import illusoryCorrelation from './illusoryCorrelation';
import illusoryTruthEffect from './illusoryTruthEffect';
import inGroupFavoritism from './inGroupFavoritism';
import insensitivityToSampleSize from './insensitivityToSampleSize';
import justWorldFallacy from './justWorldFallacy';
import mentalAccounting from './mentalAccounting';
import mereExposureEffect from './mereExposureEffect';
import millersLaw from './millersLaw';
import moneyIllusion from './moneyIllusion';
import moodCongruentMemoryBias from './moodCongruentMemoryBias';
import negativityBias from './negativityBias';
import neglectOfProbability from './neglectOfProbability';
import normalityBias from './normalityBias';
import notInventedHere from './notInventedHere';
import observerExpectancyEffect from './observerExpectancyEffect';
import omissionBias from './omissionBias';
import ostrichEffect from './ostrichEffect';
import outGroupHomogeneity from './outGroupHomogeneity';
import overconfidenceEffect from './overconfidenceEffect';
import pictureSuperiorityEffect from './pictureSuperiorityEffect';
import placebo from './placebo';
import planningFallacy from './planningFallacy';
import positivityEffect from './positivityEffect';
import postPurchaseRationalization from './postPurchaseRationalization';
import proInnovationBias from './proInnovationBias';
import recencyIllusion from './recencyIllusion';
import selectivePerception from './selectivePerception';
import selfReferenceEffect from './selfReferenceEffect';
import socialDesirabilityBias from './socialDesirabilityBias';
import spotlightEffect from './spotlightEffect';
import stereotype from './stereotype';
import subadditivityEffect from './subadditivityEffect';
import subjectiveValidation from './subjectiveValidation';
import survivalBias from './survivalBias';
import thirdPersonEffect from './thirdPersonEffect';
import vonRestorffEffect from './vonRestorffEffect';
import weberFechnerLaw from './weberFechnerLaw';

const offsecRu: Record<string, OffsecBiasContent> = {
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
  placebo: placebo,
  'out-group-homogeneity': outGroupHomogeneity,
  'in-group-favoritism': inGroupFavoritism,
  'halo-effect': haloEffect,
  'positivity-effect': positivityEffect,
  'not-invented-here': notInventedHere,
  'mental-accounting': mentalAccounting,
  'normality-bias': normalityBias,
  'survival-bias': survivalBias,
  'subadditivity-effect': subadditivityEffect,
  'millers-law': millersLaw,
  'illusion-of-transparency': illusionOfTransparency,
  'curse-of-knowledge': curseOfKnowledge,
  'spotlight-effect': spotlightEffect,
  'illusion-of-asymmetric-insight': illusionOfAsymmetricInsight,
  'hindsight-bias': hindsightBias,
  'planning-fallacy': planningFallacy,
  'pro-innovation-bias': proInnovationBias,
  'overconfidence-effect': overconfidenceEffect,
  'social-desirability-bias': socialDesirabilityBias,
  'third-person-effect': thirdPersonEffect,
  'consensus-bias': consensusBias,
  'hard-easy-effect': hardEasyEffect,
  'dunning-kruger-effect': dunningKrugerEffect,
  'barnum-effect': barnumEffect,
};

export default offsecRu;
