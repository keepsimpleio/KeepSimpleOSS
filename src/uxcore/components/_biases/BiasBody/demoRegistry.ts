import type { ComponentType } from 'react';

export const demoRegistry: Record<
  string,
  () => Promise<{ Before: ComponentType; After: ComponentType }>
> = {
  'availability-heuristics': () =>
    import('./demos/AvailabilityHeuristics/AvailabilityHeuristics'),
  'attentional-bias': () => import('./demos/AttentionalBias/AttentionalBias'),
  'illusory-truth-effect': () =>
    import('./demos/IllusoryTruthEffect/IllusoryTruthEffect'),
  'mere-exposure-effect': () =>
    import('./demos/MereExposureEffect/MereExposureEffect'),
  'context-effect': () => import('./demos/ContextEffect/ContextEffect'),
  'cue-dependent-forgetting': () =>
    import('./demos/CueDependentForgetting/CueDependentForgetting'),
  'mood-congruent-memory-bias': () =>
    import('./demos/MoodCongruentMemory/MoodCongruentMemory'),
  'frequency-illusion': () =>
    import('./demos/FrequencyIllusion/FrequencyIllusion'),
  'empathy-gap': () => import('./demos/EmpathyGap/EmpathyGap'),
  'omission-bias': () => import('./demos/OmissionBias/OmissionBias'),
  'base-rate-fallacy': () => import('./demos/BaseRateFallacy/BaseRateFallacy'),
  'bizarreness-effect': () =>
    import('./demos/BizarrenessEffect/BizarrenessEffect'),
  'humor-effect': () => import('./demos/HumorEffect/HumorEffect'),
  'picture-superiority-effect': () =>
    import('./demos/PictureSuperiority/PictureSuperiority'),
  'von-restorff-effect': () =>
    import('./demos/VonRestorffEffect/VonRestorffEffect'),
  'self-reference-effect': () =>
    import('./demos/SelfReferenceEffect/SelfReferenceEffect'),
  'negativity-bias': () => import('./demos/NegativityBias/NegativityBias'),
  'anchoring-effect': () => import('./demos/AnchoringEffect/AnchoringEffect'),
  conservatism: () => import('./demos/Conservatism/Conservatism'),
  'contrast-effect': () => import('./demos/ContrastEffect/ContrastEffect'),
  'distinction-bias': () => import('./demos/DistinctionBias/DistinctionBias'),
  'framing-effect': () => import('./demos/FramingEffect/FramingEffect'),
  'money-illusion': () => import('./demos/MoneyIllusion/MoneyIllusion'),
  'weber-fechner-law': () => import('./demos/WeberFechnerLaw/WeberFechnerLaw'),
  'confirmation-bias': () =>
    import('./demos/ConfirmationBias/ConfirmationBias'),
  'post-purchase-rationalization': () =>
    import('./demos/PostPurchaseRationalization/PostPurchaseRationalization'),
  'selective-perception': () =>
    import('./demos/SelectivePerception/SelectivePerception'),
  'ostrich-effect': () => import('./demos/OstrichEffect/OstrichEffect'),
  'subjective-validation': () =>
    import('./demos/SubjectiveValidation/SubjectiveValidation'),
  'continued-influence-effect': () =>
    import('./demos/ContinuedInfluenceEffect/ContinuedInfluenceEffect'),
  'clustering-illusion': () =>
    import('./demos/ClusteringIllusion/ClusteringIllusion'),
  'insensitivity-to-sample-size': () =>
    import('./demos/InsensitivityToSampleSize/InsensitivityToSampleSize'),
  'neglect-of-probability': () =>
    import('./demos/NeglectOfProbability/NeglectOfProbability'),
  'anecdotal-evidence': () =>
    import('./demos/AnecdotalEvidence/AnecdotalEvidence'),
  'recency-illusion': () => import('./demos/RecencyIllusion/RecencyIllusion'),
  'gamblers-fallacy': () => import('./demos/GamblersFallacy/GamblersFallacy'),
  'hot-hand-fallacy': () => import('./demos/HotHandFallacy/HotHandFallacy'),
  'illusory-correlation': () =>
    import('./demos/IllusoryCorrelation/IllusoryCorrelation'),
  'group-attribution-error': () =>
    import('./demos/GroupAttributionError/GroupAttributionError'),
  'fundamental-attribution-error': () =>
    import('./demos/FundamentalAttributionError/FundamentalAttributionError'),
  'functional-fixedness': () =>
    import('./demos/FunctionalFixedness/FunctionalFixedness'),
  'just-world-fallacy': () =>
    import('./demos/JustWorldFallacy/JustWorldFallacy'),
  'authority-bias': () => import('./demos/AuthorityBias/AuthorityBias'),
  'automation-bias': () => import('./demos/AutomationBias/AutomationBias'),
  'bandwagon-effect': () => import('./demos/BandwagonEffect/BandwagonEffect'),
  placebo: () => import('./demos/PlaceboEffect/PlaceboEffect'),
  'in-group-favoritism': () =>
    import('./demos/InGroupFavoritism/InGroupFavoritism'),
  'halo-effect': () => import('./demos/HaloEffect/HaloEffect'),
  'positivity-effect': () =>
    import('./demos/PositivityEffect/PositivityEffect'),
  'mental-accounting': () =>
    import('./demos/MentalAccounting/MentalAccounting'),
  'normality-bias': () => import('./demos/NormalityBias/NormalityBias'),
  'millers-law': () => import('./demos/MillersLaw/MillersLaw'),
  'illusion-of-transparency': () =>
    import('./demos/IllusionOfTransparency/IllusionOfTransparency'),
  'curse-of-knowledge': () =>
    import('./demos/CurseOfKnowledge/CurseOfKnowledge'),
  'spotlight-effect': () => import('./demos/SpotlightEffect/SpotlightEffect'),
  'hindsight-bias': () => import('./demos/HindsightBias/HindsightBias'),
  'social-desirability-bias': () =>
    import('./demos/SocialDesirabilityBias/SocialDesirabilityBias'),
  'third-person-effect': () =>
    import('./demos/ThirdPersonEffect/ThirdPersonEffect'),
  'hard-easy-effect': () => import('./demos/HardEasyEffect/HardEasyEffect'),
  'dunning-kruger-effect': () =>
    import('./demos/DunningKrugerEffect/DunningKrugerEffect'),
  'barnum-effect': () => import('./demos/BarnumEffect/BarnumEffect'),
  'illusion-of-control': () =>
    import('./demos/IllusionOfControl/IllusionOfControl'),
  'illusory-superiority': () =>
    import('./demos/IllusorySuperiority/IllusorySuperiority'),
  'risk-compensation': () =>
    import('./demos/RiskCompensation/RiskCompensation'),
  'hyperbolic-discounting': () =>
    import('./demos/HyperbolicDiscounting/HyperbolicDiscounting'),
  'appeal-to-novelty': () => import('./demos/AppealToNovelty/AppealToNovelty'),
  'escalation-of-commitment': () =>
    import('./demos/EscalationOfCommitment/EscalationOfCommitment'),
  'generation-effect': () =>
    import('./demos/GenerationEffect/GenerationEffect'),
  'loss-aversion': () => import('./demos/LossAversion/LossAversion'),
  'ikea-effect': () => import('./demos/IKEAEffect/IKEAEffect'),
  'unit-bias': () => import('./demos/UnitBias/UnitBias'),
  'zero-risk-bias': () => import('./demos/ZeroRiskBias/ZeroRiskBias'),
  'processing-difficulty-effect': () =>
    import('./demos/ProcessingDifficulty/ProcessingDifficulty'),
  'endowment-effect': () => import('./demos/EndowmentEffect/EndowmentEffect'),
  'backfire-effect': () => import('./demos/BackfireEffect/BackfireEffect'),
  'system-justification': () =>
    import('./demos/SystemJustification/SystemJustification'),
  reactance: () => import('./demos/Reactance/Reactance'),
  'decoy-effect': () => import('./demos/DecoyEffect/DecoyEffect'),
  'ambiguity-effect': () => import('./demos/AmbiguityEffect/AmbiguityEffect'),
  'information-bias': () => import('./demos/InformationBias/InformationBias'),
  'conjunction-fallacy': () =>
    import('./demos/ConjunctionFallacy/ConjunctionFallacy'),
  'less-is-better-effect': () =>
    import('./demos/LessIsBetterEffect/LessIsBetterEffect'),
  prejudice: () => import('./demos/Prejudice/Prejudice'),
  'fading-affect-bias': () =>
    import('./demos/FadingAffectBias/FadingAffectBias'),
  'peak-end-rule': () => import('./demos/PeakEndRule/PeakEndRule'),
  'serial-recall': () => import('./demos/SerialRecall/SerialRecall'),
  'list-length-effect': () =>
    import('./demos/ListLengthEffect/ListLengthEffect'),
  'primacy-effect': () => import('./demos/PrimacyEffect/PrimacyEffect'),
  'serial-position-effect': () =>
    import('./demos/SerialPositionEffect/SerialPositionEffect'),
  'congruence-bias': () => import('./demos/CongruenceBias/CongruenceBias'),
  'observer-expectancy-effect': () =>
    import('./demos/ObserverExpectancyEffect/ObserverExpectancyEffect'),
  'bias-blind-spot': () => import('./demos/BiasBlindSpot/BiasBlindSpot'),
  'illusion-of-validity': () =>
    import('./demos/IllusionOfValidity/IllusionOfValidity'),
  stereotype: () => import('./demos/Stereotype/Stereotype'),
  'out-group-homogeneity': () =>
    import('./demos/OutGroupHomogeneity/OutGroupHomogeneity'),
  'not-invented-here': () => import('./demos/NotInventedHere/NotInventedHere'),
  'survival-bias': () => import('./demos/SurvivalBias/SurvivalBias'),
  'subadditivity-effect': () =>
    import('./demos/SubadditivityEffect/SubadditivityEffect'),
  'illusion-of-asymmetric-insight': () =>
    import('./demos/IllusionOfAsymmetricInsight/IllusionOfAsymmetricInsight'),
  'planning-fallacy': () => import('./demos/PlanningFallacy/PlanningFallacy'),
  'pro-innovation-bias': () =>
    import('./demos/ProInnovationBias/ProInnovationBias'),
  'overconfidence-effect': () =>
    import('./demos/OverconfidenceEffect/OverconfidenceEffect'),
  'consensus-bias': () => import('./demos/ConsensusBias/ConsensusBias'),
  'law-of-triviality': () => import('./demos/LawOfTriviality/LawOfTriviality'),
  'implicit-stereotypes': () =>
    import('./demos/ImplicitStereotypes/ImplicitStereotypes'),
};
