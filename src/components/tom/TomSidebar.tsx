import { FC } from 'react';

import type { TomChat } from './types';

import styles from './TomSidebar.module.scss';

interface Props {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  todayChats: TomChat[];
  recentChats: TomChat[];
  activeChatId: string | null;
  canCreateChat: boolean;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

const TomSidebar: FC<Props> = ({
  open,
  onToggle,
  onClose,
  todayChats,
  recentChats,
  activeChatId,
  canCreateChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) => {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && <div className={styles.backdrop} onClick={onClose} />}

      <aside
        className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.identity}>
            <img
              src="/keepsimple_/assets/tom/tom_img.png"
              alt="Tom"
              className={styles.avatar}
            />
            <span className={styles.name}>Friendly Tom</span>
          </div>
          <button
            className={styles.collapseBtn}
            onClick={onToggle}
            title="Collapse sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <button
          className={styles.newChat}
          onClick={onNewChat}
          disabled={!canCreateChat}
          title={canCreateChat ? 'New Chat' : 'Daily limit reached (5/day)'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          New Chat
        </button>

        {/* Chat lists */}
        <div className={styles.chatLists}>
          {todayChats.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>TODAY</div>
              {todayChats.map(chat => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  active={chat.id === activeChatId}
                  onSelect={onSelectChat}
                  onDelete={onDeleteChat}
                />
              ))}
            </div>
          )}

          {recentChats.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>RECENTS</div>
              {recentChats.map(chat => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  active={chat.id === activeChatId}
                  onSelect={onSelectChat}
                  onDelete={onDeleteChat}
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const ChatItem: FC<{
  chat: TomChat;
  active: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ chat, active, onSelect, onDelete }) => (
  <div
    className={`${styles.chatItem} ${active ? styles.chatItemActive : ''}`}
    onClick={() => onSelect(chat.id)}
  >
    <span className={styles.chatTitle}>{chat.title}</span>
    <button
      className={styles.deleteBtn}
      onClick={e => {
        e.stopPropagation();
        onDelete(chat.id);
      }}
      title="Delete chat"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
);

export default TomSidebar;
