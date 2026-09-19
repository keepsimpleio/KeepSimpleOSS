// Armenian OffSec case content. Mirrors the English map in ../index.ts
// slug for slug. Any slug missing here falls back to English at lookup time.

import type { OffsecBiasContent } from '../types';
import ambiguityEffect from './ambiguityEffect';
import anchoringEffect from './anchoringEffect';
import anecdotalEvidence from './anecdotalEvidence';
import appealToNovelty from './appealToNovelty';
import attentionalBias from './attentionalBias';
import authorityBias from './authorityBias';
import automationBias from './automationBias';
import availabilityHeuristics from './availabilityHeuristics';
import backfireEffect from './backfireEffect';
import bandwagonEffect from './bandwagonEffect';
import barnumEffect from './barnumEffect';
import baseRateFallacy from './baseRateFallacy';
import biasBlindSpot from './biasBlindSpot';
import bizarrenessEffect from './bizarrenessEffect';
import clusteringIllusion from './clusteringIllusion';
import confirmationBias from './confirmationBias';
import congruenceBias from './congruenceBias';
import conjunctionFallacy from './conjunctionFallacy';
import consensusBias from './consensusBias';
import conservatism from './conservatism';
import contextEffect from './contextEffect';
import continuedInfluenceEffect from './continuedInfluenceEffect';
import contrastEffect from './contrastEffect';
import cueDependentForgetting from './cueDependentForgetting';
import curseOfKnowledge from './curseOfKnowledge';
import decoyEffect from './decoyEffect';
import distinctionBias from './distinctionBias';
import dunningKrugerEffect from './dunningKrugerEffect';
import empathyGap from './empathyGap';
import endowmentEffect from './endowmentEffect';
import escalationOfCommitment from './escalationOfCommitment';
import fadingAffectBias from './fadingAffectBias';
import framingEffect from './framingEffect';
import frequencyIllusion from './frequencyIllusion';
import functionalFixedness from './functionalFixedness';
import fundamentalAttributionError from './fundamentalAttributionError';
import gamblersFallacy from './gamblersFallacy';
import generationEffect from './generationEffect';
import groupAttributionError from './groupAttributionError';
import haloEffect from './haloEffect';
import hardEasyEffect from './hardEasyEffect';
import hindsightBias from './hindsightBias';
import hotHandFallacy from './hotHandFallacy';
import humorEffect from './humorEffect';
import hyperbolicDiscounting from './hyperbolicDiscounting';
import ikeaEffect from './ikeaEffect';
import illusionOfAsymmetricInsight from './illusionOfAsymmetricInsight';
import illusionOfControl from './illusionOfControl';
import illusionOfTransparency from './illusionOfTransparency';
import illusionOfValidity from './illusionOfValidity';
import illusoryCorrelation from './illusoryCorrelation';
import illusorySuperiority from './illusorySuperiority';
import illusoryTruthEffect from './illusoryTruthEffect';
import implicitStereotypes from './implicitStereotypes';
import informationBias from './informationBias';
import inGroupFavoritism from './inGroupFavoritism';
import insensitivityToSampleSize from './insensitivityToSampleSize';
import justWorldFallacy from './justWorldFallacy';
import lawOfTriviality from './lawOfTriviality';
import lessIsBetterEffect from './lessIsBetterEffect';
import listLengthEffect from './listLengthEffect';
import lossAversion from './lossAversion';
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
import peakEndRule from './peakEndRule';
import pictureSuperiorityEffect from './pictureSuperiorityEffect';
import placebo from './placebo';
import planningFallacy from './planningFallacy';
import positivityEffect from './positivityEffect';
import postPurchaseRationalization from './postPurchaseRationalization';
import prejudice from './prejudice';
import primacyEffect from './primacyEffect';
import processingDifficultyEffect from './processingDifficultyEffect';
import proInnovationBias from './proInnovationBias';
import reactance from './reactance';
import recencyIllusion from './recencyIllusion';
import riskCompensation from './riskCompensation';
import selectivePerception from './selectivePerception';
import selfReferenceEffect from './selfReferenceEffect';
import serialPositionEffect from './serialPositionEffect';
import serialRecall from './serialRecall';
import socialDesirabilityBias from './socialDesirabilityBias';
import spotlightEffect from './spotlightEffect';
import stereotype from './stereotype';
import subadditivityEffect from './subadditivityEffect';
import subjectiveValidation from './subjectiveValidation';
import survivalBias from './survivalBias';
import systemJustification from './systemJustification';
import thirdPersonEffect from './thirdPersonEffect';
import unitBias from './unitBias';
import vonRestorffEffect from './vonRestorffEffect';
import weberFechnerLaw from './weberFechnerLaw';
import zeroRiskBias from './zeroRiskBias';

const offsecHy: Record<string, OffsecBiasContent> = {
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
  'illusion-of-control': illusionOfControl,
  'illusory-superiority': illusorySuperiority,
  'risk-compensation': riskCompensation,
  'hyperbolic-discounting': hyperbolicDiscounting,
  'appeal-to-novelty': appealToNovelty,
  'escalation-of-commitment': escalationOfCommitment,
  'generation-effect': generationEffect,
  'loss-aversion': lossAversion,
  'ikea-effect': ikeaEffect,
  'unit-bias': unitBias,
  'zero-risk-bias': zeroRiskBias,
  'processing-difficulty-effect': processingDifficultyEffect,
  'endowment-effect': endowmentEffect,
  'backfire-effect': backfireEffect,
  'system-justification': systemJustification,
  reactance: reactance,
  'decoy-effect': decoyEffect,
  'ambiguity-effect': ambiguityEffect,
  'information-bias': informationBias,
  'law-of-triviality': lawOfTriviality,
  'conjunction-fallacy': conjunctionFallacy,
  'less-is-better-effect': lessIsBetterEffect,
  'implicit-stereotypes': implicitStereotypes,
  prejudice: prejudice,
  'fading-affect-bias': fadingAffectBias,
  'peak-end-rule': peakEndRule,
  'serial-recall': serialRecall,
  'list-length-effect': listLengthEffect,
  'primacy-effect': primacyEffect,
  'serial-position-effect': serialPositionEffect,
};

export default offsecHy;
