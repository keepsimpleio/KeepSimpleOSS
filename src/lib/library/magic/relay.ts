/**
 * The subscription relay: how every Library model call is paid for.
 *
 * Wolf's rule (2026-09-10, and for the fleet on 2026-09-06): the Library's
 * AI runs on his Claude subscriptions, never on a paid API key. Those
 * subscriptions are the Terminal's tracks t1, t2 and t3, and their tokens
 * never enter a product container. `claude-relay` (The Order's container on
 * the `wolf-shared` network, `wolfs-server/docs/claude-relay.md`) holds
 * them, answers an Anthropic Messages request, and moves the request to the
 * next track on a rate limit or a dead token: t1 first, then t2, then t3.
 * The reply names the track that served it in `x-relay-slot`.
 *
 * Opus and Sonnet run through the real Claude Code CLI inside the relay,
 * one turn, no tools, so the answer is text and the schema is asked for in
 * the prompt rather than as a tool. The relay is reached with
 * `CLAUDE_RELAY_URL` (default `http://claude-relay:8080/v1/messages`) and
 * `CLAUDE_RELAY_TOKEN`, both runtime values provisioned by The Order.
 */

export const RELAY_URL =
  process.env.CLAUDE_RELAY_URL || 'http://claude-relay:8080/v1/messages';
const RELAY_TOKEN = process.env.CLAUDE_RELAY_TOKEN || '';
/** The relay's own CLI timeout is 280s; a large library at high effort can
 * take a minute or two. */
const RELAY_TIMEOUT_MS = 290_000;

export type RelayEffort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export interface RelayRequest {
  model: string;
  system: string;
  prompt: string;
  maxTokens: number;
  effort?: RelayEffort;
}

export interface RelayReply {
  text: string;
  /** The track that served the call: t1, t2, t3. */
  slot: string;
  transport: string;
  model: string;
  usage?: { input_tokens?: number; output_tokens?: number };
}

export class RelayError extends Error {
  status: number;
  /** True when every track was tried and none answered. */
  exhausted: boolean;

  constructor(message: string, status: number, exhausted = false) {
    super(message);
    this.name = 'RelayError';
    this.status = status;
    this.exhausted = exhausted;
  }
}

export const relayConfigured = (): boolean => RELAY_TOKEN.length > 0;

export async function askRelay(request: RelayRequest): Promise<RelayReply> {
  if (!RELAY_TOKEN) {
    throw new RelayError('CLAUDE_RELAY_TOKEN is not set on this host', 0);
  }
  let r: Response;
  try {
    r = await fetch(RELAY_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-delta-relay-token': RELAY_TOKEN,
      },
      signal: AbortSignal.timeout(RELAY_TIMEOUT_MS),
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens,
        system: request.system,
        messages: [{ role: 'user', content: request.prompt }],
        ...(request.effort
          ? { output_config: { effort: request.effort } }
          : {}),
      }),
    });
  } catch (error) {
    throw new RelayError(
      `relay unreachable at ${RELAY_URL}: ${error instanceof Error ? error.message : 'fetch failed'}`,
      0,
    );
  }
  const slot = r.headers.get('x-relay-slot') ?? '';
  const transport = r.headers.get('x-relay-transport') ?? '';
  const exhausted = r.headers.get('x-relay-exhausted') === '1';
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new RelayError(
      `relay ${r.status}${exhausted ? ' (every track failed)' : ''} ${text.slice(0, 200)}`,
      r.status,
      exhausted,
    );
  }
  const data = (await r.json()) as {
    model?: string;
    content?: Array<{ type?: string; text?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const text = (data.content ?? [])
    .filter(b => b?.type === 'text')
    .map(b => b.text ?? '')
    .join('\n');
  return {
    text,
    slot,
    transport,
    model: data.model ?? request.model,
    usage: data.usage,
  };
}

/**
 * The JSON the model was asked for, out of the text it wrote: a fenced block
 * if it used one, else the outermost object. Throws when nothing parses.
 */
export function parseJsonReply<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidates = [fenced?.[1], text];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start < 0 || end <= start) continue;
    try {
      return JSON.parse(candidate.slice(start, end + 1)) as T;
    } catch {
      /* try the next candidate */
    }
  }
  throw new Error(`model reply was not JSON: ${text.slice(0, 120)}`);
}
