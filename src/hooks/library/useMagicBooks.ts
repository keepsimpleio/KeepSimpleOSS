// motion-passport: exempt — a data hook; the card it feeds carries the motion.
import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  MagicBook,
  MagicShelfResult,
} from '@local-types/library/magicBook';

import {
  getMagicBooks,
  rerollMagicBook,
} from '@api/library/magic/getMagicBooks';

/**
 * The magic books of one library, one per book shelf. Arriving reads what
 * the engine's store already holds and costs no model call; a shelf with
 * nothing stands idle until the owner rolls it, one shelf at a time. This
 * hook keeps the picks between renders and marks the shelf being rolled.
 */

export interface MagicShelfSlot {
  status: 'loading' | 'idle' | 'ready' | 'empty' | 'ineligible' | 'error';
  pick?: MagicBook;
  note?: string;
  /** True while this shelf is being rolled again. */
  rolling: boolean;
  /** Rated books in the library; under the engine's threshold no percent. */
  ratedBooks: number;
  reroll: () => void;
}

interface State {
  loaded: boolean;
  error: string | null;
  ratedBooks: number;
  shelves: Map<number, MagicShelfResult>;
  rolling: Set<number>;
}

export function useMagicBooks(
  libraryId: number | null,
  enabled: boolean,
): (shelfId: number) => MagicShelfSlot | null {
  const [state, setState] = useState<State>({
    loaded: false,
    error: null,
    ratedBooks: 0,
    shelves: new Map(),
    rolling: new Set(),
  });
  const sequence = useRef(0);

  useEffect(() => {
    if (!enabled || libraryId == null) {
      setState({
        loaded: false,
        error: null,
        ratedBooks: 0,
        shelves: new Map(),
        rolling: new Set(),
      });
      return;
    }
    const seq = (sequence.current += 1);
    setState(s => ({ ...s, loaded: false, error: null }));
    getMagicBooks(libraryId)
      .then(response => {
        if (seq !== sequence.current) return;
        setState({
          loaded: true,
          error: null,
          ratedBooks: response.ratedBooks,
          shelves: new Map(response.shelves.map(s => [s.shelfId, s])),
          rolling: new Set(),
        });
      })
      .catch((error: unknown) => {
        if (seq !== sequence.current) return;
        setState(s => ({
          ...s,
          loaded: true,
          error:
            error instanceof Error
              ? error.message
              : 'The magic books could not be read.',
        }));
      });
  }, [libraryId, enabled]);

  const reroll = useCallback(
    (shelfId: number) => {
      if (libraryId == null) return;
      setState(s => {
        if (s.rolling.has(shelfId)) return s;
        const rolling = new Set(s.rolling);
        rolling.add(shelfId);
        return { ...s, rolling };
      });
      const seq = sequence.current;
      rerollMagicBook(libraryId, shelfId)
        .then(response => {
          if (seq !== sequence.current) return;
          setState(s => {
            const shelves = new Map(s.shelves);
            for (const result of response.shelves)
              shelves.set(result.shelfId, result);
            const rolling = new Set(s.rolling);
            rolling.delete(shelfId);
            return { ...s, shelves, rolling, ratedBooks: response.ratedBooks };
          });
        })
        .catch((error: unknown) => {
          if (seq !== sequence.current) return;
          setState(s => {
            const shelves = new Map(s.shelves);
            shelves.set(shelfId, {
              shelfId,
              status: 'empty',
              note:
                error instanceof Error
                  ? error.message
                  : 'The roll did not go through. Try again.',
            });
            const rolling = new Set(s.rolling);
            rolling.delete(shelfId);
            return { ...s, shelves, rolling };
          });
        });
    },
    [libraryId],
  );

  return useCallback(
    (shelfId: number): MagicShelfSlot | null => {
      if (!enabled || libraryId == null) return null;
      const base = {
        rolling: state.rolling.has(shelfId),
        ratedBooks: state.ratedBooks,
      };
      if (!state.loaded) {
        return { ...base, status: 'loading', reroll: () => reroll(shelfId) };
      }
      if (state.error) {
        return {
          ...base,
          status: 'error',
          note: state.error,
          reroll: () => reroll(shelfId),
        };
      }
      const result = state.shelves.get(shelfId);
      if (!result) return null;
      return {
        ...base,
        status: result.status,
        pick: result.pick,
        note: result.note,
        reroll: () => reroll(shelfId),
      };
    },
    [enabled, libraryId, state, reroll],
  );
}
