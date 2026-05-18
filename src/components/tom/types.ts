export interface TomAttachment {
  id: string;
  name: string;
  type: 'image' | 'text';
  dataUrl: string;
  content?: string;
}

export interface TomMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: TomAttachment[];
  // Set when the assistant message ended in an error — UI can render a retry
  // affordance against the offending user message.
  errored?: boolean;
}

export interface TomChat {
  // Server-issued conversation id. Persisted across reloads.
  id: string;
  title: string;
  // Empty until the chat is opened — history is fetched on demand.
  messages: TomMessage[];
  // Numeric epoch for sorting; derived from server `createdAt` string.
  createdAt: number;
  updatedAt: number;
  // Marks chats that we have already fetched history for, so we don't refetch
  // on every selection.
  historyLoaded?: boolean;
}
