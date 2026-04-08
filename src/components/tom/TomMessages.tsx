import { FC, ReactNode, useEffect, useRef } from 'react';

import type { TomMessage } from './types';

import styles from './TomMessages.module.scss';

interface Props {
  messages: TomMessage[];
  isLoading: boolean;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Parse **bold** markers into <strong> elements */
function renderText(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

const TomMessages: FC<Props> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className={styles.container}>
      {messages.map(msg => {
        // Hide the empty assistant placeholder while typing dots are shown
        if (msg.role === 'assistant' && !msg.content && isLoading) return null;

        return (
          <div
            key={msg.id}
            className={`${styles.row} ${msg.role === 'user' ? styles.rowUser : styles.rowBot}`}
          >
            {msg.role === 'assistant' && (
              <img
                src="/keepsimple_/assets/tom/tom_img.png"
                alt="Tom"
                className={styles.avatar}
              />
            )}
            <div className={styles.bubble}>
              {/* Attachments */}
              {msg.attachments?.map(a => (
                <div key={a.id} className={styles.attachment}>
                  {a.type === 'image' ? (
                    a.dataUrl ? (
                      <img
                        src={a.dataUrl}
                        alt={a.name}
                        className={styles.attachImg}
                      />
                    ) : (
                      <div className={styles.attachFile}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        {a.name}
                      </div>
                    )
                  ) : (
                    <div className={styles.attachFile}>
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
                      {a.name}
                    </div>
                  )}
                </div>
              ))}
              {msg.content && (
                <div className={styles.text}>{renderText(msg.content)}</div>
              )}
              <div className={styles.time}>{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {isLoading &&
        (!messages.length ||
          messages[messages.length - 1]?.role === 'user' ||
          (messages[messages.length - 1]?.role === 'assistant' &&
            !messages[messages.length - 1]?.content)) && (
          <div className={`${styles.row} ${styles.rowBot}`}>
            <img
              src="/keepsimple_/assets/tom/tom_img.png"
              alt="Tom"
              className={styles.avatar}
            />
            <div className={`${styles.bubble} ${styles.typing}`}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        )}

      <div ref={bottomRef} />
    </div>
  );
};

export default TomMessages;
