/* Widget-side event endpoint for non-Q&A signals: clears, card
   clicks, nav, page_view, dwell, outbound clicks, explicit auth pings.
   The visitor's Q&A turns are logged server-side from inside
   /api/concierge after the response is built — this endpoint covers
   everything that doesn't pass through there. All work is fire-and-
   forget; we always reply 204 quickly so the widget never waits. */

import { randomUUID } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { bumpThread, logTurn, markAuthLink } from '@lib/copilotAnalytics';
import { scrubAny } from '@lib/copilotSafety';

const COOKIE_NAME = 'aux_sid';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

function readSid(req: NextApiRequest): string | null {
  const h = req.headers.cookie;
  if (!h) return null;
  const m = h.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return m ? m[1] : null;
}

function ensureSid(req: NextApiRequest, res: NextApiResponse): string {
  const existing = readSid(req);
  if (existing) return existing;
  const sid = randomUUID();
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
  );
  return sid;
}

type Body = {
  kind?: string;
  threadId?: string;
  oldThreadId?: string;
  lang?: string;
  pageUrl?: string;
  pageTitle?: string;
  cardClicked?: unknown;
  meta?: Record<string, unknown>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const body: Body = (req.body || {}) as Body;
  const sid = ensureSid(req, res);
  const threadId =
    typeof body.threadId === 'string' && body.threadId ? body.threadId : sid;
  const lang = (typeof body.lang === 'string' ? body.lang : 'en').slice(0, 3);

  /* Session-row metadata (lang / userAgent / firstUrl) is carried on
     every track call below — the service COALESCEs whichever non-null
     value arrives first into the session row. No dedicated
     session_start event needed. */
  const userAgent =
    typeof req.headers['user-agent'] === 'string'
      ? req.headers['user-agent']
      : undefined;
  const firstUrl = typeof body.pageUrl === 'string' ? body.pageUrl : undefined;

  /* NextAuth detection: getToken reads the JWT cookie without
     needing authOptions. If a user is signed in and we haven't
     linked them to this sid yet, fire the auth link + a kind=auth
     turn. Safe to call on every event — markAuthLink is idempotent. */
  try {
    const tok = await getToken({ req });
    const userId =
      (tok && (tok.email || tok.sub || (tok as Record<string, unknown>).id)) ||
      null;
    if (userId && typeof userId === 'string') {
      markAuthLink({
        sid,
        threadId,
        user: userId.slice(0, 200),
        pageUrl: body.pageUrl,
        pageTitle: body.pageTitle,
      });
    }
  } catch {
    /* NextAuth not configured or jwt-decode failed — silent */
  }

  switch (body.kind) {
    case 'clear': {
      const old =
        typeof body.oldThreadId === 'string' && body.oldThreadId
          ? body.oldThreadId
          : threadId;
      bumpThread({ sid, oldThreadId: old });
      break;
    }
    case 'card_click': {
      logTurn({
        sid,
        threadId,
        kind: 'card_click',
        cardClicked: scrubAny(body.cardClicked),
        pageUrl: body.pageUrl,
        pageTitle: body.pageTitle,
        meta: scrubAny(body.meta) as Record<string, unknown> | undefined,
        lang,
        userAgent,
        firstUrl,
      });
      break;
    }
    case 'nav':
    case 'page_view':
    case 'dwell':
    case 'tab_close':
    case 'outbound_click': {
      logTurn({
        sid,
        threadId,
        kind: body.kind,
        pageUrl: body.pageUrl,
        pageTitle: body.pageTitle,
        meta: scrubAny(body.meta) as Record<string, unknown> | undefined,
        lang,
        userAgent,
        firstUrl,
      });
      break;
    }
    default:
      /* Unknown / no kind — nothing to log beyond the session
         ensure + auth check that already ran above. */
      break;
  }

  res.status(204).end();
}
