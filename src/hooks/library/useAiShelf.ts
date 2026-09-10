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
 */

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

  const roll = useCallback(
    () => write(id => rollAiShelf(id), { rolling: true }),
    [write],
  );

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
    rolling,
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
