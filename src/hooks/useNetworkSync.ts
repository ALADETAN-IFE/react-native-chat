import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useChatStore } from '@/stores/chatStore';

export function useNetworkSync() {
  const { setOnline, offlineQueue, dequeueMessage } = useChatStore();

  useEffect(() => {
    const unsub = NetInfo.addEventListener(async (state) => {
      const online = !!state.isConnected;
      setOnline(online);

      if (online && offlineQueue.length > 0) {
        // Flush the queue
        for (const msg of offlineQueue) {
          try {
            const { conversationId, id, createdAt, ...payload } = msg;
            await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
              ...payload,
              status: 'sent',
              createdAt: serverTimestamp(),
            });

            const preview =
              payload.type === 'text'
                ? payload.text
                : payload.type === 'audio'
                  ? '🎵 Audio message'
                  : payload.type === 'image'
                    ? '📷 Image'
                    : '🎥 Video';

            await updateDoc(doc(db, 'conversations', conversationId), {
              lastMessage: preview,
              lastMessageAt: serverTimestamp(),
            });

            dequeueMessage(id);
          } catch (e: unknown) {
            console.warn('Failed to flush queued message', e);
          }
        }
      }
    });

    return () => unsub();
  }, [offlineQueue, setOnline, dequeueMessage]);
}
