import { Timestamp } from 'firebase/firestore';

export type MessageStatus = 'sent' | 'delivered' | 'seen';

export interface Message {
  id: string;
  senderId: string;
  type: 'text' | 'image' | 'video' | 'audio';
  text?: string;
  mediaUrl?: string;
  audioDuration?: number;
  thumbnailUrl?: string;
  status: MessageStatus;
  createdAt: Timestamp | number; // Can be Timestamp (Firestore) or number (local)
  edited?: boolean;
  deletedFor?: string[];
  reactions?: Record<string, string[]>;
}
