import { create } from 'zustand';
import { Message } from '@/types/message';
import { Conversation } from '@/types/conversation';

interface QueuedMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  type: Message['type'];
  mediaUrl?: string;
  thumbnailUrl?: string;
  audioDuration?: number;
  createdAt: number; // timestamp ms
}

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  isOnline: boolean;
  offlineQueue: QueuedMessage[];

  setConversations: (convos: Conversation[]) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  setOnline: (online: boolean) => void;
  enqueueMessage: (msg: QueuedMessage) => void;
  dequeueMessage: (id: string) => void;
  clearQueue: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  messages: {},
  isOnline: true,
  offlineQueue: [],

  setConversations: (conversations) => set({ conversations }),
  setMessages: (conversationId, messages) =>
    set((state) => ({ messages: { ...state.messages, [conversationId]: messages } })),
  setOnline: (isOnline) => set({ isOnline }),
  enqueueMessage: (msg) =>
    set((state) => ({ offlineQueue: [...state.offlineQueue, msg] })),
  dequeueMessage: (id) =>
    set((state) => ({ offlineQueue: state.offlineQueue.filter((m) => m.id !== id) })),
  clearQueue: () => set({ offlineQueue: [] }),
}));
