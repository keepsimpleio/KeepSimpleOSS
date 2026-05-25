import type { CountryBiasLocale } from './types';

export const en: CountryBiasLocale = {
  countries: [
    {
      id: 'ar',
      name: 'Argentina',
      flag: '🇦🇷',
      region: 'Americas',
      rationale:
        'Collectivist, high uncertainty avoidance, emotionally expressive, short-term oriented',
      biases: [50, 53, 93, 79, 37, 22, 55, 91, 75, 100, 13],
      confidence: 0.74,
      aliases: ['Argentine', 'Argentinian', 'Argentinean'],
      biasRationale:
        'Argentina scores moderately collectivist (46 IDV) with high uncertainty avoidance (86) and very high indulgence (62). This creates a culture where group consensus and emotional storytelling drive decisions, while uncertainty avoidance pushes toward familiar options. The strong indulgence score manifests as susceptibility to instant gratification and positivity-seeking biases.',
    },
    {
      id: 'am',
      name: 'Armenia',
      flag: '🇦🇲',
      region: 'Middle East',
      rationale:
        'Collectivist, high power distance, tradition-preserving, diaspora-connected, family-driven',
      biases: [48, 53, 50, 88, 81, 19, 47, 90, 70, 25, 52],
      confidence: 0.67,
      aliases: ['Armenian', 'Hayastan', 'Hayastani'],
      biasRationale:
        'Armenia exhibits high power distance and strong collectivism rooted in ancient cultural traditions and a deeply family-oriented social structure. The diaspora experience reinforces in-group favoritism and endowment effects around cultural heritage. High uncertainty avoidance and long-term orientation from centuries of resilience drive conservatism and escalation of commitment in decision-making.',
    },
    {
      id: 'au',
      name: 'Australia',
      flag: '🇦🇺',
      region: 'Oceania',
      rationale:
        'Individualistic, anti-authority, risk-tolerant, pragmatic-casual',
      biases: [91, 13, 44, 79, 80, 78, 55, 12, 74, 77, 71, 37],
      confidence: 0.87,
      aliases: ['Australian', 'Aussie', 'AUS', 'AU'],
      biasRationale:
        "Australia scores very high on individualism (90) and indulgence (71) with notably low power distance (38). The anti-authoritarian 'tall poppy syndrome' culture fuels reactance and fundamental attribution error, while high indulgence drives hyperbolic discounting and positivity effects. Strong individualism produces illusory superiority and overconfidence in personal judgment.",
    },
    {
      id: 'at',
      name: 'Austria',
      flag: '🇦🇹',
      region: 'Europe',
      rationale:
        'Moderate individualism, high uncertainty avoidance, masculine achievement-oriented, structured',
      biases: [86, 93, 69, 44, 19, 102, 85, 87, 81, 20, 94],
      confidence: 0.8,
      aliases: ['Austrian', 'AUT'],
      biasRationale:
        'Austria scores high on masculinity (79) and uncertainty avoidance (70) with moderate individualism (55). The achievement-oriented culture combined with a need for structure drives zero-risk bias and ambiguity avoidance. High masculinity produces overconfidence and fundamental attribution error, while the detail-oriented Austrian mindset creates reliance on systematic processing and information-seeking.',
    },
    {
      id: 'be',
      name: 'Belgium',
      flag: '🇧🇪',
      region: 'Europe',
      rationale:
        'High uncertainty avoidance, moderate individualism, consensus-seeking, linguistically divided',
      biases: [93, 86, 19, 50, 70, 94, 92, 10, 58, 102, 85],
      confidence: 0.79,
      aliases: ['Belgian', 'BEL'],
      biasRationale:
        'Belgium scores very high on uncertainty avoidance (94) with moderate individualism (75) and low indulgence (57). The strong uncertainty avoidance drives ambiguity aversion and zero-risk bias, while the consensus-seeking culture between linguistic communities produces bandwagon effects and social desirability. The restrained dimension contributes to omission bias and normality bias.',
    },
    {
      id: 'br',
      name: 'Brazil',
      flag: '🇧🇷',
      region: 'Americas',
      rationale:
        'High power distance, collectivist, indulgent, emotionally expressive',
      biases: [79, 55, 50, 37, 13, 75, 100, 22, 41, 53, 48, 84],
      confidence: 0.82,
      aliases: ['Brazilian', 'Brasil', 'BR'],
      biasRationale:
        'Brazil scores high on power distance (69) and very high on indulgence (59) with strong collectivism (38 IDV). The indulgent, emotionally expressive culture drives hyperbolic discounting and positivity effects, while collectivism produces bandwagon and in-group biases. High power distance fosters authority bias, and the vibrant storytelling tradition makes anecdotal evidence particularly persuasive.',
    },
    {
      id: 'ca',
      name: 'Canada',
      flag: '🇨🇦',
      region: 'Americas',
      rationale:
        'Individualistic, egalitarian, multicultural consensus-seeking, moderate uncertainty avoidance',
      biases: [70, 50, 77, 55, 91, 80, 22, 93, 97, 10, 13, 44],
      confidence: 0.87,
      aliases: ['Canadian', 'CAN', 'CA'],
      biasRationale:
        'Canada scores high on individualism (80) with low power distance (39) and moderate indulgence (68). The multicultural consensus culture produces social desirability bias and bandwagon effects alongside individualistic illusory superiority. Moderate uncertainty avoidance (48) paired with politeness norms creates a tendency toward omission bias, while indulgence drives appeal to novelty and positivity effects.',
    },
    {
      id: 'cl',
      name: 'Chile',
      flag: '🇨🇱',
      region: 'Americas',
      rationale:
        'Moderate collectivism, high uncertainty avoidance, class-conscious, restrained',
      biases: [93, 86, 48, 90, 19, 83, 10, 30, 50, 57, 81],
      confidence: 0.73,
      aliases: ['Chilean', 'CHL'],
      biasRationale:
        'Chile scores high on uncertainty avoidance (86) with moderate collectivism (23 IDV) and notably low indulgence (28). The high uncertainty avoidance creates strong ambiguity and zero-risk biases, while restraint produces omission bias and ostrich effects. Class-conscious social hierarchies drive authority bias and system justification, with loss aversion reinforced by economic volatility awareness.',
    },
    {
      id: 'cn',
      name: 'China',
      flag: '🇨🇳',
      region: 'Asia',
      rationale:
        'Collectivist, high power distance, long-term strategic, face-saving',
      biases: [48, 81, 90, 22, 18, 57, 83, 50, 42, 104, 53, 70, 19],
      confidence: 0.88,
      aliases: ['Chinese', 'PRC', 'CN', 'Zhongguo'],
      biasRationale:
        'China scores very high on long-term orientation (87) and power distance (80) with strong collectivism (20 IDV). The long-term strategic culture drives escalation of commitment, loss aversion, and mental accounting. High power distance produces authority bias and system justification, while face-saving collectivism creates social desirability bias, bandwagon effects, and strong in-group favoritism.',
    },
    {
      id: 'co',
      name: 'Colombia',
      flag: '🇨🇴',
      region: 'Americas',
      rationale:
        'Collectivist, high power distance, indulgent, family-oriented, entrepreneurial',
      biases: [48, 53, 79, 55, 37, 50, 13, 75, 22, 41, 100],
      confidence: 0.72,
      aliases: ['Colombian', 'COL'],
      biasRationale:
        'Colombia scores high on power distance (67) and very high on indulgence (83) with strong collectivism (13 IDV). The highly indulgent culture drives hyperbolic discounting and positivity effects, while collectivism and family orientation produce in-group favoritism and bandwagon effects. The entrepreneurial spirit combined with anecdotal storytelling traditions creates susceptibility to hot hand fallacy and vivid narrative persuasion.',
    },
    {
      id: 'cz',
      name: 'Czech Republic',
      flag: '🇨🇿',
      region: 'Europe',
      rationale:
        'Individualistic, pragmatic, high uncertainty avoidance, restrained, skeptical',
      biases: [93, 19, 91, 30, 10, 17, 86, 83, 87, 71, 25],
      confidence: 0.74,
      aliases: ['Czech', 'Czechia', 'CZE'],
      biasRationale:
        'The Czech Republic scores high on individualism (58) with notable uncertainty avoidance (74) and very low indulgence (29). The restrained, skeptical culture produces ostrich and omission biases alongside negativity bias. High uncertainty avoidance drives ambiguity aversion and conservatism, while the pragmatic individualism creates reactance toward external pressures and processing difficulty engagement.',
    },
    {
      id: 'dk',
      name: 'Denmark',
      flag: '🇩🇰',
      region: 'Europe',
      rationale:
        'Highly individualistic, egalitarian, feminine culture, low power distance, indulgent',
      biases: [70, 58, 97, 10, 50, 55, 80, 13, 85, 93, 44],
      confidence: 0.83,
      aliases: ['Danish', 'Dane', 'DNK'],
      biasRationale:
        "Denmark scores very high on individualism (74) with extremely low power distance (18) and high indulgence (70). The 'Janteloven' egalitarian culture drives social desirability bias and normality bias, discouraging self-promotion. Low masculinity (16) produces consensus-seeking through bandwagon effects, while indulgence creates appeal to novelty and positivity biases. The feminine culture values less-is-better simplicity.",
    },
    {
      id: 'eg',
      name: 'Egypt',
      flag: '🇪🇬',
      region: 'Middle East',
      rationale:
        'High power distance, collectivist, restrained, tradition-anchored, high uncertainty avoidance',
      biases: [48, 53, 90, 19, 47, 93, 52, 70, 88, 58, 25, 30],
      confidence: 0.72,
      aliases: ['Egyptian', 'EGY', 'Misr'],
      biasRationale:
        'Egypt scores very high on power distance (70) with strong collectivism and high restraint. The tradition-anchored culture with strong authority structures drives authority bias, system justification, and conservatism. High uncertainty avoidance produces ambiguity aversion, while collectivism creates in-group favoritism and out-group homogeneity. Restraint manifests as ostrich effect and social desirability bias.',
    },
    {
      id: 'et',
      name: 'Ethiopia',
      flag: '🇪🇹',
      region: 'Africa',
      rationale:
        'Collectivist, communal, high power distance, oral tradition, spiritually grounded',
      biases: [48, 53, 37, 47, 50, 31, 96, 76, 19, 70, 58],
      confidence: 0.66,
      aliases: ['Ethiopian', 'ETH'],
      biasRationale:
        'Ethiopia exhibits high power distance and strong collectivism rooted in communal social structures and deep spiritual traditions. The rich oral storytelling tradition makes anecdotal evidence and conjunction fallacy particularly influential. Authority bias and just-world fallacy are reinforced by religious frameworks, while community-driven decision-making produces bandwagon effects and in-group favoritism.',
    },
    {
      id: 'fi',
      name: 'Finland',
      flag: '🇫🇮',
      region: 'Europe',
      rationale:
        'Individualistic, low power distance, high uncertainty avoidance, restrained, egalitarian',
      biases: [93, 86, 10, 30, 70, 87, 102, 85, 17, 94, 58, 19],
      confidence: 0.83,
      aliases: ['Finnish', 'Finn', 'Suomi', 'FIN'],
      biasRationale:
        "Finland scores high on individualism (63) with very low power distance (33), high uncertainty avoidance (59), and notably low indulgence (57). The restrained 'sisu' culture drives omission bias and ostrich effects, while uncertainty avoidance creates ambiguity aversion and zero-risk bias. The methodical Finnish approach produces processing difficulty engagement and serial recall preferences, with social desirability reflecting the reserved communication style.",
    },
    {
      id: 'fr',
      name: 'France',
      flag: '🇫🇷',
      region: 'Europe',
      rationale:
        'Individualistic yet hierarchical, aesthetics-driven, intellectual-contrarian',
      biases: [54, 20, 91, 89, 92, 97, 104, 71, 14, 83, 69, 87],
      confidence: 0.88,
      aliases: ['French', 'FRA', 'FR'],
      biasRationale:
        'France scores high on individualism (71) with notable power distance (68) and high uncertainty avoidance (86). The aesthetics-driven culture amplifies halo effects and contrast effects, while intellectual contrarianism fuels reactance and backfire effects. High uncertainty avoidance combined with individualism creates a unique profile where overconfidence meets loss aversion, and the emphasis on intellectual rigor drives processing difficulty engagement.',
    },
    {
      id: 'de',
      name: 'Germany',
      flag: '🇩🇪',
      region: 'Europe',
      rationale:
        'Rule-oriented, engineering mindset, precision-driven, moderate individualism',
      biases: [87, 94, 86, 19, 25, 49, 102, 85, 81, 93, 83, 17],
      confidence: 0.89,
      aliases: ['German', 'Deutsche', 'DEU', 'DE'],
      biasRationale:
        'Germany scores high on individualism (67) with strong uncertainty avoidance (65) and high long-term orientation (83). The engineering-precision culture drives processing difficulty engagement, information bias, and serial recall preferences. Uncertainty avoidance produces zero-risk and ambiguity biases, while long-term orientation reinforces escalation of commitment and loss aversion. The rule-oriented mindset creates conservatism and confirmation bias.',
    },
    {
      id: 'gr',
      name: 'Greece',
      flag: '🇬🇷',
      region: 'Europe',
      rationale:
        'Collectivist-leaning, very high uncertainty avoidance, high power distance, indulgent',
      biases: [93, 86, 48, 53, 79, 55, 91, 88, 19, 37, 100, 81],
      confidence: 0.75,
      aliases: ['Greek', 'Hellenic', 'GRC', 'Hellas'],
      biasRationale:
        'Greece scores the highest uncertainty avoidance in Europe (100) with high power distance (60) and moderate collectivism (35 IDV). The extreme uncertainty avoidance drives ambiguity and zero-risk biases, while the indulgent Mediterranean culture (50 IVR) produces hyperbolic discounting and positivity effects. Strong family collectivism creates in-group favoritism, and the rhetorical tradition amplifies anecdotal evidence persuasion.',
    },
    {
      id: 'in',
      name: 'India',
      flag: '🇮🇳',
      region: 'Asia',
      rationale:
        'Hierarchical, collectivist, long-term oriented, bargaining culture',
      biases: [48, 53, 25, 81, 47, 96, 57, 18, 36, 42, 50, 88, 90],
      confidence: 0.85,
      aliases: ['Indian', 'IND', 'IN', 'Bharat'],
      biasRationale:
        'India scores very high on power distance (77) with strong long-term orientation (51) and moderate collectivism (48 IDV). The hierarchical culture drives authority bias and system justification, while the bargaining tradition amplifies anchoring effects and mental accounting. Long-term orientation produces escalation of commitment, and the storytelling tradition makes conjunction fallacy and anecdotal narratives highly persuasive.',
    },
    {
      id: 'id',
      name: 'Indonesia',
      flag: '🇮🇩',
      region: 'Asia',
      rationale:
        'Collectivist, high power distance, harmony-seeking, spiritually grounded',
      biases: [48, 50, 70, 58, 10, 30, 47, 90, 53, 31, 19, 42],
      confidence: 0.78,
      aliases: ['Indonesian', 'IDN'],
      biasRationale:
        "Indonesia scores very high on power distance (78) with strong collectivism (14 IDV) and low indulgence (38). The harmony-seeking 'musyawarah' culture drives social desirability, omission bias, and normality bias. High power distance produces authority bias and system justification, while spiritual grounding reinforces just-world fallacy and subjective validation. Restraint manifests as ostrich effect avoidance of confrontation.",
    },
    {
      id: 'ir',
      name: 'Iran',
      flag: '🇮🇷',
      region: 'Middle East',
      rationale:
        'High power distance, collectivist, high uncertainty avoidance, restrained, tradition-preserving',
      biases: [48, 90, 19, 93, 53, 52, 88, 47, 30, 10, 70, 89],
      confidence: 0.68,
      aliases: ['Iranian', 'Persian', 'IRN', 'Persia'],
      biasRationale:
        'Iran scores very high on power distance and uncertainty avoidance with strong collectivism and restraint. The tradition-preserving culture drives conservatism, system justification, and authority bias. High uncertainty avoidance produces ambiguity aversion, while collectivism reinforces in-group favoritism and out-group homogeneity. Restraint and cultural resilience create ostrich and omission biases, with backfire effects reflecting resistance to external narratives.',
    },
    {
      id: 'ie',
      name: 'Ireland',
      flag: '🇮🇪',
      region: 'Europe',
      rationale:
        'Individualistic, low power distance, masculine, short-term oriented, highly indulgent',
      biases: [13, 37, 79, 55, 80, 91, 44, 77, 12, 100, 75],
      confidence: 0.76,
      aliases: ['Irish', 'IRL', 'Eire'],
      biasRationale:
        'Ireland scores high on individualism (70) with low power distance (28) and very high indulgence (65). The storytelling culture makes anecdotal evidence and humor effects particularly powerful. High indulgence drives hyperbolic discounting and positivity effects, while individualism produces illusory superiority and reactance. The short-term orientation (24 LTO) creates appeal to novelty, and the convivial culture amplifies the bizarreness and Barnum effects.',
    },
    {
      id: 'il',
      name: 'Israel',
      flag: '🇮🇱',
      region: 'Middle East',
      rationale:
        'Direct communication, startup culture, security-conscious, low power distance',
      biases: [69, 91, 89, 74, 80, 83, 1, 36, 79, 84, 78, 77],
      confidence: 0.84,
      aliases: ['Israeli', 'ISR', 'IL'],
      biasRationale:
        "Israel scores low on power distance (13) with high individualism (54) and moderate uncertainty avoidance (81). The 'chutzpah' startup culture drives overconfidence, Dunning-Kruger, and illusory superiority, while direct communication style produces reactance and backfire effects. Security consciousness amplifies availability heuristics and neglect of probability, and the innovation-driven economy creates appeal to novelty and IKEA effect.",
    },
    {
      id: 'it',
      name: 'Italy',
      flag: '🇮🇹',
      region: 'Europe',
      rationale:
        'Individualistic, high uncertainty avoidance, masculine, aesthetics-driven, family-oriented',
      biases: [54, 93, 86, 20, 53, 69, 14, 92, 104, 83, 88, 79],
      confidence: 0.84,
      aliases: ['Italian', 'ITA', 'IT'],
      biasRationale:
        'Italy scores high on individualism (76), masculinity (70), and uncertainty avoidance (75). The aesthetics-obsessed culture amplifies halo effects and picture superiority, while high uncertainty avoidance creates ambiguity and zero-risk biases. Masculinity drives overconfidence and competitive framing via contrast and decoy effects. Family-oriented collectivism at the local level produces in-group favoritism, with loss aversion and endowment effects reinforced by heritage preservation values.',
    },
    {
      id: 'jp',
      name: 'Japan',
      flag: '🇯🇵',
      region: 'Asia',
      rationale:
        'Collectivist, extremely high uncertainty avoidance, hierarchical, detail-perfectionist',
      biases: [50, 90, 19, 48, 70, 93, 86, 101, 54, 102, 81, 83, 10],
      confidence: 0.9,
      aliases: ['Japanese', 'JPN', 'JP', 'Nippon'],
      biasRationale:
        'Japan scores extremely high on uncertainty avoidance (92) and long-term orientation (88) with strong masculinity (95) and collectivism (46 IDV). The perfectionist culture drives zero-risk bias, ambiguity aversion, and meticulous serial recall processing. High collectivism produces bandwagon effects and social desirability, while long-term orientation reinforces escalation of commitment and loss aversion. The hierarchical structure creates authority bias and system justification.',
    },
    {
      id: 'ke',
      name: 'Kenya',
      flag: '🇰🇪',
      region: 'Africa',
      rationale:
        'Community-driven, mobile-first economy, resourceful, oral storytelling tradition',
      biases: [37, 53, 79, 41, 76, 40, 84, 96, 69, 55, 48, 50],
      confidence: 0.73,
      aliases: ['Kenyan', 'KEN'],
      biasRationale:
        'Kenya exhibits moderate collectivism with entrepreneurial dynamism and a mobile-first digital economy. The oral storytelling tradition makes anecdotal evidence and conjunction fallacy highly persuasive. Community-driven decision-making produces in-group favoritism and bandwagon effects, while the resourceful entrepreneurial culture drives illusion of control, overconfidence, and IKEA effect from self-built solutions.',
    },
    {
      id: 'my',
      name: 'Malaysia',
      flag: '🇲🇾',
      region: 'Asia',
      rationale:
        'Very high power distance, collectivist, moderate uncertainty avoidance, harmony-seeking',
      biases: [48, 50, 53, 90, 70, 58, 10, 47, 22, 88, 19],
      confidence: 0.75,
      aliases: ['Malaysian', 'MYS'],
      biasRationale:
        "Malaysia scores the highest power distance globally (100) with strong collectivism (26 IDV) and moderate uncertainty avoidance (36). The extreme power distance drives authority bias and system justification, while harmony-seeking collectivism produces bandwagon effects, in-group favoritism, and social desirability. The 'face-saving' culture reinforces omission bias and normality bias, with framing effects amplified by the multiethnic consensus-building tradition.",
    },
    {
      id: 'mx',
      name: 'Mexico',
      flag: '🇲🇽',
      region: 'Americas',
      rationale:
        'Collectivist, family-centered, high power distance, expressive-indulgent',
      biases: [53, 48, 79, 37, 100, 7, 55, 75, 22, 84, 50, 41],
      confidence: 0.82,
      aliases: ['Mexican', 'MEX', 'MX'],
      biasRationale:
        'Mexico scores high on power distance (81) with strong collectivism (30 IDV) and very high indulgence (97). The family-centered culture drives in-group favoritism and authority bias, while extreme indulgence creates hyperbolic discounting and positivity effects. The emotionally expressive culture amplifies mood-congruent memory and fading affect bias, with anecdotal storytelling and Barnum-effect susceptibility reflecting the warm interpersonal tradition.',
    },
    {
      id: 'ma',
      name: 'Morocco',
      flag: '🇲🇦',
      region: 'Africa',
      rationale:
        'High power distance, collectivist, high uncertainty avoidance, restrained, tradition-oriented',
      biases: [48, 53, 93, 19, 90, 47, 70, 52, 88, 10, 30, 18],
      confidence: 0.67,
      aliases: ['Moroccan', 'MAR', 'Maghreb'],
      biasRationale:
        'Morocco scores high on power distance (70) with strong collectivism (25 IDV) and high uncertainty avoidance (68). The tradition-oriented culture drives conservatism, authority bias, and system justification. High uncertainty avoidance produces ambiguity aversion, while collectivism reinforces in-group favoritism and out-group homogeneity. The bazaar-influenced negotiation culture amplifies anchoring effects, with restraint manifesting as omission and ostrich effects.',
    },
    {
      id: 'nl',
      name: 'Netherlands',
      flag: '🇳🇱',
      region: 'Europe',
      rationale:
        'Highly individualistic, egalitarian, direct communicators, low power distance, indulgent',
      biases: [77, 91, 44, 80, 79, 55, 94, 87, 71, 97, 74, 13],
      confidence: 0.87,
      aliases: ['Dutch', 'Holland', 'NLD', 'NL', 'Netherlander'],
      biasRationale:
        "The Netherlands scores very high on individualism (80) with very low power distance (38) and high indulgence (68). The direct, egalitarian 'poldermodel' culture drives illusory superiority, reactance, and fundamental attribution error. High indulgence produces hyperbolic discounting and positivity effects, while the analytical trading tradition creates information bias and processing difficulty engagement. Dutch directness amplifies third-person effect and Dunning-Kruger tendencies.",
    },
    {
      id: 'nz',
      name: 'New Zealand',
      flag: '🇳🇿',
      region: 'Oceania',
      rationale:
        'Individualistic, egalitarian, anti-pretension, pragmatic, highly indulgent',
      biases: [91, 44, 77, 13, 55, 80, 79, 70, 12, 97, 58, 74],
      confidence: 0.82,
      aliases: ['New Zealander', 'Kiwi', 'NZL', 'NZ', 'Aotearoa'],
      biasRationale:
        "New Zealand scores high on individualism (79) with low power distance (22) and high indulgence (75). The 'tall poppy' anti-pretension culture creates reactance and social desirability bias, while egalitarianism drives fundamental attribution error. High indulgence produces hyperbolic discounting and positivity effects. The pragmatic Kiwi culture values humor effects and less-is-better simplicity, with normality bias reflecting the laid-back lifestyle orientation.",
    },
    {
      id: 'ng',
      name: 'Nigeria',
      flag: '🇳🇬',
      region: 'Africa',
      rationale:
        'Collectivist, high power distance, entrepreneurial, faith-oriented',
      biases: [48, 47, 31, 37, 40, 75, 69, 79, 78, 53, 41, 76],
      confidence: 0.73,
      aliases: ['Nigerian', 'NGA', 'Naija'],
      biasRationale:
        'Nigeria scores high on power distance (80) with strong collectivism (30 IDV) and moderate indulgence (84). The faith-oriented culture amplifies just-world fallacy and subjective validation, while the entrepreneurial hustle culture drives overconfidence, risk compensation, and illusion of control. High indulgence creates hyperbolic discounting, and the oral tradition makes anecdotal evidence and Barnum effects highly persuasive.',
    },
    {
      id: 'no',
      name: 'Norway',
      flag: '🇳🇴',
      region: 'Europe',
      rationale:
        'Highly individualistic, very low power distance, feminine, indulgent, egalitarian',
      biases: [70, 58, 10, 97, 55, 80, 50, 93, 44, 13, 85],
      confidence: 0.84,
      aliases: ['Norwegian', 'NOR', 'NO'],
      biasRationale:
        "Norway scores high on individualism (69) with extremely low power distance (31) and very low masculinity (8). The deeply egalitarian 'Janteloven' culture drives social desirability bias and normality bias, suppressing self-promotion. Low masculinity produces consensus-seeking bandwagon effects and less-is-better preferences. High indulgence (55) creates positivity effects and appeal to novelty, while the structured society produces omission bias in decision-making.",
    },
    {
      id: 'pk',
      name: 'Pakistan',
      flag: '🇵🇰',
      region: 'Asia',
      rationale:
        'Very high power distance, collectivist, restrained, tradition-oriented, masculine',
      biases: [48, 53, 47, 90, 50, 19, 52, 70, 30, 10, 88, 43],
      confidence: 0.72,
      aliases: ['Pakistani', 'PAK', 'PK'],
      biasRationale:
        'Pakistan scores very high on power distance (55) and collectivism (14 IDV) with high masculinity (50) and very low indulgence (0). The tradition-oriented culture with strong authority structures drives authority bias, system justification, and conservatism. Extreme restraint produces ostrich and omission biases, while collectivism creates in-group favoritism, bandwagon effects, and out-group homogeneity. The just-world fallacy is reinforced by religious and social frameworks.',
    },
    {
      id: 'pe',
      name: 'Peru',
      flag: '🇵🇪',
      region: 'Americas',
      rationale:
        'High power distance, collectivist, moderate uncertainty avoidance, restrained',
      biases: [48, 53, 50, 19, 90, 10, 30, 47, 79, 37, 88],
      confidence: 0.68,
      aliases: ['Peruvian', 'PER'],
      biasRationale:
        'Peru scores high on power distance (64) with strong collectivism (16 IDV) and moderate uncertainty avoidance (87). The hierarchical culture drives authority bias and system justification, while collectivism produces in-group favoritism and bandwagon effects. High uncertainty avoidance creates conservatism, and the restrained dimension (46 IVR) manifests as omission and ostrich effects. Anecdotal storytelling traditions remain influential in decision-making.',
    },
    {
      id: 'ph',
      name: 'Philippines',
      flag: '🇵🇭',
      region: 'Asia',
      rationale:
        'High power distance, collectivist, very high indulgence, family-centered',
      biases: [48, 53, 79, 55, 50, 13, 37, 75, 100, 47, 70, 41],
      confidence: 0.74,
      aliases: ['Filipino', 'Filipina', 'Philippine', 'PHL', 'Pinoy'],
      biasRationale:
        "The Philippines scores high on power distance (94) with strong collectivism (32 IDV) and very high indulgence (42). The 'bayanihan' communal culture drives in-group favoritism and bandwagon effects, while authority deference produces authority bias. High indulgence creates hyperbolic discounting and positivity effects. The warm, humor-driven culture amplifies humor effects and Barnum susceptibility, with fading affect bias reflecting the resilient 'bahala na' attitude.",
    },
    {
      id: 'pl',
      name: 'Poland',
      flag: '🇵🇱',
      region: 'Europe',
      rationale:
        'Individualistic, high uncertainty avoidance, masculine, restrained, pragmatic',
      biases: [93, 86, 19, 69, 44, 83, 81, 10, 30, 17, 25, 87],
      confidence: 0.8,
      aliases: ['Polish', 'Pole', 'POL', 'PL'],
      biasRationale:
        'Poland scores high on individualism (60) with very high uncertainty avoidance (93) and low indulgence (29). The strong uncertainty avoidance drives ambiguity and zero-risk biases, while restraint produces omission bias and ostrich effects. High masculinity (64) creates overconfidence and fundamental attribution error. Long-term orientation (38) combined with historical caution produces loss aversion, escalation of commitment, and negativity bias.',
    },
    {
      id: 'pt',
      name: 'Portugal',
      flag: '🇵🇹',
      region: 'Europe',
      rationale:
        'Collectivist-leaning, very high uncertainty avoidance, feminine, restrained',
      biases: [93, 86, 70, 10, 58, 50, 19, 83, 30, 100, 55, 85],
      confidence: 0.76,
      aliases: ['Portuguese', 'PRT', 'PT'],
      biasRationale:
        "Portugal scores the highest uncertainty avoidance in Europe (99) with moderate collectivism (27 IDV) and low masculinity (31). Extreme uncertainty avoidance drives ambiguity and zero-risk biases, while the 'saudade' cultural melancholy creates fading affect bias and social desirability. Low masculinity produces normality bias and consensus-seeking bandwagon effects. Restraint (33 IVR) manifests as omission and ostrich biases, with loss aversion reinforced by cautious financial culture.",
    },
    {
      id: 'ro',
      name: 'Romania',
      flag: '🇷🇴',
      region: 'Europe',
      rationale:
        'High power distance, collectivist-leaning, high uncertainty avoidance, restrained',
      biases: [48, 93, 90, 19, 10, 30, 83, 52, 53, 70, 17],
      confidence: 0.72,
      aliases: ['Romanian', 'ROU', 'RO'],
      biasRationale:
        'Romania scores high on power distance (90) with high uncertainty avoidance (90) and low indulgence (20). The combination of strong hierarchy and uncertainty avoidance drives authority bias, system justification, and ambiguity aversion. Extreme restraint produces omission and ostrich biases, while collectivist tendencies create in-group favoritism and out-group homogeneity. Historical skepticism reinforces conservatism, negativity bias, and loss aversion.',
    },
    {
      id: 'sa',
      name: 'Saudi Arabia',
      flag: '🇸🇦',
      region: 'Middle East',
      rationale:
        'High power distance, collectivist, tradition-preserving, restrained',
      biases: [48, 90, 19, 52, 43, 88, 47, 89, 53, 58, 70, 86],
      confidence: 0.82,
      aliases: ['Saudi', 'KSA', 'SAU'],
      biasRationale:
        'Saudi Arabia scores very high on power distance (95) with strong collectivism and high uncertainty avoidance (80). The tradition-preserving culture drives conservatism, system justification, and authority bias. Collectivism produces in-group favoritism, out-group homogeneity, and group attribution errors. The restrained culture creates endowment effects around tradition and normality bias, with backfire effects reflecting resistance to rapid cultural change narratives.',
    },
    {
      id: 'sg',
      name: 'Singapore',
      flag: '🇸🇬',
      region: 'Asia',
      rationale:
        'Low individualism, very high power distance, pragmatic, restrained, meritocratic',
      biases: [48, 90, 49, 102, 85, 81, 83, 57, 86, 70, 50, 19, 93],
      confidence: 0.85,
      aliases: ['Singaporean', 'SGP', 'SG'],
      biasRationale:
        'Singapore scores very high on power distance (74) with low individualism (20) and very high long-term orientation (72). The pragmatic meritocratic culture drives authority bias, system justification, and automation bias from tech-forward governance. Long-term orientation produces escalation of commitment, loss aversion, and mental accounting. Low indulgence (46) creates zero-risk bias and social desirability, while the systematic society reinforces serial recall and unit bias.',
    },
    {
      id: 'za',
      name: 'South Africa',
      flag: '🇿🇦',
      region: 'Africa',
      rationale:
        'High power distance, collectivist, masculine, short-term oriented, restrained',
      biases: [48, 53, 52, 69, 44, 47, 79, 78, 37, 43, 91, 83],
      confidence: 0.74,
      aliases: ['South African', 'ZAF', 'SA', 'Mzansi'],
      biasRationale:
        'South Africa scores high on power distance (49) with moderate individualism (65) and high masculinity (63). The complex multicultural society produces in-group favoritism, out-group homogeneity, and group attribution errors. Masculinity drives overconfidence and fundamental attribution error, while short-term orientation (34) creates hyperbolic discounting. The entrepreneurial resilience culture amplifies risk compensation, and anecdotal storytelling traditions remain powerful. Reactance reflects post-colonial resistance patterns.',
    },
    {
      id: 'kr',
      name: 'South Korea',
      flag: '🇰🇷',
      region: 'Asia',
      rationale:
        'Collectivist, appearance-conscious, tech-forward, Confucian hierarchy',
      biases: [50, 54, 64, 80, 20, 70, 15, 77, 90, 84, 81, 83, 48],
      confidence: 0.88,
      aliases: ['Korean', 'South Korean', 'KOR', 'KR'],
      biasRationale:
        "South Korea scores high on long-term orientation (100) and uncertainty avoidance (85) with strong collectivism (18 IDV). The appearance-conscious 'nunchi' culture amplifies spotlight effect, halo effect, and social desirability bias. Confucian hierarchy produces authority bias and system justification, while long-term orientation drives escalation of commitment and loss aversion. The tech-forward K-culture creates strong appeal to novelty and IKEA effects from participatory fan culture.",
    },
    {
      id: 'es',
      name: 'Spain',
      flag: '🇪🇸',
      region: 'Europe',
      rationale:
        'Collectivist-leaning, very high uncertainty avoidance, feminine-leaning, indulgent',
      biases: [93, 86, 53, 55, 79, 50, 37, 22, 13, 100, 91, 20],
      confidence: 0.83,
      aliases: ['Spanish', 'Spaniard', 'ESP', 'ES'],
      biasRationale:
        'Spain scores very high on uncertainty avoidance (86) with moderate collectivism (51 IDV) and high indulgence (44). The uncertainty avoidance drives ambiguity and zero-risk biases, while indulgence creates hyperbolic discounting and positivity effects. The social, family-oriented culture produces in-group favoritism and bandwagon effects. The expressive communication style amplifies framing effects and anecdotal persuasion, with humor effects and reactance reflecting the passionate Mediterranean temperament.',
    },
    {
      id: 'se',
      name: 'Sweden',
      flag: '🇸🇪',
      region: 'Europe',
      rationale:
        "Egalitarian, consensus-seeking, low indulgence, 'Lagom' moderation culture",
      biases: [93, 70, 10, 58, 76, 97, 30, 85, 50, 17, 44, 80],
      confidence: 0.88,
      aliases: ['Swedish', 'Swede', 'SWE', 'SE'],
      biasRationale:
        "Sweden scores very high on individualism (71) with extremely low power distance (31) and very low masculinity (5). The 'Lagom' moderation culture drives social desirability bias, normality bias, and omission bias through consensus-seeking. Low masculinity creates less-is-better preferences and bandwagon conformity to group norms. The progressive culture produces appeal to novelty while maintaining ambiguity aversion, with fundamental attribution error reflecting the individualistic meritocratic belief system.",
    },
    {
      id: 'ch',
      name: 'Switzerland',
      flag: '🇨🇭',
      region: 'Europe',
      rationale:
        'Individualistic, high uncertainty avoidance, moderate power distance, restrained, precision-driven',
      biases: [86, 93, 94, 87, 102, 19, 81, 83, 85, 97, 10, 49],
      confidence: 0.84,
      aliases: ['Swiss', 'CHE', 'CH'],
      biasRationale:
        'Switzerland scores high on individualism (68) with notable uncertainty avoidance (58) and moderate restraint (66 IVR). The precision-driven culture amplifies zero-risk bias, ambiguity aversion, and information bias. The banking and watchmaking traditions reinforce processing difficulty engagement and serial recall. Long-term orientation (74) drives escalation of commitment and loss aversion, while the consensus-based direct democracy creates omission bias and less-is-better preferences.',
    },
    {
      id: 'th',
      name: 'Thailand',
      flag: '🇹🇭',
      region: 'Asia',
      rationale:
        'High power distance, collectivist, low uncertainty avoidance, restrained, harmony-seeking',
      biases: [48, 50, 53, 70, 55, 58, 10, 22, 90, 47, 100, 13],
      confidence: 0.75,
      aliases: ['Thai', 'THA', 'TH', 'Siam'],
      biasRationale:
        "Thailand scores high on power distance (64) with strong collectivism (20 IDV) and low uncertainty avoidance (64). The 'kreng jai' harmony-seeking culture drives social desirability, omission bias, and normality bias through conflict avoidance. High power distance produces authority bias and system justification, while collectivism creates bandwagon effects and in-group favoritism. The Buddhist-influenced 'mai pen rai' attitude produces fading affect bias and positivity effects.",
    },
    {
      id: 'tr',
      name: 'Turkey',
      flag: '🇹🇷',
      region: 'Middle East',
      rationale:
        'Collectivist, high power distance, negotiation culture, honor-based social codes',
      biases: [48, 18, 53, 81, 22, 43, 52, 88, 47, 25, 93, 90],
      confidence: 0.82,
      aliases: ['Turkish', 'Turk', 'TUR', 'TR', 'Turkiye'],
      biasRationale:
        'Turkey scores high on power distance (66) with strong collectivism (37 IDV) and high uncertainty avoidance (85). The negotiation-rich culture amplifies anchoring effects and framing, while honor-based social codes drive in-group favoritism and group attribution errors. High uncertainty avoidance produces ambiguity aversion and system justification. Escalation of commitment reflects the cultural emphasis on persistence and follow-through in social obligations.',
    },
    {
      id: 'ae',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      region: 'Middle East',
      rationale:
        'Very high power distance, collectivist, future-oriented, status-conscious, cosmopolitan',
      biases: [48, 54, 80, 90, 53, 88, 20, 57, 79, 15, 86, 50],
      confidence: 0.74,
      aliases: ['Emirati', 'UAE', 'ARE', 'Dubai', 'Abu Dhabi'],
      biasRationale:
        'The UAE scores very high on power distance (90) with strong collectivism (25 IDV) and notable restraint. The status-conscious cosmopolitan culture amplifies halo effects, Von Restorff distinctiveness, and contrast effects. High power distance drives authority bias and system justification, while the future-oriented development mindset creates appeal to novelty. Mental accounting is pronounced in the luxury-commerce culture, with zero-risk bias reflecting the emphasis on premium quality and security.',
    },
    {
      id: 'ua',
      name: 'Ukraine',
      flag: '🇺🇦',
      region: 'Europe',
      rationale:
        'Moderate collectivism, high uncertainty avoidance, restrained, resilient, low power distance',
      biases: [1, 83, 91, 19, 93, 17, 81, 84, 78, 10, 53],
      confidence: 0.68,
      aliases: ['Ukrainian', 'UKR', 'UA'],
      biasRationale:
        'Ukraine scores moderate on individualism (25) with high uncertainty avoidance (95) and very low indulgence (18). The resilient culture shaped by historical upheaval amplifies availability heuristics and negativity bias. High uncertainty avoidance creates ambiguity aversion and conservatism, while extreme restraint produces omission bias. The strong community bonds drive in-group favoritism, and the resourceful DIY culture creates IKEA effects. Reactance and risk compensation reflect adaptive responses to adversity.',
    },
    {
      id: 'gb',
      name: 'United Kingdom',
      flag: '🇬🇧',
      region: 'Europe',
      rationale:
        'Individualistic, understated, tradition-respecting, dry humor culture',
      biases: [20, 97, 13, 30, 71, 19, 88, 105, 12, 17, 91, 83],
      confidence: 0.89,
      aliases: [
        'British',
        'English',
        'Scottish',
        'Welsh',
        'UK',
        'GBR',
        'GB',
        'Britain',
      ],
      biasRationale:
        'The UK scores very high on individualism (89) with low power distance (35) and moderate indulgence (69). The understated culture drives less-is-better and contrast effects through subtle communication. Dry humor amplifies humor and bizarreness effects, while tradition-respecting conservatism creates endowment and ostrich effects. High individualism produces third-person effect and reactance, with negativity bias reflecting the culturally embedded skepticism and understatement.',
    },
    {
      id: 'us',
      name: 'United States',
      flag: '🇺🇸',
      region: 'Americas',
      rationale:
        'Individualistic, low uncertainty avoidance, marketing-saturated, instant-gratification culture',
      biases: [77, 79, 69, 50, 80, 22, 83, 37, 71, 91, 44, 74, 78],
      confidence: 0.9,
      aliases: ['American', 'USA', 'US', 'United States of America'],
      biasRationale:
        'The United States scores exceptionally high on individualism (91) and low on uncertainty avoidance (46), creating a culture that rewards self-promotion and risk-taking. Combined with high indulgence (68), Americans are particularly susceptible to instant-gratification biases and overconfidence in personal judgment. The marketing-saturated environment amplifies framing effects, bandwagon pressure, and appeal to novelty.',
    },
    {
      id: 'vn',
      name: 'Vietnam',
      flag: '🇻🇳',
      region: 'Asia',
      rationale:
        'Collectivist, high power distance, long-term oriented, restrained, harmony-seeking',
      biases: [48, 50, 53, 81, 83, 70, 90, 10, 57, 19, 58, 42],
      confidence: 0.73,
      aliases: ['Vietnamese', 'VNM', 'VN'],
      biasRationale:
        'Vietnam scores high on power distance (70) with strong collectivism (20 IDV) and very high long-term orientation (57). The Confucian-influenced culture drives authority bias, system justification, and social desirability through harmony-seeking. Long-term orientation produces escalation of commitment, loss aversion, and mental accounting. Collectivism creates bandwagon effects and in-group favoritism, while restraint (35 IVR) manifests as omission bias and normality bias.',
    },
  ],

  regions: {
    All: 'All',
    Americas: 'Americas',
    Europe: 'Europe',
    Asia: 'Asia',
    'Middle East': 'Middle East',
    Africa: 'Africa',
    Oceania: 'Oceania',
  },

  ui: {
    chooseYour: 'Choose your',
    cyclingWords: ['Persona', 'Opponent', 'Target Audience', 'Rival'],
    cyclingBoldWord: 'Persona',
    subTaglineLead: 'You asked — We built. ',
    subTagline:
      'Select a country to auto-fill a cognitive bias profile. Each template highlights 10–15 biases with higher cultural prevalence — ready to use in the Persona builder.',
    statTemplates: 'Nationality Templates',
    statReady: 'Ready when you are',
    loadingMap: 'Loading map…',
    tooltipBiases: 'biases',
    tooltipHint: 'Click to view bias profile',
    searchPlaceholder: 'Search country or nationality...',
    moreCountries: (n: number) => `+${n} more countries`,
    showLess: 'Show less',
    matchSuffix: '% match',
    whyTheseBiases: 'Why these biases?',
    whyApproxNote:
      'This is an approximate score reflecting how closely the bias template aligns with documented behavioral patterns for this country.',
    hofstedeNote:
      'Based on Hofstede cultural dimensions and behavioral research coverage.',
    useInPersonaBuilder: 'Persona fill {country}',
    emptyStateLead: 'Select the country and ',
    emptyStateLink: 'see the future of your business',
    emptyStateHint: 'Click to load bias template',
    footerBiases: 'biases',
    footerConfidence: 'confidence',
  },
};
