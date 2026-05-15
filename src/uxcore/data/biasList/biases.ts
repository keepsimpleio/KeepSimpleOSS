export type BiasCategory = 'Decision' | 'Perception' | 'Memory' | 'Social';

export interface BiasEntry {
  id: number;
  slug: string;
  name: string;
  scenario: string;
  withoutBias: string;
  withBias: string;
  whyItWorks: string;
  category: BiasCategory;
}

export const biases: BiasEntry[] = [
  {
    id: 1,
    slug: 'availability-heuristics',
    name: 'Availability Heuristics',
    scenario: 'App download page for a blockchain-based file storage product',
    withoutBias:
      'Landing page prominently says "Powered by Blockchain Technology" with crypto-adjacent visuals (chain icons, token references)',
    withBias:
      'Same product described as "Military-Grade Encrypted Cloud Storage" with no blockchain terminology visible — feature parity, different framing',
    whyItWorks:
      'Users recall negative media associations with blockchain/crypto, making them avoid anything linked to it — reframing the same tech with neutral language bypasses the negative availability heuristic.',
    category: 'Perception',
  },
  {
    id: 2,
    slug: 'attentional-bias',
    name: 'Attentional Bias',
    scenario: 'Dashboard with engagement metrics',
    withoutBias: 'Basic profile (75% complete, member since date)',
    withBias:
      'Prominent karma points, likes, contributor rank, activity streak',
    whyItWorks:
      'Emotionally charged metrics draw focus, increasing content creation through desire for social validation.',
    category: 'Perception',
  },
  {
    id: 3,
    slug: 'illusory-truth-effect',
    name: 'Illusory Truth Effect',
    scenario: 'Landing page with repeated claim',
    withoutBias: 'Generic feature description',
    withBias:
      '"#1 project management tool" repeated in headline, subheadline, CTA, and testimonials',
    whyItWorks:
      'Repetition creates familiarity the brain interprets as truth. No proof needed.',
    category: 'Memory',
  },
  {
    id: 4,
    slug: 'mere-exposure-effect',
    name: 'Mere-Exposure Effect',
    scenario: 'Mobile app store listing page targeting French users',
    withoutBias:
      'Generic global listing — standard blue/white color scheme, stock photos of diverse international users, English-first layout',
    withBias:
      'Subtle tricolor (blue-white-red) accent palette, Parisian cityscape watermark behind hero section, testimonials from French users with local city names',
    whyItWorks:
      'Familiar cultural cues (colors, landmarks, local names) trigger subconscious preference without the user recognizing why the page feels more trustworthy.',
    category: 'Memory',
  },
  {
    id: 5,
    slug: 'context-effect',
    name: 'Context Effect',
    scenario: 'Donation landing page',
    withoutBias: 'Commercial visual language ("BUY NOW" CTA, urgency badge)',
    withBias:
      'Aligned context (nature imagery, "Protect a Forest" CTA, supporter testimonials)',
    whyItWorks:
      'When visual environment matches message values, credibility and conversion increase.',
    category: 'Perception',
  },
  {
    id: 6,
    slug: 'cue-dependent-forgetting',
    name: 'Cue-Dependent Forgetting',
    scenario: 'Fitness app re-engagement push notification for a lapsed user',
    withoutBias:
      '"You haven\'t worked out in 18 days. Open the app to get back on track."',
    withBias:
      '"Remember your 14-day streak in October? You crushed 42 workouts that month. Ready for round two?" with a mini chart of their past streak',
    whyItWorks:
      'Specific cues from past success (streak length, month, workout count) trigger retrieval of positive memories that generic prompts cannot access.',
    category: 'Memory',
  },
  {
    id: 7,
    slug: 'mood-congruent-memory-bias',
    name: 'Mood-Congruent Memory Bias',
    scenario:
      'SaaS renewal reminder for a user who recently experienced a service outage',
    withoutBias:
      'Automated renewal email sent on schedule: "Your annual plan expires in 3 days. Renew now for $199/year."',
    withBias:
      'System detects recent support ticket about outage, delays renewal email by one week, and leads with resolution: "We fixed the sync issue you reported. Everything\'s running smoothly now. By the way, your plan renews next week."',
    whyItWorks:
      'Requesting payment while frustrated triggers recall of every past frustration; waiting for a positive mood shift ensures the renewal decision is colored by recent good experiences instead.',
    category: 'Memory',
  },
  {
    id: 8,
    slug: 'frequency-illusion',
    name: 'Frequency Illusion',
    scenario:
      'Multi-product ecosystem homepage, help center, and in-app banner for a freelance payments platform',
    withoutBias:
      'Each surface uses different value propositions — homepage says "Simple invoicing," help center says "Manage your business," in-app says "Dashboard"',
    withBias:
      'Consistent tagline "Fastest payouts for freelancers" appears in homepage hero, help center header, in-app welcome banner, and email footer — identical phrasing everywhere',
    whyItWorks:
      'Once the user notices the "fastest payouts" claim in one place, they begin spotting it everywhere, and the repetition across independent contexts makes it feel like a universally accepted truth.',
    category: 'Memory',
  },
  {
    id: 9,
    slug: 'empathy-gap',
    name: 'Empathy Gap',
    scenario: 'In-app live chat support interface responding to an angry user',
    withoutBias:
      'Bot responds to complaint with: "Please calm down and describe the issue clearly so we can assist you."',
    withBias:
      'Bot responds with: "We understand this is frustrating. Let\'s fix this together. Can you tell us what happened?" — empathetic tone, no dismissal of emotion',
    whyItWorks:
      "Support agents in a neutral state default to logic-first responses that dismiss the user's emotional reality; acknowledging the feeling first bridges the empathy gap and de-escalates.",
    category: 'Social',
  },
  {
    id: 10,
    slug: 'omission-bias',
    name: 'Omission Bias',
    scenario: 'Subscription cancellation flow',
    withoutBias: 'Direct "Cancel Subscription" link',
    withBias:
      'Multi-step cancellation (Account > Billing > Manage Plan > Cancel)',
    whyItWorks:
      'People judge harmful actions worse than equally harmful inactions. Effortful cancellation exploits this.',
    category: 'Decision',
  },
  {
    id: 11,
    slug: 'base-rate-fallacy',
    name: 'Base Rate Fallacy',
    scenario: 'App store product listing showing user reviews',
    withoutBias:
      'All reviews shown chronologically — 3 negative 1-star reviews appear at the top (most recent), followed by thousands of positive ones; overall "4.8 stars from 15,847 ratings" shown small at bottom',
    withBias:
      '"4.8 stars from 15,847 ratings" shown prominently at top with star distribution bar chart (showing 95% are 5-star), negative reviews accessible but not leading',
    whyItWorks:
      'Users fixate on vivid individual negative reviews while ignoring base rates; leading with the statistical summary forces the accurate big picture before any single anecdote can anchor perception.',
    category: 'Social',
  },
  {
    id: 12,
    slug: 'bizarreness-effect',
    name: 'Bizarreness Effect',
    scenario: 'Product card with distinctive branding',
    withoutBias: 'Standard app card (HabitFlow, Free, Productivity badge)',
    withBias:
      'Bizarre framing ("Your 8-armed accountability partner," octopus illustration)',
    whyItWorks:
      'Unusual content creates deeper memory trace. Users remember the weird one.',
    category: 'Memory',
  },
  {
    id: 13,
    slug: 'humor-effect',
    name: 'Humor Effect',
    scenario: '404 error page for a casual content platform',
    withoutBias: '"Page not found. Error 404. Return to homepage."',
    withBias:
      '"This page wandered off to find itself. While it\'s gone, here are some articles that stayed put." with playful illustration and suggested content links',
    whyItWorks:
      'Humorous content creates stronger memory traces than neutral content. In low-stakes moments, wit builds memorable brand personality and turns dead ends into engagement.',
    category: 'Memory',
  },
  {
    id: 14,
    slug: 'picture-superiority-effect',
    name: 'Picture Superiority Effect',
    scenario: 'Feature list — text vs illustrations',
    withoutBias:
      'Text descriptions ("Kanban boards for visual workflow management...")',
    withBias:
      'Short labels with SVG illustrations (kanban board, clock, people, dashboard)',
    whyItWorks:
      'Images encoded through dual channels (visual + verbal). 6x better retention than text alone.',
    category: 'Memory',
  },
  {
    id: 15,
    slug: 'von-restorff-effect',
    name: 'Von Restorff Effect',
    scenario: 'Navigation menu with one highlighted item',
    withoutBias: 'All nav items styled identically',
    withBias: '"Pricing" highlighted with "New" badge',
    whyItWorks:
      'Visually distinct item captures attention and is remembered far better.',
    category: 'Perception',
  },
  {
    id: 16,
    slug: 'self-reference-effect',
    name: 'Self-Reference Effect',
    scenario: 'Landing page targeting',
    withoutBias: '"Project management for teams of all sizes"',
    withBias:
      '"Built for freelancers who juggle 5+ clients" with segment-specific testimonial',
    whyItWorks:
      'Personally relevant content triggers "This is about me" recognition, encoding more deeply.',
    category: 'Social',
  },
  {
    id: 17,
    slug: 'negativity-bias',
    name: 'Negativity Bias',
    scenario: 'Incident notification',
    withoutBias: '"Incident Resolved. Uptime: 99.97%"',
    withBias:
      '"Maintenance Complete. Your data is safe. Here\'s what we improved..." with specifics',
    whyItWorks:
      'One negative event undoes months of positive ones. Proactive communication neutralizes disproportionate weight.',
    category: 'Social',
  },
  {
    id: 18,
    slug: 'anchoring-effect',
    name: 'Anchoring Effect',
    scenario: 'Pricing table with crossed-out original prices',
    withoutBias: 'Three plans at face value ($10, $25, $50/mo)',
    withBias:
      'Same plans with crossed-out "original" prices ($49, $99) making current prices feel like steep discounts',
    whyItWorks:
      'The first number seen dominates value judgment. Arbitrary anchor makes $25/mo feel like a bargain.',
    category: 'Decision',
  },
  {
    id: 19,
    slug: 'conservatism',
    name: 'Conservatism (belief revision)',
    scenario:
      'Project management tool onboarding for users migrating from a competitor',
    withoutBias:
      'Onboarding forces new workflow: "Forget everything you know! Our revolutionary Board-First approach changes everything. Start from scratch."',
    withBias:
      'Onboarding adapts to prior tool: "Coming from Trello? We\'ve set up your workspace with familiar boards and columns. Try our timeline view when you\'re ready — no rush."',
    whyItWorks:
      'Users cling to prior beliefs about how workflows "should" work; forcing a paradigm shift triggers resistance, while respecting existing mental models and gradually introducing new ones yields adoption.',
    category: 'Perception',
  },
  {
    id: 20,
    slug: 'contrast-effect',
    name: 'Contrast Effect',
    scenario: 'Product card flanked by extremes',
    withoutBias: 'Single mid-range product ($79 headphones)',
    withBias: 'Same product between premium ($349) and budget ($19) options',
    whyItWorks:
      'Surrounding context reshapes value perception without changing the product.',
    category: 'Decision',
  },
  {
    id: 21,
    slug: 'distinction-bias',
    name: 'Distinction Bias',
    scenario: 'Pricing plans shown together vs separately',
    withoutBias: 'Two similar plans side-by-side (Team $12, Business $14)',
    withBias:
      'Same plans requiring scrolling to compare (presented separately)',
    whyItWorks:
      'Side-by-side presentation exaggerates small differences. Separation reduces decision friction.',
    category: 'Decision',
  },
  {
    id: 22,
    slug: 'framing-effect',
    name: 'Framing Effect',
    scenario: 'System update notification',
    withoutBias: '"1% chance of data loss"',
    withBias: '"99% probability the operation will succeed"',
    whyItWorks:
      'Identical information, opposite emotional responses. Positive frame increases confidence.',
    category: 'Decision',
  },
  {
    id: 23,
    slug: 'money-illusion',
    name: 'Money Illusion',
    scenario: 'Pricing with different time units',
    withoutBias: 'Annual pricing ($120/year, $300/year, $600/year)',
    withBias:
      'Daily pricing ($0.33/day, $0.82/day "Less than a coffee," $1.64/day)',
    whyItWorks:
      'People focus on face value. $0.82/day feels trivial, $300/year feels expensive. Same cost.',
    category: 'Decision',
  },
  {
    id: 24,
    slug: 'weber-fechner-law',
    name: 'Weber-Fechner Law',
    scenario: 'Discount presentation',
    withoutBias: 'Same absolute discount ($5 off) on $25 and $500 items',
    withBias: 'Proportional framing (20% OFF on $25 item, 1% off on $500 item)',
    whyItWorks:
      'Perceived significance is proportional to base. Scale discounts to maintain psychological impact.',
    category: 'Decision',
  },
  {
    id: 25,
    slug: 'confirmation-bias',
    name: 'Confirmation Bias',
    scenario: 'Account security dashboard for an anonymous marketplace',
    withoutBias:
      'Generic settings page: "Security Settings" with password change and 2FA toggle, no proactive trust signals',
    withBias:
      '"Your Security Status: Protected" banner with real-time indicators (end-to-end encryption active, 0 data breaches, anonymous ID verified), plus a "Transparency Report" link and recent security audit date',
    whyItWorks:
      'Skeptical users actively look for evidence the platform is unsafe; surfacing continuous proof of security intercepts their search and converts confirming evidence from "this is sketchy" to "this is legitimate."',
    category: 'Perception',
  },
  {
    id: 27,
    slug: 'post-purchase-rationalization',
    name: 'Post-Purchase Rationalization',
    scenario: 'Order confirmation email for a $149 ergonomic keyboard',
    withoutBias:
      'Plain transactional email: "Order #4821 confirmed. Estimated delivery: March 28. Track your order."',
    withBias:
      'Branded email: "Great choice! The MechPro X is rated #1 by 12,000+ developers. Your serial number: MP-2024-8841 (Limited Edition). Here\'s a setup guide to get the most out of your new keyboard." with product beauty shot and customer quote',
    whyItWorks:
      'Immediately after purchase, buyers are most vulnerable to doubt; reinforcing the quality of their decision with social proof, exclusivity cues, and actionable next steps gives them ammunition to rationalize the expense.',
    category: 'Memory',
  },
  {
    id: 28,
    slug: 'selective-perception',
    name: 'Selective Perception',
    scenario: 'Rich text editor toolbar layout',
    withoutBias:
      'Unconventional toolbar: bold/italic buried in a "More" dropdown, font color on the main bar, "Insert Table" as the first icon, alignment controls scattered',
    withBias:
      'Conventional toolbar following market standards: Bold (B), Italic (I), Underline (U) as first three icons, followed by alignment, then lists, then advanced features in dropdowns',
    whyItWorks:
      "Users have formed expectations from years of using Word/Google Docs; unconventional placement makes standard features feel missing even when they're present.",
    category: 'Perception',
  },
  {
    id: 30,
    slug: 'ostrich-effect',
    name: 'Ostrich Effect',
    scenario: 'Financial dashboard',
    withoutBias:
      'Raw negative data (Credit Utilization 78%, budget overage alert)',
    withBias:
      'Euphemistic labels ("On Track," "Optimization Opportunity," collapsed Credit Details)',
    whyItWorks:
      'People avoid uncomfortable information. Masking anxiety with softer labels keeps users engaged.',
    category: 'Social',
  },
  {
    id: 31,
    slug: 'subjective-validation',
    name: 'Subjective Validation',
    scenario:
      'Environmental non-profit registration form with pre-ticked preference',
    withoutBias:
      'Standard registration: name, email, password, "Create Account" button — no values elicitation',
    withBias:
      'Registration includes a pre-checked checkbox: "I want to help protect the environment." After signup, confirmation says "Welcome, fellow Earth Guardian!" Two weeks later, a donation ask arrives referencing their stated value',
    whyItWorks:
      'The checkbox creates a self-attributed belief ("I\'m someone who cares"); subjective validation makes the user interpret the later donation request as consistent with who they are.',
    category: 'Social',
  },
  {
    id: 32,
    slug: 'continued-influence-effect',
    name: 'Continued Influence Effect',
    scenario: 'Health & wellness app updating its hydration recommendation',
    withoutBias:
      'App previously showed "Drink 8 glasses of water daily" for two years. Updated overnight to "Drink based on thirst and activity level" with no explanation',
    withBias:
      'Update screen: "What changed: The \'8 glasses\' rule was a common belief, but recent research shows hydration needs vary. Here\'s why we updated..." with before/after comparison and a "Learn More" link',
    whyItWorks:
      'Simply correcting old information fails because the original claim persists in memory; explicitly acknowledging what users previously believed and explaining why it changed weakens the continued influence.',
    category: 'Memory',
  },
  {
    id: 34,
    slug: 'clustering-illusion',
    name: 'Clustering Illusion',
    scenario: 'Wellness app push notification schedule',
    withoutBias:
      'Notifications sent at fixed daily schedule (9:00 AM every day): "Time for your daily check-in!" — predictable, easy to ignore/dismiss',
    withBias:
      'Notifications sent at random intervals (36-55 hours apart) with varied messages: "This is a good moment to pause for a few mindful breaths," "Quick check-in: how are you feeling right now?" — no fixed schedule',
    whyItWorks:
      'Users perceive random notifications as meaningfully timed ("it always knows when I need it!"), attributing a caring pattern to what is actually random spacing.',
    category: 'Memory',
  },
  {
    id: 35,
    slug: 'insensitivity-to-sample-size',
    name: 'Insensitivity to Sample Size',
    scenario: 'Product comparison page showing user ratings',
    withoutBias:
      'Product A shows "4.9 stars" (from 3 reviews) next to Product B showing "4.6 stars" (from 8,412 reviews) — both displayed identically',
    withBias:
      'Product A shows "4.9 stars (3 reviews) — Not enough data" with muted display, Product B shows "4.6 stars (8,412 reviews) — Verified" with full prominence and a confidence indicator',
    whyItWorks:
      'Users instinctively trust 4.9 over 4.6 without considering that 3 reviews could easily be anomalous; surfacing sample size and confidence indicators counteracts the bias.',
    category: 'Social',
  },
  {
    id: 36,
    slug: 'neglect-of-probability',
    name: 'Neglect of Probability',
    scenario: 'Backup reminder',
    withoutBias: '"Probability of data loss is approximately 0.01%"',
    withBias:
      '"Your last backup was 571 days ago" with social comparison stats',
    whyItWorks:
      'People ignore probabilities, respond to emotional severity. Remove the number, show consequences.',
    category: 'Decision',
  },
  {
    id: 37,
    slug: 'anecdotal-evidence',
    name: 'Anecdotal Evidence',
    scenario: 'Product testimonial section on landing page',
    withoutBias:
      'Aggregate data only: "98% satisfaction rate across 12,000 customers" with a bar chart',
    withBias:
      'Single detailed story: "Sarah, freelance designer: \'I was drowning in invoices until I found this tool. Saved me 10 hours last week alone.\'" with photo and company logo',
    whyItWorks:
      'A single vivid personal story is more persuasive than aggregate statistics. People connect with narratives, not numbers.',
    category: 'Social',
  },
  {
    id: 39,
    slug: 'recency-illusion',
    name: 'Recency Illusion',
    scenario: 'Feature announcement banner in a SaaS app',
    withoutBias:
      'Sidebar shows existing feature "Advanced Filters" with no special treatment — available for 2 years',
    withBias:
      'Same feature repackaged: "NEW: Smart Filters — powered by AI" with a "Just launched" badge, blog post link, and spotlight animation on first visit',
    whyItWorks:
      'Users perceive recently noticed things as genuinely new. Repackaging existing features with fresh branding triggers discovery and adoption even when nothing changed.',
    category: 'Perception',
  },
  {
    id: 40,
    slug: 'gamblers-fallacy',
    name: "Gambler's Fallacy",
    scenario: 'Loot box / mystery reward screen in a mobile game',
    withoutBias: '"Open Mystery Box — $1.99" with no additional context',
    withBias:
      '"You\'ve opened 7 boxes without a Legendary item. Players who opened 8+ boxes often hit the jackpot!" with a glowing progress bar approaching a gold threshold',
    whyItWorks:
      'Players believe a win is "due" after a losing streak. Showing the streak length exploits the false sense that probability accumulates.',
    category: 'Decision',
  },
  {
    id: 41,
    slug: 'hot-hand-fallacy',
    name: 'Hot Hand Fallacy',
    scenario: 'Competitive multiplayer game leaderboard during a win streak',
    withoutBias: 'Plain score display: "Current rank: #47. Wins today: 8"',
    withBias:
      '"8 WINS IN A ROW! You\'re on fire! Next match: Double XP bonus for streak players." with flame animations intensifying each win',
    whyItWorks:
      'Visual indicators of past success make players feel future success is more likely despite independence. Streak visualization sustains engagement through false momentum.',
    category: 'Social',
  },
  {
    id: 42,
    slug: 'illusory-correlation',
    name: 'Illusory Correlation',
    scenario: 'SaaS marketing landing page with brand association',
    withoutBias:
      'Homepage shows product features with company logo only: "Project management for modern teams"',
    withBias:
      '"Trusted alongside teams at Google, Stripe, and NASA" with those logos displayed prominently next to the product logo',
    whyItWorks:
      'Users perceive a relationship between the product and prestigious brands simply from co-presence on the page, even with no real partnership.',
    category: 'Perception',
  },
  {
    id: 43,
    slug: 'group-attribution-error',
    name: 'Group Attribution Error',
    scenario: 'Social app group creation flow',
    withoutBias:
      '"Create Group" form with just a name field and member invite list',
    withBias:
      '"Create Group" form with mandatory "Group Mission" field, shared values tagline, and auto-generated group identity badge ("The Innovators — 12 members strong")',
    whyItWorks:
      'A declared group identity makes members assume shared traits, strengthening cohesion and engagement through perceived collective character.',
    category: 'Social',
  },
  {
    id: 44,
    slug: 'fundamental-attribution-error',
    name: 'Fundamental Attribution Error',
    scenario: 'B2B SaaS customer success email',
    withoutBias:
      '"Your team completed 47 projects this quarter using ProjectFlow."',
    withBias:
      '"Your team\'s expertise drove 47 completed projects this quarter. Your strategic planning made the difference — here\'s your success report."',
    whyItWorks:
      "People attribute success to personal skill, not circumstance. Crediting the user's abilities (not your tool) strengthens loyalty and satisfaction.",
    category: 'Social',
  },
  {
    id: 46,
    slug: 'functional-fixedness',
    name: 'Functional Fixedness',
    scenario: 'Web app toolbar menu with underused tools',
    withoutBias:
      'A "Tools" button opens a dropdown with 4 items. Analytics show 97% of clicks go to "Export" — users never notice the other 3 tools',
    withBias:
      '"Export" promoted to a standalone button on the toolbar. Remaining 3 tools reorganized into a new "Power Tools" section with fresh icons and introductory tooltips',
    whyItWorks:
      'Users fixate on one function for a familiar control. Breaking the spatial association forces re-evaluation and drives discovery of overlooked features.',
    category: 'Perception',
  },
  {
    id: 47,
    slug: 'just-world-fallacy',
    name: 'Just-World Fallacy',
    scenario: 'Company pricing change announcement page',
    withoutBias:
      '"Starting March 1, pricing will increase by 15%. See new pricing below."',
    withBias:
      '"To continue investing in security, accessibility, and fair wages for our team, we\'re adjusting pricing by 15%. Here\'s exactly where your money goes:" followed by a transparent cost breakdown with a "Fairness Commitment" badge',
    whyItWorks:
      'People believe good actions deserve good outcomes. Framing a price increase as a just, moral decision makes users accept it as deserved and fair.',
    category: 'Decision',
  },
  {
    id: 48,
    slug: 'authority-bias',
    name: 'Authority Bias',
    scenario: 'Medical app treatment recommendation screen',
    withoutBias:
      '"Recommended: 30 minutes of daily walking" — plain text suggestion',
    withBias:
      '"Dr. Sarah Chen, MD — Johns Hopkins Cardiology" with photo and credentials, followed by the same recommendation in a quote card with a verification badge',
    whyItWorks:
      'People defer to authority figures. Attaching expert identity and credentials to the same advice dramatically increases compliance.',
    category: 'Social',
  },
  {
    id: 49,
    slug: 'automation-bias',
    name: 'Automation Bias',
    scenario: 'Code review tool automated suggestion panel',
    withoutBias:
      'AI suggestion shown as: "Suggestion: Refactor this function" with equal visual weight to manual review comments',
    withBias:
      'AI suggestion shown with a prominent "AI Verified" shield badge, green checkmark, confidence score "98.7% correct", displayed above manual comments in a highlighted card',
    whyItWorks:
      'Users over-trust automated systems with confidence indicators. The visual authority of the AI badge discourages users from critically evaluating the suggestion.',
    category: 'Perception',
  },
  {
    id: 50,
    slug: 'bandwagon-effect',
    name: 'Bandwagon Effect',
    scenario: 'Product card with social proof',
    withoutBias: 'Basic product info (name, price, rating)',
    withBias: 'Added "Trending #1," peer purchase signals, 12,847 ratings',
    whyItWorks:
      'Social proof indicators reduce perceived risk — if thousands chose it, it must be good.',
    category: 'Social',
  },
  {
    id: 51,
    slug: 'placebo',
    name: 'Placebo',
    scenario: "Internet speed troubleshooter in an ISP's customer portal",
    withoutBias:
      '"We\'re aware of intermittent slowdowns in your area. No action needed."',
    withBias:
      '"Run Network Optimizer" button that triggers an animated progress bar ("Scanning routes... Optimizing DNS... Clearing cache...") and ends with "Connection optimized! Speed improved by up to 12%" — even though no real change occurred',
    whyItWorks:
      'Giving users a visible action to perform creates perceived improvement. The ritual of "fixing" something satisfies the need for control, reducing complaints.',
    category: 'Perception',
  },
  {
    id: 53,
    slug: 'in-group-favoritism',
    name: 'In-Group Favoritism',
    scenario: 'Social media content feed algorithm',
    withoutBias:
      'Chronological feed showing all posts equally — news, opinions, memes from all connections',
    withBias:
      'Feed prioritized by in-group signals: posts from users with matching profile badges ("Fellow Designer"), shared group memberships, and similar engagement history boosted to top with "From your community" labels',
    whyItWorks:
      'Users engage more with content from perceived in-group members. Surfacing tribal affinity signals increases time-on-feed and interaction rates.',
    category: 'Social',
  },
  {
    id: 54,
    slug: 'halo-effect',
    name: 'Halo Effect',
    scenario: 'App store listing page',
    withoutBias:
      'App listing with functional screenshots, bullet-point features, 4.2-star rating, plain icon',
    withBias:
      'Polished listing with cinematic preview video, custom-illustrated hero image, designer icon with gradient, "Editor\'s Choice" badge, and Apple Design Award mention',
    whyItWorks:
      'A visually stunning first impression makes users assume the underlying product quality matches. Beautiful design halos over to perceived reliability and performance.',
    category: 'Perception',
  },
  {
    id: 55,
    slug: 'positivity-effect',
    name: 'Positivity Effect',
    scenario: 'Team collaboration tool reaction system',
    withoutBias:
      'Comment section with only text replies — no quick reactions available',
    withBias:
      'Comment section with one-click positive reaction buttons (clap, heart, fire, rocket, "Great idea!") prominently displayed, with a subtle "Reply" text link for longer responses',
    whyItWorks:
      'Users gravitate toward sharing positive emotions when given easy tools to do so. Low-friction positivity features increase engagement and platform attachment.',
    category: 'Social',
  },
  {
    id: 57,
    slug: 'mental-accounting',
    name: 'Mental Accounting',
    scenario: 'Subscription charge breakdown',
    withoutBias: 'Single line "$29/mo"',
    withBias:
      'Decomposed into four value categories ($12 tools + $8 storage + $5 support + $4 learning)',
    whyItWorks:
      'Each sub-charge evaluated against its own mental budget. Total feels more justifiable.',
    category: 'Decision',
  },
  {
    id: 58,
    slug: 'normality-bias',
    name: 'Normality Bias',
    scenario: 'Stock trading app with automatic stop-loss prompt',
    withoutBias:
      'Portfolio view showing stock positions with current prices and percentage changes — no alerts for unusual drops',
    withBias:
      'When a stock drops 15% in a day, a prominent warning banner appears: "Unusual activity detected. Set a stop-loss limit?" with one-click threshold options and "Auto-protect" toggle',
    whyItWorks:
      'Users assume things will continue normally and ignore warning signs. Proactive intervention mechanisms override the default assumption that "it\'ll bounce back."',
    category: 'Decision',
  },
  {
    id: 61,
    slug: 'millers-law',
    name: "Miller's Law",
    scenario: 'Settings panel navigation',
    withoutBias: '16 undifferentiated links',
    withBias: 'Same 16 items grouped into 4 labeled sections of 4 items each',
    whyItWorks:
      'Working memory holds 7 plus/minus 2 items. Chunking reduces cognitive overload.',
    category: 'Perception',
  },
  {
    id: 62,
    slug: 'illusion-of-transparency',
    name: 'Illusion of Transparency',
    scenario: 'Tooltip and help text on a complex API configuration form',
    withoutBias:
      'Terse labels: "Webhook URL," "Auth Token," "Retry Policy" — no additional explanation',
    withBias:
      'Contextual help icons on each field. Hovering reveals plain-language tooltips: "Where should we send event notifications? Paste your server\'s URL here." Plus a "Not sure? See setup guide" link',
    whyItWorks:
      'Creators overestimate how obvious their interface is. Adding explicit explanations for what seems self-evident dramatically reduces support tickets and user confusion.',
    category: 'Perception',
  },
  {
    id: 63,
    slug: 'curse-of-knowledge',
    name: 'Curse of Knowledge',
    scenario: 'Developer tool onboarding walkthrough',
    withoutBias:
      'First-run screen: "Configure your CI/CD pipeline using YAML. Set build triggers and deployment targets." — assumes familiarity with terminology',
    withBias:
      'Step-by-step wizard with "What do you want to automate?" (plain language options: "Test my code," "Deploy to production," "Both"), visual pipeline builder, jargon-free labels with expandable "What does this mean?" sections',
    whyItWorks:
      "Experts forget what it's like not to know. Replacing jargon with guided choices prevents the team's expertise from becoming a barrier to new user adoption.",
    category: 'Social',
  },
  {
    id: 64,
    slug: 'spotlight-effect',
    name: 'Spotlight Effect',
    scenario: 'Content sharing prompt',
    withoutBias: '"All 5,000 members will see your post"',
    withBias:
      '"Posts typically get 8-15 views. You can edit or remove anytime."',
    whyItWorks:
      "People overestimate others' attention. Realistic expectations reduce social anxiety.",
    category: 'Social',
  },
  {
    id: 66,
    slug: 'hindsight-bias',
    name: 'Hindsight Bias',
    scenario: 'Incident postmortem page in a monitoring tool',
    withoutBias:
      'After a server outage: "Outage resolved. Root cause: database connection pool exhaustion." No additional context',
    withBias:
      'Timeline view showing all pre-incident signals with timestamps: "These 4 alerts occurred before the outage. At the time, none exceeded warning thresholds." Includes a "What we\'re adding" section with new safeguards',
    whyItWorks:
      'After a failure, users believe warning signs were obvious. Showing that pre-incident data was ambiguous in real-time prevents blame and builds trust in proactive improvements.',
    category: 'Memory',
  },
  {
    id: 70,
    slug: 'social-desirability-bias',
    name: 'Social Desirability Bias',
    scenario: 'In-app user survey / feedback form',
    withoutBias:
      '"How satisfied are you with our product?" with 1-5 star rating — user\'s name and avatar visible on the form',
    withBias:
      '"Anonymous feedback" badge prominently displayed, question reframed as "What\'s ONE thing that frustrates you most?" with pre-written options and an anonymous text field. No user identity shown',
    whyItWorks:
      'People give socially desirable answers when identifiable. Anonymity plus negatively-framed questions give users permission to be honest, producing actionable data.',
    category: 'Social',
  },
  {
    id: 71,
    slug: 'third-person-effect',
    name: 'Third-Person Effect',
    scenario: 'SaaS marketing email for power users',
    withoutBias:
      'Aggressive promotional email: "AMAZING deal! Don\'t miss out! Everyone is switching!"',
    withBias:
      'Understated, data-driven email: "Here\'s what changed in v4.2 and how it affects your workflow" with usage stats and a subtle CTA',
    whyItWorks:
      'Sophisticated users believe they are immune to persuasion, so overt marketing triggers skepticism — a restrained, informational tone bypasses their defenses.',
    category: 'Social',
  },
  {
    id: 73,
    slug: 'hard-easy-effect',
    name: 'Hard-Easy Effect',
    scenario: 'Multi-step tax calculator form in a fintech app',
    withoutBias:
      'Single dense page with 14 fields, dropdowns, and conditional logic all visible at once',
    withBias:
      'Same calculator broken into 4 guided steps with progress bar, contextual help tooltips, and smart defaults pre-filled',
    whyItWorks:
      'Teams overestimate how easy complex interfaces are for users. Decomposing difficulty into small steps prevents the user confusion that designers underestimate.',
    category: 'Decision',
  },
  {
    id: 74,
    slug: 'dunning-kruger-effect',
    name: 'Dunning-Kruger Effect',
    scenario: 'Workflow optimization suggestions in a CRM tool',
    withoutBias:
      'User manually exports contacts to CSV, edits in Excel, re-imports — repeating this daily without complaint',
    withBias:
      'Contextual tooltip appears after detecting repeated export/import: "Did you know? You can bulk-edit contacts directly. See how (saves ~20 min/day)"',
    whyItWorks:
      "Users with low feature awareness don't know what they're missing. Proactive suggestions surface better methods that users would never seek on their own.",
    category: 'Perception',
  },
  {
    id: 75,
    slug: 'barnum-effect',
    name: 'Barnum Effect',
    scenario: 'Assessment results notification',
    withoutBias:
      'Generic score (78/100, areas: communication, time management)',
    withBias:
      'Personalized-sounding statements ("you value efficiency," "others rely on your judgment")',
    whyItWorks:
      'People accept vague flattering statements as uniquely applicable to themselves.',
    category: 'Memory',
  },
  {
    id: 76,
    slug: 'illusion-of-control',
    name: 'Illusion of Control',
    scenario: 'Feature voting poll',
    withoutBias: 'Upcoming features listed as "Coming in Q3"',
    withBias:
      'Interactive voting with existing vote counts, "Your vote matters!" banner',
    whyItWorks:
      'Sense of influence creates ownership. Users who vote feel connected to the release.',
    category: 'Perception',
  },
  {
    id: 77,
    slug: 'illusory-superiority',
    name: 'Illusory Superiority',
    scenario: 'Fitness app post-workout summary screen',
    withoutBias: '"Workout complete. 32 minutes, 280 calories burned."',
    withBias:
      '"You crushed it! You burned more than 74% of users today. Top performer streak: 3 days running." with comparative chart',
    whyItWorks:
      'People overestimate their own abilities and welcome confirmation. Comparative flattery reinforces their inflated self-image, boosting retention.',
    category: 'Social',
  },
  {
    id: 78,
    slug: 'risk-compensation',
    name: 'Risk Compensation',
    scenario:
      'Admin panel for a cloud infrastructure tool with auto-backup enabled',
    withoutBias:
      '"Auto-backup is ON. Your data is fully protected." (user skips reading change warnings, bulk-deletes records carelessly)',
    withBias:
      '"Auto-backup is ON. Review: you are about to delete 1,204 records. Restoring from backup takes up to 4 hours. Proceed?"',
    whyItWorks:
      'Safety features make users reckless. Surfacing real consequences of errors counteracts the false sense of invulnerability that automated protections create.',
    category: 'Decision',
  },
  {
    id: 79,
    slug: 'hyperbolic-discounting',
    name: 'Hyperbolic Discounting',
    scenario: 'Annual billing upgrade prompt',
    withoutBias: '"Save 20% with Annual Billing" ($48/year savings)',
    withBias: '"Get Your First Month FREE" with countdown timer',
    whyItWorks:
      'Immediate rewards valued more than larger delayed ones. "Free now" beats "save later."',
    category: 'Decision',
  },
  {
    id: 80,
    slug: 'appeal-to-novelty',
    name: 'Appeal to Novelty',
    scenario: 'SaaS feature announcement banner within the app',
    withoutBias: '"Report Builder has been updated. View changelog."',
    withBias:
      '"NEW: Next-Gen Report Builder — completely reimagined with AI-powered insights. Try the future of reporting."',
    whyItWorks:
      'People equate "new" with "better." Emphasizing novelty makes the same improvement feel like a breakthrough worth trying immediately.',
    category: 'Perception',
  },
  {
    id: 81,
    slug: 'escalation-of-commitment',
    name: 'Escalation of Commitment',
    scenario:
      'Online course platform showing learning investment on the "considering cancel" screen',
    withoutBias: '"Cancel enrollment? You can re-enroll anytime."',
    withBias:
      '"You\'ve invested 14 hours and completed 6 of 10 modules. You\'re 60% there. Keep going?" with progress visualization',
    whyItWorks:
      'Showing accumulated investment makes abandonment feel wasteful. Users continue not because the course is valuable, but because quitting means "wasting" what they already put in.',
    category: 'Social',
  },
  {
    id: 82,
    slug: 'generation-effect',
    name: 'Generation Effect',
    scenario: 'Language learning app vocabulary review',
    withoutBias:
      'Flashcard shows the word and its translation together: "Hund = Dog"',
    withBias:
      'Flashcard shows "H___" with context sentence "Der ___ bellt laut" and user must type the answer',
    whyItWorks:
      'Self-generated answers create stronger memory traces than passively reading. Forcing recall instead of recognition dramatically improves retention.',
    category: 'Memory',
  },
  {
    id: 83,
    slug: 'loss-aversion',
    name: 'Loss Aversion',
    scenario: 'Free trial countdown',
    withoutBias: '"Upgrade to Pro for $15/mo" listing gains',
    withBias:
      '"You will lose: 12.4 GB used storage, 6 saved dashboards, 3 months analytics history"',
    whyItWorks:
      'Pain of losing is 2x the pleasure of gaining. Loss framing creates urgency.',
    category: 'Decision',
  },
  {
    id: 84,
    slug: 'ikea-effect',
    name: 'IKEA Effect',
    scenario: 'Website builder with template customization',
    withoutBias:
      'Pre-built template gallery: "Pick a template. We\'ll set it up for you."',
    withBias:
      'Step-by-step builder: "Choose your colors > Arrange your sections > Name your site" — then shows "Your custom creation" with a preview',
    whyItWorks:
      'Users who invest effort in creating something value the result disproportionately. The customization steps transform a generic template into "my website."',
    category: 'Social',
  },
  {
    id: 85,
    slug: 'unit-bias',
    name: 'Unit Bias',
    scenario: 'Task list pagination',
    withoutBias: 'Single list of 36 pending requests',
    withBias: '6 per page with progress indicator (0 of 36)',
    whyItWorks:
      'Completable units sustain engagement. 6 feels achievable, 36 feels insurmountable.',
    category: 'Memory',
  },
  {
    id: 86,
    slug: 'zero-risk-bias',
    name: 'Zero-Risk Bias',
    scenario: 'Checkout with guarantee badges',
    withoutBias: 'Standard return policy mentioned in payment section',
    withBias:
      'Multiple risk-elimination badges (30-day guarantee, free returns, SSL, "100% risk-free")',
    whyItWorks:
      'People prefer eliminating small risk entirely over reducing larger risk more. Zero-risk framing is psychologically powerful.',
    category: 'Decision',
  },
  {
    id: 87,
    slug: 'processing-difficulty-effect',
    name: 'Processing Difficulty Effect',
    scenario: 'Destructive action confirmation',
    withoutBias: 'Generic "Are you sure?" with Yes button',
    withBias:
      'Shows impact (847 files, 23 collaborators), requires typing "DELETE" to confirm',
    whyItWorks:
      'Cognitive effort creates stronger memory trace. Forces deep engagement with consequences.',
    category: 'Decision',
  },
  {
    id: 88,
    slug: 'endowment-effect',
    name: 'Endowment Effect',
    scenario: 'Dashboard layout update notification',
    withoutBias: '"New layout applied next week, old layout removed"',
    withBias:
      "Acknowledges user's customizations (4 widgets, 2 filters, custom theme), offers preview",
    whyItWorks:
      'People overvalue what they possess. Respecting ownership leads to higher adoption.',
    category: 'Memory',
  },
  {
    id: 89,
    slug: 'backfire-effect',
    name: 'Backfire Effect',
    scenario: 'Customer support chat response to a billing dispute',
    withoutBias:
      '"Our records show you were charged correctly. Here is the invoice proving the charge is valid. The Terms of Service section 4.2 states..."',
    withBias:
      '"I understand this charge was unexpected. Let me walk you through your account activity together — and if anything looks off, we\'ll fix it right away."',
    whyItWorks:
      "Directly contradicting a user's belief with evidence triggers defensive doubling-down. Collaborative exploration defuses resistance and opens them to the correct information.",
    category: 'Memory',
  },
  {
    id: 90,
    slug: 'system-justification',
    name: 'System Justification',
    scenario: 'Company blog post during a controversial public event',
    withoutBias:
      'Blog post takes a strong public stance on a divisive social issue, urging users to "join the movement"',
    withBias:
      'Blog post stays focused on product updates and value delivery, with neutral, business-oriented language',
    whyItWorks:
      'Users defend the status quo as a source of stability. Brand messaging that challenges their existing worldview triggers discomfort and disengagement rather than loyalty.',
    category: 'Social',
  },
  {
    id: 91,
    slug: 'reactance',
    name: 'Reactance',
    scenario: 'Upgrade upsell prompt',
    withoutBias: 'Forced popup "You MUST upgrade to continue"',
    withBias:
      'Low-pressure banner with explicit opt-out ("Free to continue, no pressure")',
    whyItWorks:
      'Restricted freedom triggers pushback. Acknowledging choice increases conversion.',
    category: 'Social',
  },
  {
    id: 92,
    slug: 'decoy-effect',
    name: 'Decoy Effect',
    scenario: 'Pricing table with asymmetrically dominated option',
    withoutBias: 'Two plans (Basic $8, Premium $24)',
    withBias: 'Added decoy Plus plan ($22, fewer features than Premium)',
    whyItWorks:
      'Decoy makes Premium look like outstanding value through asymmetric dominance.',
    category: 'Decision',
  },
  {
    id: 93,
    slug: 'ambiguity-effect',
    name: 'Ambiguity Effect',
    scenario: 'Pricing table with vague vs specific features',
    withoutBias: 'Vague features ("Storage and support," "more features")',
    withBias:
      'Specific, quantified guarantees ("50 GB storage," "99.9% uptime")',
    whyItWorks:
      'People avoid options with unknown probabilities. Quantified benefits eliminate ambiguity.',
    category: 'Decision',
  },
  {
    id: 94,
    slug: 'information-bias',
    name: 'Information Bias',
    scenario: 'E-commerce product comparison tool',
    withoutBias:
      'Product page shows 6 key specs, price, and rating — enough to decide. "Buy Now" button prominent',
    withBias:
      'Product page adds "Compare with 12 similar products," expandable 40-row spec table, "Download full datasheet (PDF)," and "See 200+ reviews" — burying the purchase action under layers of data',
    whyItWorks:
      'More information feels useful but delays decisions. Users who keep comparing rarely convert — streamlined, sufficient data drives action better than exhaustive data.',
    category: 'Decision',
  },
  {
    id: 96,
    slug: 'conjunction-fallacy',
    name: 'Conjunction Fallacy',
    scenario: '"About the Team" section on a B2B SaaS website',
    withoutBias:
      'Simple list: "John — CTO. Maria — Lead Engineer. Alex — Designer."',
    withBias:
      'Rich bios: "John — CTO, MIT CS graduate, ex-Google, 3x startup founder, published AI researcher. Maria — Lead Engineer, AWS certified, built systems handling 10M+ requests/day."',
    whyItWorks:
      'Detailed, coherent narratives feel more credible than sparse facts, even though each added detail technically makes the conjunction less probable. Users equate story richness with trustworthiness.',
    category: 'Social',
  },
  {
    id: 97,
    slug: 'less-is-better-effect',
    name: 'Less-Is-Better Effect',
    scenario: 'Upgrade bonus notification',
    withoutBias: '"10 free days of full access to all features"',
    withBias: '"20 free In-Mail credits ($40 value)"',
    whyItWorks:
      'Smaller, specific offer feels more valuable than larger, diffuse one. Quality-to-quantity ratio matters.',
    category: 'Decision',
  },
  {
    id: 99,
    slug: 'prejudice',
    name: 'Prejudice',
    scenario: 'E-commerce checkout page localized for different markets',
    withoutBias:
      'Same design globally: white background, green "Complete Purchase" button, order number #1304',
    withBias:
      'Japan version uses soft warm tones (white avoided as primary due to mourning associations), green CTA kept (positive across cultures), order number skips #4 and #13 (unlucky numbers in East Asian and Western cultures)',
    whyItWorks:
      'Cultural prejudices shape unconscious reactions to colors, numbers, and symbols. Localizing for known biases prevents unintended negative associations that suppress conversion.',
    category: 'Perception',
  },
  {
    id: 100,
    slug: 'fading-affect-bias',
    name: 'Fading Affect Bias',
    scenario: 'App status page after a service outage',
    withoutBias:
      'Outage incident remains pinned at the top of the status page indefinitely with red "Major Outage" banner',
    withBias:
      'After resolution, incident is moved to history within 48 hours. Status page leads with "All Systems Operational" and a green banner. Recent improvements section highlights 3 new reliability features shipped since the incident',
    whyItWorks:
      'Negative emotions from bad experiences fade faster than positive ones. Quickly replacing the outage narrative with operational confidence accelerates the natural fading of negative affect.',
    category: 'Memory',
  },
  {
    id: 101,
    slug: 'peak-end-rule',
    name: 'Peak-End Rule',
    scenario: 'Checkout confirmation page',
    withoutBias: '"Order placed. You will receive an email."',
    withBias:
      'Delivery estimate, personal note, 10% discount code, trust badges',
    whyItWorks:
      'Memory weighs peak and ending disproportionately. Rewarding final step improves recall of entire experience.',
    category: 'Memory',
  },
  {
    id: 102,
    slug: 'serial-recall',
    name: 'Serial Recall',
    scenario: 'Multi-step onboarding wizard for a project management tool',
    withoutBias:
      'Steps in arbitrary order: "Invite team > Set your role > Name your project > Connect integrations"',
    withBias:
      'Steps in natural causal sequence: "Name your project > Set your role > Invite team > Connect integrations" with numbered progress bar',
    whyItWorks:
      'People recall sequences better when the order matches logical cause-and-effect. A coherent step order reduces cognitive friction and helps users remember and repeat the workflow.',
    category: 'Memory',
  },
  {
    id: 103,
    slug: 'list-length-effect',
    name: 'List-Length Effect',
    scenario: 'Pricing table with feature counts',
    withoutBias: 'Five plans with 8-12 features each',
    withBias:
      'Three plans with 3-5 key features each, "Compare all features" link',
    whyItWorks:
      'As list length increases, recall drops. Fewer options with fewer bullets increase conversion.',
    category: 'Decision',
  },
  {
    id: 104,
    slug: 'primacy-effect',
    name: 'Primacy Effect',
    scenario: 'Onboarding welcome screen',
    withoutBias: 'Generic "Welcome to TaskFlow" with feature list',
    withBias:
      'Personalized "Welcome, Sarah. You\'re about to save 5 hours every week."',
    whyItWorks:
      'First impression anchors entire perception. Onboarding deserves disproportionate design attention.',
    category: 'Memory',
  },
  {
    id: 105,
    slug: 'serial-position-effect',
    name: 'Serial-Position Effect',
    scenario: 'Release notes ordering',
    withoutBias:
      'Neutral order (bug fixes first, features mixed, price increase visible)',
    withBias: 'Best news first and last, price increase buried in middle',
    whyItWorks:
      'First and last items recalled best. Bury bad news in the center.',
    category: 'Memory',
  },
  {
    id: 26,
    slug: 'congruence-bias',
    name: 'Congruence Bias',
    scenario: 'A/B test setup for a CTA color hypothesis',
    withoutBias:
      'Two variants only — current grey vs. predicted-winner green. B wins by 3%; team ships, treats hypothesis as confirmed.',
    withBias:
      'Four variants including a "should-lose" red and a "no-CTA" control. Red unexpectedly wins, revealing the real driver was placement, not color.',
    whyItWorks:
      'A test designed only to confirm cannot disprove. Adding variants that should fail under your hypothesis exposes whether you understood the system or just guessed lucky.',
    category: 'Decision',
  },
  {
    id: 29,
    slug: 'observer-expectancy-effect',
    name: 'Observer-Expectancy Effect',
    scenario: 'User interview script for a redesigned dashboard',
    withoutBias:
      'Leading prompts: "Wasn\'t the new dashboard so much faster?" Every participant agrees; team ships with confidence; churn spikes.',
    withBias:
      'Open prompts: "Walk me through what you did." 4 of 6 stumble on a flow no one had reported because earlier questions never asked.',
    whyItWorks:
      "Yes/no and leading framings give the participant the answer. Open, behavior-anchored prompts reveal what people actually do, not what they'll politely confirm.",
    category: 'Perception',
  },
  {
    id: 33,
    slug: 'bias-blind-spot',
    name: 'Bias Blind Spot',
    scenario: 'Hiring panel reviewing a senior candidate',
    withoutBias:
      'Free-form feedback: "Strong gut feeling. Reminds me of Jordan from platform — that worked out." 4.5/5 score with no anchored evidence.',
    withBias:
      'Structured rubric: each criterion has a score, evidence from the loop, and a mandatory "name one specific reason this candidate might fail" prompt.',
    whyItWorks:
      "You can't introspect your own bias. Forcing evidence per criterion and an explicit counter-prompt removes the room where bias hides — vague impressions.",
    category: 'Decision',
  },
  {
    id: 38,
    slug: 'illusion-of-validity',
    name: 'Illusion of Validity',
    scenario: 'Quarterly forecast presented to leadership',
    withoutBias:
      '"87% activation, high confidence" displayed as a single bold number. Sample size n=12 is buried.',
    withBias:
      '"Plausible range 34–91%, n=12" with explicit interval and a warning to delay locking the roadmap until n=200.',
    whyItWorks:
      'A single number from a tiny sample looks decisive but hides huge uncertainty. Forcing a range exposes the spread and prevents premature commitment.',
    category: 'Decision',
  },
  {
    id: 45,
    slug: 'stereotype',
    name: 'Stereotype',
    scenario: 'Personalized dashboard for SaaS users',
    withoutBias:
      'Same "Engineering Manager" dashboard for all 240 managers — assumes role implies needs.',
    withBias:
      'Dashboard tuned to live signals: PRs reviewed, widgets opened, modules ignored. Maya gets on-call + PR queue, not headcount planning she never opens.',
    whyItWorks:
      'Role tells you a category; behavior tells you a person. Real activity beats demographic guesses every time the user opens the app.',
    category: 'Social',
  },
  {
    id: 52,
    slug: 'out-group-homogeneity',
    name: 'Out-Group Homogeneity',
    scenario: 'Re-engagement email to free-tier users',
    withoutBias:
      'One blast to 48,000 free users: "Upgrade to Pro for unlimited everything!" Conversion: 0.4%.',
    withBias:
      'Three behavior-based segments — power users hitting limits, casual users for a Lite plan, trial-stuck users offered a setup walkthrough. Conversion: 3.1%.',
    whyItWorks:
      "Free users aren't one audience; they're three audiences sharing a billing tier. Segmenting by behavior lets the message match the actual need.",
    category: 'Social',
  },
  {
    id: 56,
    slug: 'not-invented-here',
    name: 'Not Invented Here',
    scenario: 'Decision to add authentication to a B2B product',
    withoutBias:
      '6-month in-house OAuth build, $420K and 2 dedicated engineers. Roadmap blocked. No customer features ship.',
    withBias:
      'Drop in a battle-tested provider, wire up in 2 weeks at $18K/yr. Engineers freed for the actual differentiator.',
    whyItWorks:
      'The pride of building everything blinds teams to the cost. Buying the commodity layer and building only what differentiates is almost always the right ratio.',
    category: 'Social',
  },
  {
    id: 59,
    slug: 'survival-bias',
    name: 'Survival Bias',
    scenario: 'Marketing case studies on a product website',
    withoutBias:
      'Three glowing wins ("+340% MRR", "+5× retention") and a "join 1,200 winning teams" banner. Failures are invisible.',
    withBias:
      'Honest distribution chart: 12% big wins, 51% modest, 24% flat, 13% churned — with a section explaining who tends to fail and how to tell early.',
    whyItWorks:
      'Survivors only show what works for survivors. Showing the dropouts builds trust and helps the right buyers self-select instead of churning later.',
    category: 'Decision',
  },
  {
    id: 60,
    slug: 'subadditivity-effect',
    name: 'Subadditivity Effect',
    scenario: 'Pricing card for an all-in-one plan',
    withoutBias:
      '"$99/mo — Includes everything our platform offers." Single number, no breakdown.',
    withBias:
      'Same $99 broken into Storage $30 + Support $25 + Analytics $30 + Integrations $24 + Audit $18, with "You save $28/mo vs. buying separately."',
    whyItWorks:
      'A lump price gets compared to one number; itemized value gets compared to five. Decomposition makes the value feel larger because the brain adds component prices, not the total.',
    category: 'Decision',
  },
  {
    id: 65,
    slug: 'illusion-of-asymmetric-insight',
    name: 'Illusion of Asymmetric Insight',
    scenario: 'Slack message announcing a product decision',
    withoutBias:
      '"I think we all agree the new flow is a no-brainer. Shipping Friday." Silence read as consent.',
    withBias:
      'Decision template: what I propose, why, what I might be missing, how I\'ll know I\'m wrong — and a request for "one thing you read differently."',
    whyItWorks:
      "Silence isn't agreement; it's ambiguity. Forcing structured disclosure and a specific request for disagreement reveals the gap between what you sent and what they heard.",
    category: 'Social',
  },
  {
    id: 67,
    slug: 'planning-fallacy',
    name: 'Planning Fallacy',
    scenario: 'Engineering estimate for a billing-system migration',
    withoutBias:
      'Single number: "3 days." Project ships 18 days late; customers double-billed in week 2.',
    withBias:
      'Three-point estimate (3d / 7d / 14d) anchored against historical ratio: previous 3 similar projects averaged 2.5× the original estimate.',
    whyItWorks:
      "Optimism dominates single estimates. Three-point ranges plus historical actuals force teams to confront how their team's estimates have actually held up.",
    category: 'Decision',
  },
  {
    id: 68,
    slug: 'pro-innovation-bias',
    name: 'Pro-Innovation Bias',
    scenario: 'Editor 2.0 rollout in a long-tenured product',
    withoutBias:
      '"We\'re retiring Classic — switch now!" with one big CTA. Top support ticket: workflows broken before a launch.',
    withBias:
      '"New editor available — Classic stays through 2027." Two CTAs (try beta / stay on Classic) and explicit reassurance.',
    whyItWorks:
      "Forced migration treats users' invested workflows as expendable. Letting them coexist respects what's already working and earns the upgrade when it actually saves time.",
    category: 'Decision',
  },
  {
    id: 69,
    slug: 'overconfidence-effect',
    name: 'Overconfidence Effect',
    scenario: 'Quarterly active-user forecast',
    withoutBias:
      'Single point estimate (420,000) with self-rated 95% confidence. Historical hit rate at that confidence: 41%.',
    withBias:
      'Forced 90% range (290,000–610,000) with calibration rules and a tracking habit so future ranges get sharper.',
    whyItWorks:
      'Self-reported confidence is unreliable; a 90% range is hard to fake because it forces you to admit how wide reality could be. Calibration over time tightens the ranges honestly.',
    category: 'Decision',
  },
  {
    id: 72,
    slug: 'consensus-bias',
    name: 'Consensus Bias',
    scenario: 'Choosing an onboarding flow based on internal vote',
    withoutBias:
      'Team poll: 71% pick "Quick Tour." Decision: ship Quick Tour — users will obviously prefer it too.',
    withBias:
      'Team poll alongside customer survey (n=412): only 12% of customers pick Quick Tour; 65% want a demo video.',
    whyItWorks:
      "The room agreeing isn't the room buying. Pairing internal preference with actual customer signal exposes the gap before it becomes a launch failure.",
    category: 'Social',
  },
  {
    id: 95,
    slug: 'law-of-triviality',
    name: 'Law of Triviality',
    scenario: 'Sprint planning meeting agenda',
    withoutBias:
      '52 minutes spent on "teal vs. navy CTA" because everyone has a take. 8 minutes on a database migration that could break checkout.',
    withBias:
      'Time-boxed agenda: 45m on the migration plan, 25m on error-budget policy, 5m each on bikeshed topics with default-to-owner rules.',
    whyItWorks:
      'Trivial decisions invite participation because anyone can have an opinion; consequential ones repel it. Time-boxing by impact aligns attention with stakes.',
    category: 'Social',
  },
  {
    id: 98,
    slug: 'implicit-stereotypes',
    name: 'Implicit Stereotypes',
    scenario:
      'Initial screen of a take-home submission for an engineering role',
    withoutBias:
      'Reviewer sees name, photo, school. Callback rate for matched-skill candidates from underrepresented groups: 11%.',
    withBias:
      'Blind review: name, photo and school masked until the interview round. Callback rate at matched skill: 34%.',
    whyItWorks:
      'Implicit associations fire faster than deliberate judgment. Removing the trigger at the moment of evaluation lets the work be assessed on the work — and the data shows the gap close immediately.',
    category: 'Social',
  },
];
