const CRLF = '\r\n';
const PRODID = '-//KeepSimple//UXCAT//EN';
const DEFAULT_DURATION_MS = 30 * 60 * 1000;
const MAX_LINE_OCTETS = 74;

export type CalendarEvent = {
  title: string;
  start: Date;
  end?: Date;
  description?: string;
  url?: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

// nextTestTime arrives as an epoch timestamp, and `new Date('1758...')` parses
// as Invalid Date — numeric strings have to be coerced to a number first.
export const parseEventDate = (
  value?: string | number | Date | null,
): Date | null => {
  if (value === null || value === undefined || value === '') return null;

  const raw = value instanceof Date ? value : String(value).trim();
  const normalized =
    typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : raw;

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getEventWindow = (value?: string | number | Date | null) => {
  const start = parseEventDate(value);
  if (!start) return null;

  return { start, end: new Date(start.getTime() + DEFAULT_DURATION_MS) };
};

// RFC 5545 UTC date-time: YYYYMMDDTHHMMSSZ
export const toICalUTC = (date: Date) =>
  [
    date.getUTCFullYear(),
    pad(date.getUTCMonth() + 1),
    pad(date.getUTCDate()),
    'T',
    pad(date.getUTCHours()),
    pad(date.getUTCMinutes()),
    pad(date.getUTCSeconds()),
    'Z',
  ].join('');

// RFC 5545 §3.3.11
const escapeText = (value: string) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

// RFC 5545 §3.1 — content lines are folded at 75 octets, and Cyrillic copy
// blows past that in half the characters, so fold by byte length not length.
const foldLine = (line: string) => {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= MAX_LINE_OCTETS) return line;

  const chunks: string[] = [];
  let current = '';
  let currentOctets = 0;

  for (const char of line) {
    const octets = encoder.encode(char).length;
    if (currentOctets + octets > MAX_LINE_OCTETS) {
      chunks.push(current);
      current = '';
      currentOctets = 0;
    }
    current += char;
    currentOctets += octets;
  }
  chunks.push(current);

  return chunks.join(`${CRLF} `);
};

export const buildICS = ({
  title,
  start,
  end,
  description,
  url,
}: CalendarEvent) => {
  const startUTC = toICalUTC(start);
  const endUTC = toICalUTC(
    end ?? new Date(start.getTime() + DEFAULT_DURATION_MS),
  );

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    // Deterministic UID so re-downloading updates the event instead of
    // stacking duplicates in the user's calendar.
    `UID:uxcat-${startUTC}@keepsimple.io`,
    `DTSTAMP:${toICalUTC(new Date())}`,
    `DTSTART:${startUTC}`,
    `DTEND:${endUTC}`,
    `SUMMARY:${escapeText(title)}`,
  ];

  if (description) lines.push(`DESCRIPTION:${escapeText(description)}`);
  // URL is a URI value, not TEXT — it must not be backslash-escaped.
  if (url) lines.push(`URL:${url}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return `${lines.map(foldLine).join(CRLF)}${CRLF}`;
};

export const downloadICS = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};
