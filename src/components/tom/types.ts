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
}

export interface TomChat {
  id: string;
  title: string;
  messages: TomMessage[];
  createdAt: number;
  updatedAt: number;
}
