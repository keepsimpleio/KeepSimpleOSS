import { useCallback, useEffect, useRef, useState } from 'react';

import type { TomAttachment, TomChat, TomMessage } from './types';

const STORAGE_KEY = 'tom-chats';
const MAX_CHATS_TODAY = 5;
const MAX_RECENT = 20;
const CONTEXT_WINDOW = 5;

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function load(): TomChat[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function persist(chats: TomChat[]) {
  // Strip large base64 dataUrls from image attachments before storing
  const light = chats.map(c => ({
    ...c,
    messages: c.messages.map(m => ({
      ...m,
      attachments: m.attachments?.map(a =>
        a.type === 'image' ? { ...a, dataUrl: '', name: a.name } : a,
      ),
    })),
  }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(light));
  } catch {
    // localStorage full — silently fail
  }
}

export default function useTomChat() {
  const [chats, setChats] = useState<TomChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Keep a ref so streaming callbacks see fresh chats
  const chatsRef = useRef(chats);
  chatsRef.current = chats;

  useEffect(() => {
    setChats(load());
  }, []);

  // Persist on change (skip initial empty state)
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    persist(chats);
  }, [chats]);

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;

  const todayStart = startOfDay();
  const todayChats = chats
    .filter(c => c.createdAt >= todayStart)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const recentChats = chats
    .filter(c => c.createdAt < todayStart)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_RECENT);

  const canCreateChat = todayChats.length < MAX_CHATS_TODAY;

  const createChat = useCallback(() => {
    if (!canCreateChat) return null;
    const chat: TomChat = {
      id: uid(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChats(prev => [chat, ...prev]);
    setActiveChatId(chat.id);
    return chat;
  }, [canCreateChat]);

  const selectChat = useCallback((id: string) => {
    setActiveChatId(id);
  }, []);

  const deleteChat = useCallback(
    (id: string) => {
      setChats(prev => prev.filter(c => c.id !== id));
      if (activeChatId === id) setActiveChatId(null);
    },
    [activeChatId],
  );

  const sendMessage = useCallback(
    async (content: string, attachments?: TomAttachment[]) => {
      const hasContent = content.trim().length > 0;
      const hasAttachments = attachments && attachments.length > 0;
      if (!hasContent && !hasAttachments) return;

      // Auto-create a chat if none is active
      let chatId = activeChatId;
      if (!chatId) {
        if (!canCreateChat) return;
        const title = hasContent
          ? content.trim().slice(0, 50)
          : `Image: ${attachments![0].name}`;
        const newChat: TomChat = {
          id: uid(),
          title,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        chatId = newChat.id;
      }

      const userMsg: TomMessage = {
        id: uid(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
        attachments: attachments?.length ? attachments : undefined,
      };

      // Add user message and update title if first message
      setChats(prev =>
        prev.map(c => {
          if (c.id !== chatId) return c;
          return {
            ...c,
            messages: [...c.messages, userMsg],
            title:
              c.messages.length === 0
                ? hasContent
                  ? content.trim().slice(0, 50)
                  : `Image: ${attachments![0].name}`
                : c.title,
            updatedAt: Date.now(),
          };
        }),
      );

      setIsLoading(true);

      // Build context — last N messages
      const chat = chatsRef.current.find(c => c.id === chatId);
      const allMsgs = [...(chat?.messages ?? []), userMsg];
      const contextMessages = allMsgs.slice(-CONTEXT_WINDOW).map(m => {
        // If message has image attachments, include them for vision
        if (m.attachments?.some(a => a.type === 'image')) {
          const parts: Array<
            | { type: 'text'; text: string }
            | { type: 'image_url'; image_url: { url: string; detail?: string } }
          > = [
            {
              type: 'text',
              text: m.content || 'What do you think about this image?',
            },
          ];
          m.attachments
            .filter(a => a.type === 'image')
            .forEach(a => {
              parts.push({
                type: 'image_url',
                image_url: { url: a.dataUrl, detail: 'auto' },
              });
            });
          // Include text file content inline
          m.attachments
            .filter(a => a.type === 'text')
            .forEach(a => {
              parts.push({
                type: 'text',
                text: `[File: ${a.name}]\n${a.content}`,
              });
            });
          return { role: m.role, content: parts };
        }
        // Text-only or text file attachments
        let text = m.content;
        if (m.attachments?.some(a => a.type === 'text')) {
          m.attachments
            .filter(a => a.type === 'text')
            .forEach(a => {
              text += `\n\n[File: ${a.name}]\n${a.content}`;
            });
        }
        return { role: m.role, content: text };
      });

      const assistantMsg: TomMessage = {
        id: uid(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      // Add placeholder assistant message
      setChats(prev =>
        prev.map(c => {
          if (c.id !== chatId) return c;
          return {
            ...c,
            messages: [...c.messages, assistantMsg],
            updatedAt: Date.now(),
          };
        }),
      );

      try {
        const res = await fetch('/api/tom/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: contextMessages }),
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No stream reader');

        const decoder = new TextDecoder();
        let accumulated = '';
        let sseBuffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          sseBuffer += decoder.decode(value, { stream: true });
          const lines = sseBuffer.split('\n');
          sseBuffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);
            if (data === '[DONE]') break;

            try {
              const { content: token } = JSON.parse(data);
              if (token) {
                accumulated += token;
                const text = accumulated; // capture for closure
                setChats(prev =>
                  prev.map(c => {
                    if (c.id !== chatId) return c;
                    return {
                      ...c,
                      messages: c.messages.map(m =>
                        m.id === assistantMsg.id ? { ...m, content: text } : m,
                      ),
                    };
                  }),
                );
              }
            } catch {
              // skip
            }
          }
        }
      } catch (err) {
        console.error('Tom chat error:', err);
        setChats(prev =>
          prev.map(c => {
            if (c.id !== chatId) return c;
            return {
              ...c,
              messages: c.messages.map(m =>
                m.id === assistantMsg.id
                  ? {
                      ...m,
                      content:
                        'Sorry, I had trouble responding. Please try again.',
                    }
                  : m,
              ),
            };
          }),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeChatId, canCreateChat],
  );

  return {
    chats,
    activeChat,
    activeChatId,
    todayChats,
    recentChats,
    canCreateChat,
    isLoading,
    createChat,
    selectChat,
    deleteChat,
    sendMessage,
  };
}
