import { Timestamp } from 'firebase/firestore';

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Timestamp;
}
