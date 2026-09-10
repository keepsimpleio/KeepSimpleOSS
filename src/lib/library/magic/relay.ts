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
 *
 * A call is handed over as a job rather than held open. The staging and
 * production frontends reach the relay across an edge that closes a proxied
 * request at 100 seconds, while opus 5 at high effort on a library this size
 * measured 107 and 117 (The Order, 2026-09-10). So the request is posted to
 * the relay's job endpoint, which answers at once, and the answer is
 * collected by polling: every hop is short and the model takes as long as it
 * takes. A relay that does not know the job endpoint is asked the old way,
 * so a container wired before this mode existed keeps working.
 */

export const RELAY_URL =
  process.env.CLAUDE_RELAY_URL || 'http://claude-relay:8080/v1/messages';
const RELAY_TOKEN = process.env.CLAUDE_RELAY_TOKEN || '';
/** The relay's own CLI timeout is 280s. Only the old direct path waits it out. */
const RELAY_TIMEOUT_MS = 290_000;
/** Handing a job over, and every poll after it, are short requests. */
const RELAY_HOP_MS = 30_000;
/** How often the answer is asked for. */
const POLL_MS = 3_000;
/** Past this the job is abandoned; the relay never runs one this long. */
const JOB_DEADLINE_MS = 330_000;

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

interface MessagesBody {
  model?: string;
  content?: Array<{ type?: string; text?: string }>;
  usage?: { input_tokens?: number; output_tokens?: number };
  text?: string;
}

interface JobState {
  status?: 'queued' | 'running' | 'done' | 'failed';
  http_status?: number;
  headers?: Record<string, string>;
  result?: MessagesBody;
  error?: string;
}

const headers = () => ({
  'content-type': 'application/json',
  'anthropic-version': '2023-06-01',
  'x-delta-relay-token': RELAY_TOKEN,
});

const bodyOf = (request: RelayRequest) =>
  JSON.stringify({
    model: request.model,
    max_tokens: request.maxTokens,
    system: request.system,
    messages: [{ role: 'user', content: request.prompt }],
    ...(request.effort ? { output_config: { effort: request.effort } } : {}),
  });

/** The job endpoint beside whatever the URL names, or nothing when the URL
 * is not the shape this relay uses. */
const jobsUrl = (): string => {
  try {
    const url = new URL(RELAY_URL);
    const next = url.pathname.replace(/\/v1\/messages\/?$/, '/v1/jobs');
    if (next === url.pathname) return '';
    url.pathname = next;
    return url.toString();
  } catch {
    return '';
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** What the reply carries once a Messages body is in hand. */
const readReply = (
  data: MessagesBody,
  request: RelayRequest,
  slot: string,
  transport: string,
): RelayReply => {
  const text = (data.content ?? [])
    .filter(b => b?.type === 'text')
    .map(b => b.text ?? '')
    .join('\n');
  return {
    text: text || data.text || '',
    slot,
    transport,
    model: data.model ?? request.model,
    usage: data.usage,
  };
};

/** The old way: one request held open for the whole answer. */
async function askDirect(request: RelayRequest): Promise<RelayReply> {
  let r: Response;
  try {
    r = await fetch(RELAY_URL, {
      method: 'POST',
      headers: headers(),
      signal: AbortSignal.timeout(RELAY_TIMEOUT_MS),
      body: bodyOf(request),
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
  return readReply((await r.json()) as MessagesBody, request, slot, transport);
}

/**
 * Hand the call over and collect it. A poll that fails on the way is not the
 * job failing: the work is running and already paid for, so the next poll
 * asks again until the deadline.
 */
async function askAsJob(
  url: string,
  request: RelayRequest,
): Promise<RelayReply> {
  let accepted: Response;
  try {
    accepted = await fetch(url, {
      method: 'POST',
      headers: headers(),
      signal: AbortSignal.timeout(RELAY_HOP_MS),
      body: bodyOf(request),
    });
  } catch (error) {
    throw new RelayError(
      `relay unreachable at ${url}: ${error instanceof Error ? error.message : 'fetch failed'}`,
      0,
    );
  }
  // A relay that does not know jobs is asked the old way instead.
  if (accepted.status === 404 || accepted.status === 405) {
    return askDirect(request);
  }
  if (!accepted.ok) {
    const text = await accepted.text().catch(() => '');
    throw new RelayError(
      `relay ${accepted.status} on handing the job over ${text.slice(0, 200)}`,
      accepted.status,
    );
  }
  const handed = (await accepted.json().catch(() => null)) as {
    id?: string;
    poll?: string;
  } | null;
  if (!handed?.id) {
    throw new RelayError('the relay accepted the job without naming it', 502);
  }
  const poll = new URL(handed.poll ?? `/v1/jobs/${handed.id}`, url).toString();

  const deadline = Date.now() + JOB_DEADLINE_MS;
  let lastPollError = '';
  while (Date.now() < deadline) {
    await sleep(POLL_MS);
    let asked: Response;
    try {
      asked = await fetch(poll, {
        headers: headers(),
        signal: AbortSignal.timeout(RELAY_HOP_MS),
      });
    } catch (error) {
      lastPollError = error instanceof Error ? error.message : 'fetch failed';
      continue;
    }
    if (asked.status === 404) {
      throw new RelayError('the relay forgot the job before it landed', 404);
    }
    if (!asked.ok) {
      lastPollError = `poll ${asked.status}`;
      continue;
    }
    const state = (await asked.json().catch(() => null)) as JobState | null;
    if (!state || state.status === 'queued' || state.status === 'running') {
      continue;
    }
    const slot = state.headers?.['x-relay-slot'] ?? '';
    const transport = state.headers?.['x-relay-transport'] ?? '';
    const exhausted = state.headers?.['x-relay-exhausted'] === '1';
    if (state.status === 'failed' || !state.result) {
      throw new RelayError(
        `relay job failed${exhausted ? ' (every track failed)' : ''}: ${state.error ?? 'no answer'}`,
        state.http_status ?? 502,
        exhausted,
      );
    }
    const status = state.http_status ?? 200;
    if (status < 200 || status >= 300) {
      throw new RelayError(
        `relay ${status}${exhausted ? ' (every track failed)' : ''}`,
        status,
        exhausted,
      );
    }
    return readReply(state.result, request, slot, transport);
  }
  throw new RelayError(
    `the relay job did not land inside ${Math.round(JOB_DEADLINE_MS / 1000)}s${lastPollError ? ` (last poll: ${lastPollError})` : ''}`,
    504,
  );
}

export async function askRelay(request: RelayRequest): Promise<RelayReply> {
  if (!RELAY_TOKEN) {
    throw new RelayError('CLAUDE_RELAY_TOKEN is not set on this host', 0);
  }
  const jobs = jobsUrl();
  return jobs ? askAsJob(jobs, request) : askDirect(request);
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
