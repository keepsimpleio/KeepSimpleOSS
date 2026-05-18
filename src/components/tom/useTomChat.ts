import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createTomChat,
  deleteTomChat,
  getTomChatHistory,
  listTomChats,
  sendTomMessage,
  tomErrorCopy,
  TomGptErrorCode,
} from '@api/tomGpt';

import type { TomAttachment, TomChat, TomMessage } from './types';

const MESSAGE_MAX = 4000;

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function parseCreatedAt(s: string): number {
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : Date.now();
}

function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function defaultTitleFor(createdAt: number): string {
  return new Date(createdAt).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export interface TransientError {
  code: TomGptErrorCode;
  message: string;
}

export default function useTomChat() {
  const [chats, setChats] = useState<TomChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeatureDisabled, setIsFeatureDisabled] = useState(false);
  const [isDailyCapped, setIsDailyCapped] = useState(false);
  const [lastError, setLastError] = useState<TransientError | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const chatsRef = useRef(chats);
  chatsRef.current = chats;

  // Any 403 reached: treat the feature as off for this session.
  const handleErrorCode = useCallback((code: TomGptErrorCode) => {
    if (code === 'FEATURE_DISABLED') setIsFeatureDisabled(true);
  }, []);

  // Fetch the chat list once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await listTomChats();
      if (cancelled) return;
      if ('code' in res) {
        handleErrorCode(res.code);
        if (res.code !== 'FEATURE_DISABLED') {
          setLastError({ code: res.code, message: tomErrorCopy(res.code) });
        }
        setIsInitializing(false);
        return;
      }
      const items = [...res.data.chats]
        .map(c => {
          const ts = parseCreatedAt(c.createdAt);
          return {
            id: c.chatId,
            title: defaultTitleFor(ts),
            messages: [],
            createdAt: ts,
            updatedAt: ts,
            historyLoaded: false,
          } as TomChat;
        })
        .sort((a, b) => b.updatedAt - a.updatedAt);
      setChats(items);
      setIsInitializing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [handleErrorCode]);

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;

  const todayStart = startOfDay();
  const todayChats = chats
    .filter(c => c.createdAt >= todayStart)
    .sort((a, b) => b.updatedAt - a.updatedAt);
  const recentChats = chats
    .filter(c => c.createdAt < todayStart)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const canInteract = !isFeatureDisabled && !isInitializing;
  const canCreateChat = canInteract;

  const createChat = useCallback(async (): Promise<TomChat | null> => {
    if (!canInteract) return null;
    const res = await createTomChat();
    if ('code' in res) {
      handleErrorCode(res.code);
      if (res.code !== 'FEATURE_DISABLED') {
        setLastError({ code: res.code, message: tomErrorCopy(res.code) });
      }
      return null;
    }
    const now = Date.now();
    const chat: TomChat = {
      id: res.data.chatId,
      title: defaultTitleFor(now),
      messages: [],
      createdAt: now,
      updatedAt: now,
      historyLoaded: true, // freshly created — only the seed message exists, which we hide
    };
    setChats(prev => [chat, ...prev]);
    setActiveChatId(chat.id);
    return chat;
  }, [canInteract, handleErrorCode]);

  // Pull full history for a chat and hydrate its messages. System messages
  // and empty-content items (legacy KB-seed input_file etc.) are dropped;
  // we additionally skip the leading assistant welcome message that v1
  // seeds on conversation create. v2 returns an empty array for new chats
  // so this filter is a no-op there.
  const loadHistory = useCallback(
    async (chatId: string) => {
      const res = await getTomChatHistory(chatId);
      if ('code' in res) {
        handleErrorCode(res.code);
        if (res.code !== 'FEATURE_DISABLED') {
          setLastError({ code: res.code, message: tomErrorCopy(res.code) });
        }
        return;
      }
      const visible: TomMessage[] = [];
      let droppedSeedAssistant = false;
      for (const item of res.data.messages) {
        if (item.role === 'system') continue;
        const text = item.content;
        if (!text) continue;
        if (
          !droppedSeedAssistant &&
          item.role === 'assistant' &&
          visible.length === 0
        ) {
          droppedSeedAssistant = true;
          continue;
        }
        visible.push({
          id: uid(),
          role: item.role as 'user' | 'assistant',
          content: text,
          timestamp: Date.now(),
        });
      }
      setChats(prev =>
        prev.map(c => {
          if (c.id !== chatId) return c;
          const firstUser = visible.find(m => m.role === 'user');
          return {
            ...c,
            messages: visible,
            title: firstUser ? firstUser.content.slice(0, 50) : c.title,
            historyLoaded: true,
          };
        }),
      );
    },
    [handleErrorCode],
  );

  const selectChat = useCallback(
    (id: string) => {
      setActiveChatId(id);
      const target = chatsRef.current.find(c => c.id === id);
      if (target && !target.historyLoaded) loadHistory(id);
    },
    [loadHistory],
  );

  const deleteChat = useCallback(
    async (id: string) => {
      // Optimistic removal; restore if the server rejects with anything other
      // than 404 (404 means it's already gone — treat as success).
      const previous = chatsRef.current;
      setChats(prev => prev.filter(c => c.id !== id));
      if (activeChatId === id) setActiveChatId(null);

      const res = await deleteTomChat(id);
      if ('code' in res && res.code !== 'CHAT_NOT_FOUND') {
        handleErrorCode(res.code);
        if (res.code !== 'FEATURE_DISABLED') {
          setLastError({ code: res.code, message: tomErrorCopy(res.code) });
        }
        setChats(previous);
      }
    },
    [activeChatId, handleErrorCode],
  );

  const sendMessage = useCallback(
    async (content: string, attachments?: TomAttachment[]) => {
      const trimmed = content.trim();
      if (!trimmed) return; // Backend requires non-empty `message`.
      if (trimmed.length > MESSAGE_MAX) return; // Input enforces this too.
      if (!canInteract || isDailyCapped) return;

      // Auto-create a conversation if none is active.
      let chatId = activeChatId;
      if (!chatId) {
        const newChat = await createChat();
        if (!newChat) return;
        chatId = newChat.id;
      }

      const userMsg: TomMessage = {
        id: uid(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
        // Attachments are kept client-side only until backend support lands.
        attachments: attachments?.length ? attachments : undefined,
      };
      const assistantMsg: TomMessage = {
        id: uid(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      setChats(prev =>
        prev.map(c => {
          if (c.id !== chatId) return c;
          return {
            ...c,
            messages: [...c.messages, userMsg, assistantMsg],
            title: c.messages.length === 0 ? trimmed.slice(0, 50) : c.title,
            updatedAt: Date.now(),
          };
        }),
      );

      setIsLoading(true);

      // Stream consumer. Yields incremental `delta` events terminated by
      // `done` or `error`.
      let accumulated = '';
      for await (const ev of sendTomMessage(chatId, trimmed)) {
        if (ev.type === 'delta') {
          accumulated += ev.text;
          setChats(prev =>
            prev.map(c => {
              if (c.id !== chatId) return c;
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsg.id ? { ...m, content: accumulated } : m,
                ),
              };
            }),
          );
        } else if (ev.type === 'error') {
          handleErrorCode(ev.code);
          const message = ev.message || tomErrorCopy(ev.code);
          if (ev.code !== 'FEATURE_DISABLED') {
            setLastError({ code: ev.code, message });
          }
          if (ev.code === 'RATE_LIMITED') setIsDailyCapped(true);
          setChats(prev =>
            prev.map(c => {
              if (c.id !== chatId) return c;
              return {
                ...c,
                messages: c.messages.map(m =>
                  m.id === assistantMsg.id
                    ? {
                        ...m,
                        content: accumulated || message,
                        errored: true,
                      }
                    : m,
                ),
              };
            }),
          );
        } else if (ev.type === 'done') {
          setChats(prev =>
            prev.map(c =>
              c.id === chatId ? { ...c, updatedAt: Date.now() } : c,
            ),
          );
        }
      }

      setIsLoading(false);
    },
    [activeChatId, canInteract, createChat, handleErrorCode, isDailyCapped],
  );

  const dismissError = useCallback(() => setLastError(null), []);

  return {
    chats,
    activeChat,
    activeChatId,
    todayChats,
    recentChats,
    canCreateChat,
    isLoading,
    isInitializing,
    isFeatureDisabled,
    isDailyCapped,
    lastError,
    createChat,
    selectChat,
    deleteChat,
    sendMessage,
    dismissError,
  };
}
