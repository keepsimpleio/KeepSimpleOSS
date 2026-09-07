import type { Difficulty, OverallRating } from '@local-types/library/object';

// Display metadata shared by every surface that shows an object's details:
// the overview modal, the rating box and the hover dossier. Kept in one place
// so a rating colour or a date format never drifts between them.

export const OVERALL_COLORS: Record<OverallRating, string> = {
  1: '#c45222',
  2: '#ff9a00',
  3: '#d9b800',
  4: '#2db675',
  5: '#228858',
};

export interface DifficultyMeta {
  label: string;
  color: string;
}

export const DIFFICULTY_META: Record<Difficulty, DifficultyMeta> = {
  very_hard: { label: 'Very Hard', color: '#c45222' },
  hard: { label: 'Hard', color: '#ff9a00' },
  moderate: { label: 'Moderate', color: '#d9b800' },
  easy: { label: 'Easy', color: '#2db675' },
};

/** DD/MM/YYYY, or null when the value is absent or unparseable. */
export function formatObjectDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** MM:SS, or H:MM:SS past the hour; a dash when there is no duration. */
export function formatObjectDuration(seconds?: number): string {
  if (seconds === undefined || seconds === null || Number.isNaN(seconds))
    return '—';
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const ss = String(total % 60).padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${ss}`;
  }
  return `${String(minutes).padStart(2, '0')}:${ss}`;
}

/**
 * Descriptions are stored as rich text. Small surfaces (the hover dossier)
 * print them as a text node rather than rendering markup, so flatten the tags
 * to text. Line structure survives the flattening: breaks and block ends
 * become newlines, and the surface renders them with `white-space: pre-line`,
 * so the hover card shows the same paragraphs the description was written in.
 */
export function htmlToPlainText(html?: string): string {
  if (!html) return '';
  return (
    html
      .replace(/\r\n?/g, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#0?39;|&apos;/gi, "'")
      // Collapse horizontal runs only: \s+ would have eaten the newlines above.
      .replace(/[^\S\n]+/g, ' ')
      .replace(/[^\S\n]*\n[^\S\n]*/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}
