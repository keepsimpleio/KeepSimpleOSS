/**
 * Shared LLM-client constants for the concierge API routes.
 *
 * Both /api/concierge and /api/concierge-landing duplicate the same
 * URL + header + env-key handling for Anthropic and OpenAI. This
 * module centralises those bits so route files only own their own
 * prompts and response-parsing logic.
 */

export const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
export const OPENAI_KEY = process.env.OPENAI_API_KEY;

export const CLAUDE_MODEL = 'claude-sonnet-4-6';
export const OPENAI_MODEL = 'gpt-4.1';

export const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
export const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export function anthropicHeaders(): Record<string, string> {
  if (!ANTHROPIC_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }
  return {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_KEY,
    'anthropic-version': '2023-06-01',
  };
}

export function openAIHeaders(): Record<string, string> {
  if (!OPENAI_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPENAI_KEY}`,
  };
}
