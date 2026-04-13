import { Skill, SkillCategory } from '@local-types/pageTypes/vibesuite';

export const categories: SkillCategory[] = [
  // ─── 1. LLMs & AI Assistants ───────────────────────────────────────
  {
    id: 'llm-ai',
    name: 'LLMs & AI Assistants',
    icon: '🧠',
    color: '#8B5CF6',
    description: 'Connect AI brains to your projects',
    skills: [
      {
        id: 'claude-api-chatbot',
        name: 'Claude API — Website Chatbot',
        projectTitle: 'Build an AI chatbot for your website',
        projectDescription:
          'Create a chat widget that answers visitor questions about your product. Learn how to send requests to the Claude API, write system prompts, and handle responses in real time.',
        difficulty: 'beginner',
        timeEstimate: '2-3 hours',
        tools: ['Anthropic API', 'Next.js'],
      },
      {
        id: 'openai-api-content',
        name: 'OpenAI API — Content Generator',
        projectTitle: 'Build a social media post generator',
        projectDescription:
          'Enter a topic — get ready-made posts for Telegram, Twitter, and LinkedIn in different styles. Learn how to work with the OpenAI API, prompt engineering, and structured output.',
        difficulty: 'beginner',
        timeEstimate: '2-3 hours',
        tools: ['OpenAI API', 'Next.js'],
      },
      {
        id: 'prompt-engineering-advisor',
        name: 'Prompt Engineering — AI Advisor',
        projectTitle: 'Create a personal AI advisor on a topic you know well',
        projectDescription:
          'For example, a nutrition advisor, a style consultant, or a tech-buying guide. Learn chain-of-thought prompting, few-shot examples, and how to make AI give expert-level answers.',
        difficulty: 'beginner',
        timeEstimate: '3-4 hours',
        tools: ['Claude API or OpenAI API'],
      },
      {
        id: 'streaming-responses',
        name: 'Streaming — Live AI Response',
        projectTitle: 'Add streaming to your chatbot — text appears letter by letter like ChatGPT',
        projectDescription:
          'Instead of waiting for the full response, text prints in real time. Learn Server-Sent Events (SSE), streaming APIs, and how to handle streamed data in the UI.',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Claude API', 'SSE', 'React'],
        dependsOn: ['claude-api-chatbot'],
      },
      {
        id: 'claude-in-claude-app',
        name: 'Embed AI in Your App',
        projectTitle: 'Build an app with AI working inside it',
        projectDescription:
          'For example, a text editor with an AI assistant or a quiz generator. The app calls the Claude API internally and uses the result for interactive UI. Learn nested API calls and state management.',
        difficulty: 'intermediate',
        timeEstimate: '1 day',
        tools: ['Anthropic API', 'React'],
        dependsOn: ['claude-api-chatbot'],
      },
      {
        id: 'rag-chat-documents',
        name: 'RAG — Chat With Your Documents',
        projectTitle: 'Build a chatbot that answers questions from your uploaded documents',
        projectDescription:
          'Upload a PDF or text file — the AI reads it and answers questions based on its content. Learn vector embeddings (turning text into numbers AI can search), chunking (splitting documents into pieces), and similarity search.',
        difficulty: 'intermediate',
        timeEstimate: '1 day',
        tools: ['Anthropic API', 'OpenAI Embeddings', 'Pinecone or Supabase pgvector'],
        dependsOn: ['claude-api-chatbot'],
      },
      {
        id: 'ai-function-calling',
        name: 'AI Function Calling — Tool Use',
        projectTitle:
          'Build an AI assistant that takes real actions — queries a database, calls APIs, sends emails',
        projectDescription:
          'Instead of just chatting, the AI can actually do things. Define tools (functions) the AI can call, and it decides when to use them. Learn function calling in Claude and OpenAI, tool definitions, and structured output parsing.',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Anthropic API', 'Next.js'],
        dependsOn: ['claude-api-chatbot'],
      },
      {
        id: 'multi-model-routing',
        name: 'Multi-Model Routing',
        projectTitle: 'Build an AI hub that picks the best model for each task',
        projectDescription:
          'Simple questions go to a cheap model, complex ones go to a powerful one. Learn how to work with multiple AI providers at once, request routing, and cost optimization.',
        difficulty: 'advanced',
        timeEstimate: '1-2 days',
        tools: ['Claude API', 'OpenAI API', 'Next.js'],
        dependsOn: ['claude-api-chatbot', 'openai-api-content'],
      },
    ],
  },

  // ─── 2. Local AI Models ────────────────────────────────────────────
  {
    id: 'local-ai',
    name: 'Local AI Models',
    icon: '💻',
    color: '#10B981',
    description: 'Run AI on your own computer — free and private',
    skills: [
      {
        id: 'ollama-local',
        name: 'Ollama — Local ChatGPT',
        projectTitle: 'Run your own ChatGPT on your computer',
        projectDescription:
          'Install Ollama, download a model, and build a web interface to chat with it. Works offline and for free. Learn how to run LLMs locally and make API requests to them.',
        difficulty: 'beginner',
        timeEstimate: '1-2 hours',
        tools: ['Ollama', 'Next.js'],
      },
      {
        id: 'local-ai-privacy',
        name: 'Local AI for Privacy',
        projectTitle: 'Build an app that processes sensitive data with a local AI model',
        projectDescription:
          'Medical notes, legal documents, personal journals — some data should never leave your computer. Run a local model to summarize, classify, or extract info from private files. Learn when to use local vs. cloud AI, data privacy patterns, and offline inference.',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Ollama', 'Next.js'],
        dependsOn: ['ollama-local'],
      },
      {
        id: 'local-ai-backend',
        name: 'Local AI Backend for Projects',
        projectTitle: 'Connect your project to a local model instead of a paid API',
        projectDescription:
          'Replace Claude/OpenAI API calls with a local model — same code, but free. Learn the OpenAI-compatible API format and how to switch between local and cloud models.',
        difficulty: 'intermediate',
        timeEstimate: '2-3 hours',
        tools: ['Ollama', 'Next.js'],
        dependsOn: ['ollama-local'],
      },
    ],
  },

  // ─── 3. Image & Video Generation ──────────────────────────────────
  {
    id: 'image-video',
    name: 'Image & Video Generation',
    icon: '🎨',
    color: '#F97316',
    description: 'Generate visuals with AI — from avatars to video clips',
    skills: [
      {
        id: 'replicate-image-gen',
        name: 'Replicate API — Image Generator',
        projectTitle: 'Build an image generator with a web interface',
        projectDescription:
          'Enter a text description — get an image. Like Midjourney, but built into your site. Learn Replicate API, Flux/SDXL models, and handling async tasks.',
        difficulty: 'beginner',
        timeEstimate: '2-3 hours',
        tools: ['Replicate API', 'Next.js'],
      },
      {
        id: 'voice-speech',
        name: 'Voice — Speech to Text & Text to Speech',
        projectTitle: 'Add voice input and output to your app',
        projectDescription:
          'Users speak instead of typing, and the app talks back. Learn the Whisper API for speech-to-text, ElevenLabs or the browser Web Speech API for text-to-speech, and how to handle audio streams.',
        difficulty: 'beginner',
        timeEstimate: '2-3 hours',
        tools: ['Whisper API', 'ElevenLabs or Web Speech API', 'Next.js'],
      },
      {
        id: 'ai-avatars',
        name: 'AI Avatars',
        projectTitle: 'Build an avatar generation service from photos',
        projectDescription:
          'User uploads a photo — gets a stylized avatar (anime, pixel art, 3D). Learn image uploads, image-to-image models, and server-side file handling.',
        difficulty: 'intermediate',
        timeEstimate: '1 day',
        tools: ['Replicate API', 'Next.js'],
        dependsOn: ['replicate-image-gen'],
      },
      {
        id: 'video-generation',
        name: 'Video Generation',
        projectTitle: 'Build a text-to-short-video generator',
        projectDescription:
          'User describes a scene — gets a 4-second video clip. Learn video models (Runway, Kling, Minimax), long async tasks, and progress display.',
        difficulty: 'advanced',
        timeEstimate: '1-2 days',
        tools: ['Runway API / Replicate', 'Next.js'],
        dependsOn: ['replicate-image-gen'],
      },
      {
        id: 'comfyui-pipeline',
        name: 'ComfyUI Pipeline',
        projectTitle: 'Set up your own local image generation pipeline',
        projectDescription:
          'Create a visual pipeline: txt2img → upscale → stylize. All local and free. Learn ComfyUI nodes, LoRA models from CivitAI, and workflow automation.',
        difficulty: 'advanced',
        timeEstimate: '1-2 days',
        tools: ['ComfyUI', 'CivitAI'],
      },
    ],
  },

  // ─── 4. Frontend & UI ─────────────────────────────────────────────
  {
    id: 'frontend-ui',
    name: 'Frontend & UI',
    icon: '✨',
    color: '#3B82F6',
    description: 'Build beautiful interfaces — websites, dashboards, apps',
    skills: [
      {
        id: 'react-nextjs-portfolio',
        name: 'React + Next.js — Personal Site',
        projectTitle: 'Build your personal portfolio website',
        projectDescription:
          'Create a multi-page site: about, projects, contacts. Learn React components, Next.js routing, Vercel deploy — the foundation for everything else.',
        difficulty: 'beginner',
        timeEstimate: '3-4 hours',
        tools: ['Next.js', 'Vercel'],
      },
      {
        id: 'tailwind-styling',
        name: 'Tailwind CSS — Styling',
        projectTitle: 'Restyle your site with Tailwind and make it look professional',
        projectDescription:
          'Take your site and add professional styling: mobile responsive, dark theme, hover effects. Learn the utility-first CSS approach and responsive design.',
        difficulty: 'beginner',
        timeEstimate: '2-3 hours',
        tools: ['Tailwind CSS'],
      },
      {
        id: 'shadcn-ui-dashboard',
        name: 'shadcn/ui — Ready Components',
        projectTitle: 'Assemble a dashboard from ready-made components in an hour',
        projectDescription:
          'Use a library of beautiful components (buttons, modals, tables, charts) and build a working dashboard from them. Learn the component approach and UI library customization.',
        difficulty: 'beginner',
        timeEstimate: '2-3 hours',
        tools: ['shadcn/ui', 'Tailwind CSS'],
        dependsOn: ['tailwind-styling'],
      },
      {
        id: 'v0-dev-ai-ui',
        name: 'v0.dev — AI UI Generation',
        projectTitle: 'Generate an entire page by describing it in words',
        projectDescription:
          "Write a prompt like 'landing page for a crypto portfolio tracker' — get ready React code. Learn how to use AI for rapid interface prototyping.",
        difficulty: 'beginner',
        timeEstimate: '1 hour',
        tools: ['v0.dev', 'React'],
      },
      {
        id: 'framer-motion-animations',
        name: 'Animations — Framer Motion',
        projectTitle: 'Add smooth animations to your website',
        projectDescription:
          'Element appear effects, page transitions, parallax on scroll. Learn Framer Motion, spring animations, and gesture interactions.',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Framer Motion', 'React'],
        dependsOn: ['react-nextjs-portfolio'],
      },
      {
        id: 'interactive-visualizations',
        name: 'Interactive Visualizations',
        projectTitle: 'Build an interactive map or data visualization',
        projectDescription:
          'For example, a map with pins on Mapbox or a zoomable chart on D3. Learn canvas/SVG, user gesture handling, and visual data display.',
        difficulty: 'advanced',
        timeEstimate: '1-2 days',
        tools: ['D3.js', 'Mapbox / Leaflet', 'React'],
        dependsOn: ['react-nextjs-portfolio'],
      },
    ],
  },

  // ─── 5. Backend & Databases ────────────────────────────────────────
  {
    id: 'backend-db',
    name: 'Backend & Databases',
    icon: '🗄️',
    color: '#EF4444',
    description: 'Store data, write server logic, build APIs',
    skills: [
      {
        id: 'api-routes-first',
        name: 'API Routes — Your First API',
        projectTitle: 'Build your first API endpoint',
        projectDescription:
          'Create an API that returns data (e.g., a project list in JSON). Any website or app can call it. Learn HTTP methods (GET, POST), JSON, and Next.js server functions.',
        difficulty: 'beginner',
        timeEstimate: '1-2 hours',
        tools: ['Next.js API Routes'],
      },
      {
        id: 'supabase-crud',
        name: 'Supabase — Database',
        projectTitle: 'Connect a database and build a CRUD app',
        projectDescription:
          'Build an app where you can create, read, update, and delete records (e.g., a task list or notes). Learn SQL, PostgreSQL via Supabase, and data management.',
        difficulty: 'beginner',
        timeEstimate: '3-4 hours',
        tools: ['Supabase', 'Next.js'],
      },
      {
        id: 'file-storage-uploads',
        name: 'File Storage — Uploads & Serving',
        projectTitle: 'Build file upload with cloud storage for your app',
        projectDescription:
          'Users upload images, documents, or any file — your app stores them in the cloud and serves them back. Learn multipart uploads, pre-signed URLs, and cloud storage services like Vercel Blob, Cloudflare R2, or S3.',
        difficulty: 'beginner',
        timeEstimate: '2-3 hours',
        tools: ['Vercel Blob or Cloudflare R2', 'Next.js'],
        dependsOn: ['api-routes-first'],
      },
      {
        id: 'redis-vercel-kv-cache',
        name: 'Redis / Vercel KV — Fast Cache',
        projectTitle: 'Add caching and speed up your site 10x',
        projectDescription:
          "Save frequent requests in Redis so you don't hit the database every time. Learn key-value stores, TTL (data expiration), and caching strategies.",
        difficulty: 'intermediate',
        timeEstimate: '2-3 hours',
        tools: ['Vercel KV', 'Redis'],
        dependsOn: ['api-routes-first'],
      },
      {
        id: 'neon-serverless-pg',
        name: 'Neon — Serverless PostgreSQL',
        projectTitle: 'Connect a PostgreSQL that scales automatically',
        projectDescription:
          'An alternative to Supabase for those who want more control. Neon turns on and off automatically — you only pay for usage. Learn direct PostgreSQL work and ORM (Prisma/Drizzle).',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Neon', 'Prisma', 'Next.js'],
        dependsOn: ['api-routes-first'],
      },
      {
        id: 'webhooks-events',
        name: 'Webhooks — Event Reactions',
        projectTitle: 'Build a system that reacts to external events',
        projectDescription:
          'For example: payment received in Stripe → send an email. Or: Notion document updated → rebuild the site. Learn webhook handlers, signature verification, and event-driven architecture.',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Next.js', 'Stripe / Notion'],
        dependsOn: ['api-routes-first'],
      },
      {
        id: 'cron-scheduled-tasks',
        name: 'Cron Jobs — Scheduled Tasks',
        projectTitle: 'Build automated background tasks that run on a schedule',
        projectDescription:
          'Send a weekly email digest, clean up old data every night, or check an API every hour — without anyone clicking a button. Learn Vercel Cron, GitHub Actions scheduled workflows, and how to write reliable background jobs.',
        difficulty: 'intermediate',
        timeEstimate: '2-3 hours',
        tools: ['Vercel Cron', 'GitHub Actions', 'Next.js'],
        dependsOn: ['api-routes-first'],
      },
    ],
  },

  // ─── 6. Auth & Security ────────────────────────────────────────────
  {
    id: 'auth-security',
    name: 'Auth & Security',
    icon: '🔐',
    color: '#EAB308',
    description: 'Login, registration, and user data protection',
    skills: [
      {
        id: 'nextauth-google-login',
        name: 'NextAuth — Website Login',
        projectTitle: "Add a 'Sign in with Google' button to your site",
        projectDescription:
          'Users can log in with their Google account in one click. Learn NextAuth.js, OAuth providers, sessions, and protected routes.',
        difficulty: 'beginner',
        timeEstimate: '2-3 hours',
        tools: ['NextAuth.js', 'Google OAuth', 'Next.js'],
      },
      {
        id: 'magic-link-auth',
        name: 'Magic Link — Passwordless Login',
        projectTitle: 'Build passwordless login — user gets a link via email',
        projectDescription:
          "Like Notion or Slack: enter email, get a link, click — you're logged in. No passwords. Learn Resend for sending emails, magic link flow, and tokens.",
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['NextAuth.js', 'Resend'],
        dependsOn: ['nextauth-google-login'],
      },
      {
        id: 'api-keys-rate-limits',
        name: 'API Keys & Rate Limits',
        projectTitle: 'Protect your API: access keys and request throttling',
        projectDescription:
          'Build an API key system for your project and add rate limiting (max 100 requests per minute). Learn API authentication, middleware, and spam protection.',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Next.js Middleware', 'Vercel KV'],
        dependsOn: ['api-routes-first'],
      },
      {
        id: 'row-level-security',
        name: 'Row Level Security',
        projectTitle: 'Make sure each user can only see their own data',
        projectDescription:
          "Even if someone gets access to the API — they'll only see their own data. Learn RLS policies in PostgreSQL/Supabase and the principle of least privilege.",
        difficulty: 'advanced',
        timeEstimate: '2-3 hours',
        tools: ['Supabase', 'PostgreSQL'],
        dependsOn: ['supabase-crud', 'nextauth-google-login'],
      },
    ],
  },

  // ─── 7. Deploy & Infrastructure ────────────────────────────────────
  {
    id: 'deploy-infra',
    name: 'Deploy & Infrastructure',
    icon: '🚀',
    color: '#6B7280',
    description: 'Publish projects to the internet and set up infrastructure',
    skills: [
      {
        id: 'vercel-first-deploy',
        name: 'Vercel — First Deploy',
        projectTitle: 'Publish your website to the internet in 5 minutes',
        projectDescription:
          'Connect a GitHub repo to Vercel and get a working URL. Every git push = automatic deploy. Learn CI/CD, env variables, and domain binding.',
        difficulty: 'beginner',
        timeEstimate: '30 min',
        tools: ['Vercel', 'GitHub'],
      },
      {
        id: 'netlify-static',
        name: 'Netlify — Static Sites',
        projectTitle: 'Deploy a static site (HTML/CSS/JS) on Netlify',
        projectDescription:
          'For simple projects without a backend. Drag & drop or via Git. Learn the difference between static and dynamic hosting, forms, and redirects.',
        difficulty: 'beginner',
        timeEstimate: '30 min',
        tools: ['Netlify', 'GitHub'],
      },
      {
        id: 'analytics-know-users',
        name: 'Analytics — Know Your Users',
        projectTitle: 'Add analytics to see who uses your product and how',
        projectDescription:
          'See how many visitors you get, which pages they visit, and where they drop off — without creepy tracking. Learn privacy-friendly analytics with Vercel Analytics, Plausible, or PostHog, and how to make data-driven decisions.',
        difficulty: 'beginner',
        timeEstimate: '1 hour',
        tools: ['Vercel Analytics or Plausible or PostHog'],
        dependsOn: ['vercel-first-deploy'],
      },
      {
        id: 'github-actions-cicd',
        name: 'GitHub Actions — Automation',
        projectTitle: 'Set up automatic tests and deploy on every commit',
        projectDescription:
          'Write a workflow: on push to main — run checks, if all good — deploy. Learn CI/CD pipelines, YAML configs, and routine automation.',
        difficulty: 'intermediate',
        timeEstimate: '2-3 hours',
        tools: ['GitHub Actions'],
        dependsOn: ['vercel-first-deploy'],
      },
      {
        id: 'cloudflare-domain-cdn',
        name: 'Cloudflare — Domain & CDN',
        projectTitle: 'Connect your domain and speed up your site via Cloudflare',
        projectDescription:
          'Buy a domain, set up DNS, enable CDN and SSL. Learn how DNS works, what CDN is, and how to protect your site from DDoS.',
        difficulty: 'beginner',
        timeEstimate: '1 hour',
        tools: ['Cloudflare'],
      },
    ],
  },

  // ─── 8. Payments & Monetization ────────────────────────────────────
  {
    id: 'payments',
    name: 'Payments & Monetization',
    icon: '💰',
    color: '#D97706',
    description: 'Accept money — subscriptions, one-time payments, crypto',
    skills: [
      {
        id: 'stripe-payments',
        name: 'Stripe — Accept Payments',
        projectTitle: "Add a 'Buy' button to your site",
        projectDescription:
          'User clicks, enters card info, money goes to your account. Learn Stripe Checkout, webhook handling, and test mode payments.',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Stripe', 'Next.js'],
        dependsOn: ['api-routes-first'],
      },
      {
        id: 'coinbase-crypto',
        name: 'Coinbase Commerce — Crypto Payments',
        projectTitle: 'Add cryptocurrency payments to your site',
        projectDescription:
          'Accept Bitcoin, Ethereum, and stablecoins. Learn Coinbase Commerce API, payment link generation, and transaction verification.',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Coinbase Commerce', 'Next.js'],
        dependsOn: ['api-routes-first'],
      },
      {
        id: 'subscriptions',
        name: 'Subscriptions',
        projectTitle: 'Build a subscription model: Free, Pro, Enterprise',
        projectDescription:
          'Users buy a subscription — get access to premium features. Learn Stripe Subscriptions, plan management, downgrade/upgrade, and cancellation.',
        difficulty: 'advanced',
        timeEstimate: '1-2 days',
        tools: ['Stripe', 'Next.js', 'Supabase'],
        dependsOn: ['stripe-payments'],
      },
      {
        id: 'prepaid-credits',
        name: 'Prepaid Credits',
        projectTitle: 'Build a prepaid credit system (like ChatGPT API)',
        projectDescription:
          'User buys a pack of credits, each request costs a credit. Learn billing logic, balances, pricing, and a user dashboard.',
        difficulty: 'advanced',
        timeEstimate: '1-2 days',
        tools: ['Stripe / Coinbase', 'Vercel KV'],
        dependsOn: ['stripe-payments'],
      },
    ],
  },

  // ─── 9. Integrations & Services ────────────────────────────────────
  {
    id: 'integrations',
    name: 'Integrations & Services',
    icon: '🔗',
    color: '#14B8A6',
    description: 'Connect external services — bots, email, Google Docs',
    skills: [
      {
        id: 'telegram-bot',
        name: 'Telegram Bot',
        projectTitle: 'Build a Telegram bot that does something useful',
        projectDescription:
          'For example, a reminder bot, a notes bot, or an AI bot. Learn Telegram Bot API, message handling, inline buttons, and deploying a bot to a server.',
        difficulty: 'beginner',
        timeEstimate: '2-3 hours',
        tools: ['Telegram Bot API', 'Next.js'],
      },
      {
        id: 'email-resend',
        name: 'Email — Transactional Emails',
        projectTitle: 'Send beautiful emails from your app',
        projectDescription:
          'Welcome emails, notifications, password reset — all automatic. Learn Resend API, React Email for templates, and send triggers.',
        difficulty: 'beginner',
        timeEstimate: '1-2 hours',
        tools: ['Resend', 'React Email'],
      },
      {
        id: 'google-sheets-api',
        name: 'Google APIs',
        projectTitle: 'Connect Google Sheets as a database for a simple project',
        projectDescription:
          'Read and write data directly from Google Sheets. Great for MVPs and prototypes. Learn Google API, service accounts, and authorization.',
        difficulty: 'intermediate',
        timeEstimate: '2-3 hours',
        tools: ['Google Sheets API', 'Next.js'],
      },
      {
        id: 'notion-api',
        name: 'Notion API',
        projectTitle: 'Build a website whose content comes from Notion',
        projectDescription:
          'Write in Notion — your site updates automatically. Perfect for blogs or docs. Learn Notion API, mapping Notion blocks to HTML, and ISR (Incremental Static Regeneration).',
        difficulty: 'intermediate',
        timeEstimate: '3-4 hours',
        tools: ['Notion API', 'Next.js'],
        dependsOn: ['react-nextjs-portfolio'],
      },
    ],
  },

  // ─── 10. AI Tools for Vibe Coding ─────────────────────────────────
  {
    id: 'ai-tools',
    name: 'AI Tools for Vibe Coding',
    icon: '⚡',
    color: '#EC4899',
    description: 'Master the tools you vibe-code with',
    skills: [
      {
        id: 'claude-code-tool',
        name: 'Claude Code',
        projectTitle: 'Create an entire project with a single prompt in the terminal',
        projectDescription:
          'Type a task in the CLI — Claude Code creates files, installs dependencies, writes code. Learn agentic coding, how to formulate tasks for AI, and terminal workflow.',
        difficulty: 'beginner',
        timeEstimate: '1 hour',
        tools: ['Claude Code', 'Terminal'],
      },
      {
        id: 'cursor-windsurf',
        name: 'Cursor / Windsurf',
        projectTitle: 'Write code with an AI assistant right in your editor',
        projectDescription:
          'AI sees your entire project and suggests code, fixes, refactoring in context. Learn AI-assisted development, contextual editing, and when to trust AI vs. not.',
        difficulty: 'beginner',
        timeEstimate: '1-2 hours',
        tools: ['Cursor or Windsurf'],
      },
      {
        id: 'claude-projects',
        name: 'Claude Projects — AI Context',
        projectTitle: 'Set up Claude to know your project perfectly',
        projectDescription:
          "Upload docs, style guides, and examples to a Claude Project — and AI will answer in YOUR project's context. Learn system prompts, knowledge management, and prompt optimization.",
        difficulty: 'beginner',
        timeEstimate: '1 hour',
        tools: ['Claude.ai Projects'],
      },
      {
        id: 'mcp-servers',
        name: 'MCP Servers',
        projectTitle: 'Connect Claude to your data via MCP',
        projectDescription:
          'Claude can read your Google Drive, Slack, database — and answer based on real data. Learn Model Context Protocol, MCP server setup, and AI integration with external services.',
        difficulty: 'intermediate',
        timeEstimate: '2-3 hours',
        tools: ['MCP SDK', 'Claude'],
        dependsOn: ['claude-projects'],
      },
      {
        id: 'vibe-coding-method',
        name: 'Vibe Coding as a Method',
        projectTitle: 'Go from idea to deployed product in one day',
        projectDescription:
          'Take an idea, describe it to AI, generate code, polish, and deploy. Full cycle. Learn how to combine all the tools: prompt → Claude Code → Vercel — and ship a working product.',
        difficulty: 'intermediate',
        timeEstimate: '1 day',
        tools: ['Claude Code', 'Vercel', 'Next.js'],
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const allSkills: Skill[] = categories.flatMap((c) => c.skills);

export function getSkillById(id: string): Skill | undefined {
  return allSkills.find((s) => s.id === id);
}

export function getCategoryBySkillId(skillId: string): SkillCategory | undefined {
  return categories.find((c) => c.skills.some((s) => s.id === skillId));
}

export function getDependencies(skillId: string): Skill[] {
  const skill = getSkillById(skillId);
  if (!skill?.dependsOn) return [];
  return skill.dependsOn.map((id) => getSkillById(id)).filter(Boolean) as Skill[];
}

export function getTotalSkillCount(): number {
  return allSkills.length;
}
