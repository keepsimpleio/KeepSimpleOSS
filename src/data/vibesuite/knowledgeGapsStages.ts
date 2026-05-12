/** Stages of building an AI SaaS Platform, mapped to skill IDs. */

export interface KnowledgeGapsStage {
  id: string;
  skillIds: string[];
}

export const knowledgeGapsStages: KnowledgeGapsStage[] = [
  {
    id: 'tooling',
    skillIds: [
      'claude-code-tool',
      'cursor-windsurf',
      'claude-projects',
      'v0-dev-ai-ui',
    ],
  },
  {
    id: 'prototype',
    skillIds: [
      'react-nextjs-portfolio',
      'tailwind-styling',
      'shadcn-ui-dashboard',
    ],
  },
  {
    id: 'backend',
    skillIds: [
      'api-routes-first',
      'supabase-crud',
      'file-storage-uploads',
      'nextauth-google-login',
      'magic-link-auth',
    ],
  },
  {
    id: 'ai-core',
    skillIds: [
      'claude-api-chatbot',
      'openai-api-content',
      'prompt-engineering-advisor',
      'streaming-responses',
      'rag-chat-documents',
      'ai-function-calling',
      'ai-agents-workflows',
    ],
  },
  {
    id: 'frontend-polish',
    skillIds: [
      'framer-motion-animations',
      'i18n-localization',
      'pwa-mobile',
      'interactive-visualizations',
    ],
  },
  {
    id: 'infrastructure',
    skillIds: [
      'vercel-first-deploy',
      'cloudflare-domain-cdn',
      'github-actions-cicd',
      'seo-meta-tags',
      'error-monitoring',
      'analytics-know-users',
    ],
  },
  {
    id: 'monetization',
    skillIds: [
      'stripe-payments',
      'subscriptions',
      'prepaid-credits',
      'coinbase-crypto',
      'email-resend',
    ],
  },
  {
    id: 'integrations',
    skillIds: [
      'webhooks-events',
      'cron-scheduled-tasks',
      'telegram-bot',
      'slack-bot',
      'zapier-make-automation',
      'notion-api',
      'google-sheets-api',
    ],
  },
  {
    id: 'security',
    skillIds: ['api-keys-rate-limits', 'row-level-security'],
  },
  {
    id: 'scale',
    skillIds: [
      'realtime-websockets',
      'fulltext-search',
      'redis-vercel-kv-cache',
      'neon-serverless-pg',
      'multi-model-routing',
      'vibe-coding-method',
    ],
  },
];
