import { Timestamp } from 'firebase/firestore';

export interface Conversation {
  id: string;
  participants: string[];
  participantNames?: Record<string, string>;
  participantEmails?: Record<string, string>;
  lastMessage?: string | null;
  lastMessageAt?: Timestamp;
  typing?: Record<string, boolean>;
}
