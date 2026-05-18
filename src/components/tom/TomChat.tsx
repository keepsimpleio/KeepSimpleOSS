import { FC, useEffect, useState } from 'react';

import TomInput from './TomInput';
import TomMessages from './TomMessages';
import TomSidebar from './TomSidebar';
import useTomChat from './useTomChat';

import styles from './TomChat.module.scss';

const TomChat: FC = () => {
  const {
    activeChat,
    activeChatId,
    todayChats,
    recentChats,
    canCreateChat,
    isLoading,
    isFeatureDisabled,
    isDailyCapped,
    lastError,
    createChat,
    selectChat,
    deleteChat,
    sendMessage,
    dismissError,
  } = useTomChat();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    if (mq.matches) setSidebarOpen(false);

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleSelectChat = (id: string) => {
    selectChat(id);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  const handleNewChat = () => {
    createChat();
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  if (isFeatureDisabled) {
    return (
      <div className={`tom-root ${styles.root}`}>
        <div className={styles.main}>
          <div className={styles.welcome}>
            <img
              src="/assets/tom/tom_img.png"
              alt="Friendly Tom"
              className={styles.welcomeAvatar}
            />
            <h1 className={styles.welcomeTitle}>Friendly Tom</h1>
            <p className={styles.welcomeSubtitle}>Because you matter</p>
            <p className={styles.welcomeTagline}>
              Longevity GPT is not available on your account yet.
              <br />
              Check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasMessages = activeChat && activeChat.messages.length > 0;
  // Per Strapi feature-flag guidance: render entry point optimistically on
  // first load — only a real 403 should disable. So isInitializing is not in
  // this gate; it flows to the disabled-screen takeover via isFeatureDisabled.
  const inputDisabled = isLoading || isDailyCapped;

  return (
    <div className={`tom-root ${styles.root}`}>
      <TomSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        onClose={() => setSidebarOpen(false)}
        todayChats={todayChats}
        recentChats={recentChats}
        activeChatId={activeChatId}
        canCreateChat={canCreateChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={deleteChat}
      />

      <div className={styles.main}>
        {!sidebarOpen && (
          <button
            className={styles.mobileToggle}
            onClick={() => setSidebarOpen(true)}
            title="Open chat history"
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
        )}

        {lastError && (
          <div className={styles.banner} role="alert">
            <span>{lastError.message}</span>
            <button
              className={styles.bannerClose}
              onClick={dismissError}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {hasMessages ? (
          <TomMessages messages={activeChat.messages} isLoading={isLoading} />
        ) : (
          <div className={styles.welcome}>
            <img
              src="/assets/tom/tom_img.png"
              alt="Friendly Tom"
              className={styles.welcomeAvatar}
            />
            <h1 className={styles.welcomeTitle}>Friendly Tom</h1>
            <p className={styles.welcomeSubtitle}>Because you matter</p>
            <p className={styles.welcomeTagline}>
              Do your best on living longer.
              <br />
              Enjoy watching your foes leave this world first.
            </p>
          </div>
        )}

        <TomInput
          onSend={sendMessage}
          disabled={inputDisabled}
          disabledReason={
            isDailyCapped
              ? "You've reached today's message limit. Come back tomorrow."
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default TomChat;
