// The object caps have no dedicated error code — the backend only rejects an
// over-limit create/move with a 400 carrying a message:
// "A shelf cannot have more than 50 objects" for one shelf, and
// "A library cannot hold more than 300 objects" for the whole library. Match
// on the message (number kept flexible so a backend bump doesn't silently
// stop matching) so the UI can swap it for its own copy.
const SHELF_FULL_PATTERN = /shelf cannot have more than \d+ objects/i;
const LIBRARY_FULL_PATTERN = /library cannot hold more than \d+ objects/i;

const rejectionMessage = (err: unknown): string | null => {
  const response = (err as { response?: { status?: number; data?: unknown } })
    ?.response;
  if (response?.status !== 400) return null;
  const message = (response.data as { error?: { message?: string } })?.error
    ?.message;
  return typeof message === 'string' ? message : null;
};

export function isShelfFullError(err: unknown): boolean {
  const message = rejectionMessage(err);
  return message !== null && SHELF_FULL_PATTERN.test(message);
}

export function isLibraryFullError(err: unknown): boolean {
  const message = rejectionMessage(err);
  return message !== null && LIBRARY_FULL_PATTERN.test(message);
}
