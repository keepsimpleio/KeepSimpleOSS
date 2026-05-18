import {
  ClipboardEvent,
  FC,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from 'react';

import type { TomAttachment } from './types';

import styles from './TomInput.module.scss';

const MAX_CHARS = 4000;
const COUNTER_VISIBLE_AT = 3500;

interface Props {
  onSend: (content: string, attachments?: TomAttachment[]) => void;
  disabled: boolean;
  disabledReason?: string;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const ACCEPTED = 'image/png,image/jpeg,image/gif,image/webp,text/plain,.txt';

const TomInput: FC<Props> = ({ onSend, disabled, disabledReason }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<TomAttachment[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(prev => [
          ...prev,
          {
            id: uid(),
            name: file.name,
            type: 'image',
            dataUrl: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments(prev => [
          ...prev,
          {
            id: uid(),
            name: file.name,
            type: 'text',
            dataUrl: '',
            content: reader.result as string,
          },
        ]);
      };
      reader.readAsText(file);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const canSubmit =
    !disabled && text.trim().length > 0 && text.length <= MAX_CHARS;

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    onSend(text, attachments.length > 0 ? attachments : undefined);
    setText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleFile(file);
        return;
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  };

  const handleTextChange = (value: string) => {
    // Hard-cap at MAX_CHARS so a paste of 10k characters can't ever bypass.
    setText(value.length > MAX_CHARS ? value.slice(0, MAX_CHARS) : value);
    autoResize();
  };

  const showCounter = text.length >= COUNTER_VISIBLE_AT;
  const overLimit = text.length >= MAX_CHARS;

  return (
    <div className={styles.wrapper}>
      {attachments.length > 0 && (
        <div className={styles.previews}>
          {attachments.map(a => (
            <div key={a.id} className={styles.preview}>
              {a.type === 'image' ? (
                <img
                  src={a.dataUrl}
                  alt={a.name}
                  className={styles.previewImg}
                />
              ) : (
                <div className={styles.previewFile}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>{a.name}</span>
                </div>
              )}
              <button
                className={styles.removeBtn}
                onClick={() => removeAttachment(a.id)}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <button
          type="button"
          className={styles.attachBtn}
          onClick={() => fileRef.current?.click()}
          title="Attach image or .txt file"
          disabled={disabled}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED}
          className={styles.fileInput}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />

        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={e => handleTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={disabledReason ?? 'Ask anything...'}
          rows={1}
          maxLength={MAX_CHARS}
          disabled={disabled}
          aria-invalid={overLimit || undefined}
        />

        <button
          type="submit"
          className={`${styles.sendBtn} ${canSubmit ? styles.sendActive : ''}`}
          disabled={!canSubmit}
          title="Send message"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>

      <div className={styles.footer}>
        <p className={styles.disclaimer}>AI may make mistakes.</p>
        {showCounter && (
          <span
            className={`${styles.counter} ${overLimit ? styles.counterOver : ''}`}
            aria-live="polite"
          >
            {text.length} / {MAX_CHARS}
          </span>
        )}
      </div>
    </div>
  );
};

export default TomInput;
