import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  query,
  where,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { Message } from '@/types/message';
import { getLastMessagePreview } from '@/utils/messagePreview';

type SendMessagePayload = Omit<Message, 'id' | 'createdAt' | 'status'>;

export async function sendMessage(conversationId: string, payload: SendMessagePayload) {
  const ref = await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
    ...payload,
    status: 'sent',
    createdAt: serverTimestamp(),
  });

  const preview = getLastMessagePreview(payload);

  await updateDoc(doc(db, 'conversations', conversationId), {
    lastMessage: preview,
    lastMessageAt: serverTimestamp(),
  });

  return ref.id;
}

export async function findOrCreateConversation(
  currentUid: string,
  currentEmail: string,
  currentDisplayName: string,
  otherUid: string,
  otherEmail: string,
  otherDisplayName: string,
): Promise<string> {
  // Check if conversation already exists between these two users
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', currentUid),
  );
  const snap = await getDocs(q);
  const existing = snap.docs.find((d) => {
    const p = d.data().participants as string[];
    return p.includes(otherUid);
  });

  if (existing) return existing.id;

  // Create new conversation
  const newRef = doc(collection(db, 'conversations'));
  await setDoc(newRef, {
    participants: [currentUid, otherUid],
    participantNames: {
      [currentUid]: currentDisplayName,
      [otherUid]: otherDisplayName,
    },
    participantEmails: {
      [currentUid]: currentEmail,
      [otherUid]: otherEmail,
    },
    lastMessage: null,
    lastMessageAt: serverTimestamp(),
    typing: {},
  });

  return newRef.id;
}
