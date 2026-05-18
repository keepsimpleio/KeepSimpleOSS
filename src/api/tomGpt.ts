import { UxCatRoute } from './configs';

export type TomGptErrorCode =
  | 'RATE_LIMITED'
  | 'SESSION_LIMIT_REACHED'
  | 'OPENAI_RATE_LIMIT'
  | 'UPSTREAM_ERROR'
  | 'FEATURE_DISABLED'
  | 'UNAUTHORIZED'
  | 'CHAT_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export type TomGptResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: TomGptErrorCode; status: number; message?: string };

export interface TomChatListItem {
  chatId: string;
  createdAt: string;
}

export interface TomChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string;
}

export type TomStreamEvent =
  | { type: 'delta'; text: string }
  | { type: 'done'; chatId?: string }
  | { type: 'error'; code: TomGptErrorCode; message?: string };

const trimSlash = (s: string) => s.replace(/\/+$/, '');
const baseUrl = () => trimSlash(UxCatRoute || '');

// UXCat NestJS middleware reads a custom `accessToken` header (raw JWT, no
// "Bearer " prefix). Do NOT switch this to `Authorization` — middleware will
// treat it as missing and return 401.
const authHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('accessToken');
  return token ? { accessToken: token } : {};
};

const statusToCode = (status: number): TomGptErrorCode => {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FEATURE_DISABLED';
  if (status === 404) return 'CHAT_NOT_FOUND';
  if (status === 429) return 'RATE_LIMITED';
  if (status >= 500) return 'UPSTREAM_ERROR';
  return 'UNKNOWN_ERROR';
};

const parseError = async (
  res: Response,
): Promise<{ code: TomGptErrorCode; status: number; message?: string }> => {
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  const rawCode: string | undefined = body?.error?.code || body?.code;
  return {
    code: (rawCode as TomGptErrorCode) || statusToCode(res.status),
    status: res.status,
    message: body?.error?.message || body?.message,
  };
};

const request = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<TomGptResult<T>> => {
  try {
    const res = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
        ...(init.headers || {}),
      },
    });
    if (!res.ok) return { ok: false, ...(await parseError(res)) };
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, code: 'NETWORK_ERROR', status: 0, message: e?.message };
  }
};

export const createTomChat = () =>
  request<{ chatId: string; createdAt: string }>('/gpt/chats', {
    method: 'POST',
  });

export const listTomChats = () =>
  request<{ chats: TomChatListItem[] }>('/gpt/chats');

export const getTomChatHistory = (chatId: string) =>
  request<{ messages: TomChatMessage[] }>(
    `/gpt/chats/${encodeURIComponent(chatId)}`,
  );

export const deleteTomChat = (chatId: string) =>
  request<{ success: boolean }>(`/gpt/chats/${encodeURIComponent(chatId)}`, {
    method: 'DELETE',
  });

// Parses an SSE byte stream into discrete `event`/`data` pairs. Splits on the
// blank-line delimiter; `data:` lines accumulate (multi-line joined with \n).
async function* parseSse(
  res: Response,
): AsyncGenerator<{ event: string; data: string }> {
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      let event = 'message';
      const dataLines: string[] = [];
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
      }
      yield { event, data: dataLines.join('\n') };
    }
  }
}

// Backend examples show `data: {"text": "..."}`. We also accept a bare string
// in case the wire format drifts.
const parseDeltaText = (data: string): string => {
  try {
    const payload = JSON.parse(data);
    if (typeof payload?.text === 'string') return payload.text;
    if (typeof payload === 'string') return payload;
  } catch {
    return data;
  }
  return '';
};

// EventSource cannot send custom headers, and we need the `accessToken`
// header, so we hand-roll the SSE parser on top of fetch + ReadableStream.
export async function* sendTomMessage(
  chatId: string,
  message: string,
  signal?: AbortSignal,
): AsyncGenerator<TomStreamEvent> {
  let res: Response;
  try {
    res = await fetch(
      `${baseUrl()}/gpt/chats/${encodeURIComponent(chatId)}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader(),
        },
        body: JSON.stringify({ message }),
        signal,
      },
    );
  } catch (e: any) {
    yield { type: 'error', code: 'NETWORK_ERROR', message: e?.message };
    return;
  }

  if (!res.ok) {
    const err = await parseError(res);
    yield { type: 'error', code: err.code, message: err.message };
    return;
  }

  try {
    for await (const { event, data } of parseSse(res)) {
      if (event === 'delta') {
        const text = parseDeltaText(data);
        if (text) yield { type: 'delta', text };
      } else if (event === 'done') {
        let chatIdOut: string | undefined;
        try {
          const payload = JSON.parse(data);
          chatIdOut = payload?.conversationId || payload?.chatId;
        } catch {
          // No payload — emit done anyway.
        }
        yield { type: 'done', chatId: chatIdOut };
        return;
      } else if (event === 'error') {
        let code: TomGptErrorCode = 'UPSTREAM_ERROR';
        let msg: string | undefined;
        try {
          const payload = JSON.parse(data);
          if (payload?.code) code = payload.code as TomGptErrorCode;
          if (payload?.message) msg = payload.message;
        } catch {
          // Malformed error payload — fall through with default code.
        }
        yield { type: 'error', code, message: msg };
        return;
      }
    }
  } catch (e: any) {
    yield { type: 'error', code: 'NETWORK_ERROR', message: e?.message };
  }
}

export const tomErrorCopy = (code: TomGptErrorCode): string => {
  switch (code) {
    case 'FEATURE_DISABLED':
      return 'Tom GPT is not available on your account yet.';
    case 'UNAUTHORIZED':
      return 'Please sign in to use chat.';
    case 'CHAT_NOT_FOUND':
      return 'This chat no longer exists.';
    case 'RATE_LIMITED':
      return "You've reached today's message limit. Please come back tomorrow.";
    case 'SESSION_LIMIT_REACHED':
      return 'This chat has reached its message limit. Start a new chat to continue.';
    case 'OPENAI_RATE_LIMIT':
      return 'Too many messages, please slow down.';
    case 'UPSTREAM_ERROR':
      return 'Something went wrong. Try again in a moment.';
    case 'NETWORK_ERROR':
      return 'Network error. Check your connection.';
    default:
      return 'Something went wrong.';
  }
};
