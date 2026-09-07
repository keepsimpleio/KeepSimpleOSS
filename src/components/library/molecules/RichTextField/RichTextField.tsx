import classNames from 'classnames';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';

import { serializeEditorHtml, toEditorHtml } from '@lib/library/richText';

import { Text, TypographyVariant } from '@components/library/atoms/Text';

import type { RichTextFieldProps } from './RichTextField.types';

import styles from './RichTextField.module.scss';

// motion-passport: exempt. This file carries no animation of its own; the
// mark buttons' state transitions live in RichTextField.module.scss, which
// holds the reduced-motion branch.

type Mark = 'bold' | 'italic' | 'strikeThrough';

const MARKS: { command: Mark; glyph: string; label: string; keys: string }[] = [
  { command: 'bold', glyph: 'B', label: 'Bold', keys: 'Ctrl+B' },
  { command: 'italic', glyph: 'I', label: 'Italic', keys: 'Ctrl+I' },
  {
    command: 'strikeThrough',
    glyph: 'S',
    label: 'Strikethrough',
    keys: 'Ctrl+Shift+X',
  },
];

const EMPTY_MARKS: Record<Mark, boolean> = {
  bold: false,
  italic: false,
  strikeThrough: false,
};

/**
 * The notes editor: a box the writer types into, with bold, italic and
 * strikethrough on the header row beside the label. What it stores is a
 * small HTML dialect (see lib/library/richText), never the browser's raw
 * markup; a paste lands as plain text.
 */
export function RichTextField({
  value,
  onChange,
  label,
  ariaLabel,
  placeholder,
  disabled = false,
  className,
  editorClassName,
}: RichTextFieldProps): JSX.Element {
  const editorRef = useRef<HTMLDivElement>(null);
  // The value this editor last handed out. A prop that matches it came from
  // our own keystroke and must not be written back, or the caret would jump
  // to the start on every character.
  const lastEmitted = useRef<string | null>(null);
  const [marks, setMarks] = useState<Record<Mark, boolean>>(EMPTY_MARKS);
  const [empty, setEmpty] = useState(!value);

  useEffect(() => {
    const el = editorRef.current;
    if (!el || value === lastEmitted.current) return;
    el.innerHTML = toEditorHtml(value);
    lastEmitted.current = value;
    setEmpty(el.textContent?.trim().length === 0);
  }, [value]);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = serializeEditorHtml(el);
    // A box that only holds the browser's leftover <br> reads as empty, and
    // is cleared so the placeholder can show through.
    if (!html && el.innerHTML !== '') el.innerHTML = '';
    setEmpty(!html);
    lastEmitted.current = html;
    onChange(html);
  }, [onChange]);

  const readMarks = useCallback(() => {
    if (typeof document === 'undefined') return;
    const el = editorRef.current;
    if (!el || !el.contains(document.activeElement)) return;
    setMarks({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      strikeThrough: document.queryCommandState('strikeThrough'),
    });
  }, []);

  // The buttons follow the caret: they light up inside a bold run and go out
  // past it.
  useEffect(() => {
    document.addEventListener('selectionchange', readMarks);
    return () => document.removeEventListener('selectionchange', readMarks);
  }, [readMarks]);

  const apply = (command: Mark) => {
    const el = editorRef.current;
    if (!el || disabled) return;
    el.focus();
    document.execCommand(command, false);
    readMarks();
    emit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const meta = e.metaKey || e.ctrlKey;
    if (!meta) return;
    const key = e.key.toLowerCase();
    // Bold and italic are the browser's own shortcuts inside an editable box;
    // strikethrough has none, so it gets one here.
    if (e.shiftKey && key === 'x') {
      e.preventDefault();
      apply('strikeThrough');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className={classNames(styles.field, className)}>
      <div className={styles.header}>
        <Text variant={TypographyVariant.TextSmall} className={styles.label}>
          {label}
        </Text>
        <div className={styles.tools} role="toolbar" aria-label="Text marks">
          {MARKS.map(mark => (
            <button
              key={mark.command}
              type="button"
              className={classNames(styles.tool, styles[mark.command], {
                [styles.toolOn]: marks[mark.command],
              })}
              aria-label={`${mark.label} (${mark.keys})`}
              aria-pressed={marks[mark.command]}
              title={`${mark.label} (${mark.keys})`}
              disabled={disabled}
              // Keep the caret and the selection where they are: a press on
              // the button must not take focus out of the box.
              onMouseDown={e => e.preventDefault()}
              onClick={() => apply(mark.command)}
            >
              {mark.glyph}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={editorRef}
        className={classNames(styles.editor, editorClassName, {
          [styles.empty]: empty,
          [styles.disabled]: disabled,
        })}
        contentEditable={!disabled}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel}
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        onKeyDown={handleKeyDown}
        onKeyUp={readMarks}
        onMouseUp={readMarks}
        onFocus={readMarks}
        onPaste={handlePaste}
      />
    </div>
  );
}
