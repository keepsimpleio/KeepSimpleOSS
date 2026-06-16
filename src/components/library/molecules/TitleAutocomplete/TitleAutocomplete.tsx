import React, { JSX, useEffect, useId, useRef, useState } from 'react';

import type { IAutofillSuggestion } from '@local-types/library/autofill';

import { Text, TypographyVariant } from '@components/library/atoms/Text';
import { Input } from '@components/library/molecules/Input';

import type { TitleAutocompleteProps } from './TitleAutocomplete.types';

import styles from './TitleAutocomplete.module.scss';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 3;

function suggestionMeta(s: IAutofillSuggestion): string {
  const year = s.publicationDate?.slice(0, 4);
  return [s.author, year].filter(Boolean).join(' · ');
}

export function TitleAutocomplete(props: TitleAutocompleteProps): JSX.Element {
  const {
    registration,
    ariaLabel,
    placeholder,
    placeholderColor,
    fetchSuggestions,
    onSelect,
  } = props;

  const [suggestions, setSuggestions] = useState<IAutofillSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'empty' | 'error'>('idle');
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);
  // Title applied via a suggestion click — don't reopen the menu for it.
  const suppressQueryRef = useRef<string | null>(null);
  const listboxId = useId();

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
    setStatus('idle');
  };

  // Close on any press outside the wrapper (options use onPointerDown, so
  // selection wins the race against this listener).
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      requestIdRef.current += 1; // discard in-flight responses on unmount
    };
  }, []);

  const queueSearch = (query: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    const trimmed = query.trim();

    if (suppressQueryRef.current === trimmed) return;
    suppressQueryRef.current = null;

    if (trimmed.length < MIN_QUERY_LENGTH) {
      requestIdRef.current += 1;
      setIsLoading(false);
      setStatus('idle');
      close();
      setSuggestions([]);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      setIsLoading(true);
      setIsOpen(true);
      try {
        const results = await fetchSuggestions(trimmed);
        if (requestId !== requestIdRef.current) return;
        setSuggestions(results);
        setStatus(results.length === 0 ? 'empty' : 'idle');
      } catch {
        // Keep the menu open with an error line instead of silently closing,
        // so a provider outage (e.g. Google Books quota) reads as "unavailable"
        // rather than an indistinguishable "no matches".
        if (requestId !== requestIdRef.current) return;
        setSuggestions([]);
        setStatus('error');
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          setActiveIndex(-1);
        }
      }
    }, DEBOUNCE_MS);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    registration.onChange(event);
    queueSearch(event.target.value);
  };

  const select = (suggestion: IAutofillSuggestion) => {
    suppressQueryRef.current = suggestion.title.trim();
    requestIdRef.current += 1;
    setIsLoading(false);
    close();
    onSelect(suggestion);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (event.key === 'Escape') close();
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(
          prev => (prev - 1 + suggestions.length) % suggestions.length,
        );
        break;
      case 'Enter':
        if (activeIndex >= 0) {
          event.preventDefault();
          select(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        close();
        break;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={listboxId}
    >
      <Input
        type="text"
        ariaLabel={ariaLabel}
        placeholder={placeholder}
        placeholderColor={placeholderColor}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls={listboxId}
        {...registration}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <ul className={styles.menu} role="listbox" id={listboxId}>
          {isLoading && suggestions.length === 0 && (
            <li className={styles.status}>
              <Text variant={TypographyVariant.TextSmall}>Searching…</Text>
            </li>
          )}
          {!isLoading && status === 'empty' && (
            <li className={styles.status}>
              <Text variant={TypographyVariant.TextSmall}>
                No matches found.
              </Text>
            </li>
          )}
          {!isLoading && status === 'error' && (
            <li className={styles.status}>
              <Text variant={TypographyVariant.TextSmall}>
                Search is unavailable right now — please fill the details
                manually.
              </Text>
            </li>
          )}
          {suggestions.map((suggestion, index) => {
            const meta = suggestionMeta(suggestion);
            return (
              <li
                key={`${suggestion.title}-${suggestion.sourceUrl ?? index}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  className={
                    index === activeIndex
                      ? `${styles.option} ${styles.active}`
                      : styles.option
                  }
                  onPointerDown={event => {
                    // Select on pointerdown so the input's blur (and the
                    // outside-press close above) can't swallow the click.
                    event.preventDefault();
                    select(suggestion);
                  }}
                >
                  {suggestion.coverUrl ? (
                    // Provider CDNs block direct browser hotlinking, so the
                    // thumbnail loads through the same allowlisted proxy as the
                    // autofilled cover (which also warms its 24h cache).
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/library/autofill/cover?url=${encodeURIComponent(
                        suggestion.coverUrl,
                      )}`}
                      alt=""
                      className={styles.thumb}
                      loading="lazy"
                    />
                  ) : (
                    <span className={styles.thumbPlaceholder} />
                  )}
                  <span className={styles.optionText}>
                    <Text
                      variant={TypographyVariant.TextSmall}
                      className={styles.optionTitle}
                    >
                      {suggestion.title}
                    </Text>
                    {meta && (
                      <Text
                        variant={TypographyVariant.TextTiny}
                        className={styles.optionMeta}
                      >
                        {meta}
                      </Text>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
