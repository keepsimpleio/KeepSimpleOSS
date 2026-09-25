/**
 * Shared LLM-client constants for the concierge API routes.
 *
 * Claude is reached only through the subscription relay (Wolf,
 * 2026-09-22): the Terminal's tracks t1, t2 and t3, switched on a rate
 * limit, never a paid API key. See src/lib/library/magic/relay.ts. The
 * relay runs one CLI turn without tools, so the reply schema is asked
 * for in the prompt and the JSON is read out of the text.
 */

import {
  askRelay,
  parseJsonReply,
  relayConfigured,
} from '@lib/library/magic/relay';

export const CLAUDE_MODEL = 'claude-sonnet-5';

export const claudeConfigured = relayConfigured;

/** One Claude turn through the relay, answered as JSON matching `schema`.
 * Null when the relay is not wired, every track failed, or the reply did
 * not parse; the caller then stays quiet. */
export async function askClaudeJson<T>(
  system: string,
  user: string,
  schema: object,
  maxTokens: number,
): Promise<T | null> {
  if (!relayConfigured()) return null;
  try {
    const reply = await askRelay({
      model: CLAUDE_MODEL,
      system,
      prompt:
        `${user}\n\nReply with one JSON object and nothing else. ` +
        `It must match this JSON Schema:\n${JSON.stringify(schema)}`,
      maxTokens,
      effort: 'low',
    });
    return parseJsonReply<T>(reply.text);
  } catch (error) {
    console.warn(
      `[widget] claude relay: ${error instanceof Error ? error.message : 'failed'}`,
    );
    return null;
  }
}
