// The shelf-object cap has no dedicated error code — the backend only rejects
// an over-limit create/move with a 400 carrying the message
// "A shelf cannot have more than 21 objects". Match on that message (number
// kept flexible so a backend bump doesn't silently stop matching) so the UI
// can swap it for SHELF_FULL_MESSAGE.
const SHELF_FULL_PATTERN = /shelf cannot have more than \d+ objects/i;

export function isShelfFullError(err: unknown): boolean {
  const response = (err as { response?: { status?: number; data?: unknown } })
    ?.response;
  if (response?.status !== 400) return false;
  const message = (response.data as { error?: { message?: string } })?.error
    ?.message;
  return typeof message === 'string' && SHELF_FULL_PATTERN.test(message);
}
