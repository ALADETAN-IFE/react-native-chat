import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { Conversation } from '@/types/conversation';
import { useChatStore } from '@/stores/chatStore';

export function useConversations() {
  const { conversations, setConversations } = useChatStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', uid),
      orderBy('lastMessageAt', 'desc'),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setConversations(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Conversation, 'id'>) })),
        );
        setLoading(false);
      },
      (err: Error) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, [setConversations]);

  return { conversations, loading, error };
}
