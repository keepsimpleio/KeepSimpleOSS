// motion-passport: exempt — a data hook; the shelf it feeds carries the motion.
import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  BannedBook,
  RecommendedPreference,
  RecommendedShelfState,
} from '@local-types/library/recommendation';

import {
  banAiShelfPick,
  getAiShelf,
  lockAiShelfPick,
  rollAiShelf,
  setAiShelfPreference,
} from '@api/library/aiShelf';

/**
 * The owner's AI shelf: what stands on it, and the four things the owner
 * can do to it. Arriving costs no model call once a board exists; the first
 * one the shelf rolls itself, so the first arrival on a library of thirty
 * books waits for the engine.
 *
 * A verdict goes to the server and the server's answer is what the board
 * then shows, except the lock, which flips at once and is corrected if the
 * write fails: a lock is a small, reversible thing and waiting for it reads
 * as a dead button.
 *
 * A roll is not waited on. It takes longer than a gateway holds a request
 * open, so the route starts it and answers "rolling"; this hook then asks
 * again every few seconds until the board stands. The shelf shows its
 * working state throughout, so the wait is visible rather than silent.
 */

/** How often the shelf asks whether the board has landed. */
const POLL_MS = 4000;
/** Long enough for the slowest roll seen, then the shelf stops asking. */
const POLL_LIMIT = 90;

export interface AiShelf {
  state: RecommendedShelfState | null;
  loading: boolean;
  rolling: boolean;
  busy: boolean;
  error: string | null;
  roll: () => void;
  choosePreference: (preference: RecommendedPreference) => void;
  toggleLock: (pickId: string) => void;
  ban: (pickId: string) => void;
  unban: (book: BannedBook) => void;
}

export function useAiShelf(
  libraryId: number | null,
  enabled: boolean,
): AiShelf {
  const [state, setState] = useState<RecommendedShelfState | null>(null);
  const [loading, setLoading] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sequence = useRef(0);
  const inFlight = useRef(false);
  const polls = useRef(0);

  useEffect(() => {
    if (!enabled || libraryId == null) {
      sequence.current += 1;
      setState(null);
      setLoading(false);
      setError(null);
      return;
    }
    const seq = (sequence.current += 1);
    setLoading(true);
    setError(null);
    getAiShelf(libraryId)
      .then(next => {
        if (seq !== sequence.current) return;
        setState(next);
      })
      .catch((e: unknown) => {
        if (seq !== sequence.current) return;
        setError(e instanceof Error ? e.message : 'The shelf did not answer.');
      })
      .finally(() => {
        if (seq === sequence.current) setLoading(false);
      });
  }, [libraryId, enabled]);

  // While the engine works the shelf asks again on a timer. The count is
  // reset by every arrival of a state that is not a roll in progress, so a
  // second roll gets its own full allowance.
  useEffect(() => {
    if (!enabled || libraryId == null) return;
    if (state?.status !== 'rolling') {
      polls.current = 0;
      return;
    }
    // Out of polls: the roll is either still running past its allowance or
    // it died in a way the server has not noticed. Say so instead of leaving
    // the shelf saying "stocking" for the rest of the session.
    if (polls.current >= POLL_LIMIT) {
      setError(
        'The shelf is still working. Reload the page to see where it got to.',
      );
      return;
    }
    const seq = sequence.current;
    const timer = window.setTimeout(() => {
      polls.current += 1;
      getAiShelf(libraryId)
        .then(next => {
          if (seq === sequence.current) setState(next);
        })
        .catch(() => {
          /* a missed poll is not an error; the next one asks again */
        });
    }, POLL_MS);
    return () => window.clearTimeout(timer);
  }, [state, enabled, libraryId]);

  /** One write at a time: the board is a single object on the server and
   * two writes racing would each answer with half the other's work. */
  const write = useCallback(
    (
      task: (id: number) => Promise<RecommendedShelfState>,
      options: { rolling?: boolean } = {},
    ) => {
      if (libraryId == null || inFlight.current) return;
      inFlight.current = true;
      const seq = sequence.current;
      setBusy(true);
      if (options.rolling) setRolling(true);
      setError(null);
      task(libraryId)
        .then(next => {
          if (seq !== sequence.current) return;
          setState(next);
        })
        .catch((e: unknown) => {
          if (seq !== sequence.current) return;
          setError(e instanceof Error ? e.message : 'That did not go through.');
        })
        .finally(() => {
          inFlight.current = false;
          if (seq !== sequence.current) return;
          setBusy(false);
          if (options.rolling) setRolling(false);
        });
    },
    [libraryId],
  );

  const roll = useCallback(() => {
    polls.current = 0;
    write(id => rollAiShelf(id), { rolling: true });
  }, [write]);

  const choosePreference = useCallback(
    (preference: RecommendedPreference) => {
      setState(current => (current ? { ...current, preference } : current));
      write(id => setAiShelfPreference(id, preference));
    },
    [write],
  );

  const toggleLock = useCallback(
    (pickId: string) => {
      const on = !(state?.locked ?? []).includes(pickId);
      setState(current =>
        current
          ? {
              ...current,
              locked: on
                ? [...current.locked, pickId]
                : current.locked.filter(id => id !== pickId),
            }
          : current,
      );
      write(id => lockAiShelfPick(id, pickId, on));
    },
    [state, write],
  );

  const ban = useCallback(
    (pickId: string) => write(id => banAiShelfPick(id, { pickId }, true)),
    [write],
  );

  const unban = useCallback(
    (book: BannedBook) =>
      write(id =>
        banAiShelfPick(id, { title: book.title, author: book.author }, false),
      ),
    [write],
  );

  return {
    state,
    loading,
    rolling: rolling || state?.status === 'rolling',
    busy,
    error,
    roll,
    choosePreference,
    toggleLock,
    ban,
    unban,
  };
}

export default useAiShelf;
