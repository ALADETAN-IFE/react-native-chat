import { useEffect, useRef } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export function useTypingIndicator(conversationId: string, uid: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTyping = async () => {
    await updateDoc(doc(db, 'conversations', conversationId), {
      [`typing.${uid}`]: true,
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await updateDoc(doc(db, 'conversations', conversationId), {
        [`typing.${uid}`]: false,
      });
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // Clear typing on unmount
      updateDoc(doc(db, 'conversations', conversationId), {
        [`typing.${uid}`]: false,
      }).catch(() => {});
    };
  }, [conversationId, uid]);

  return { onTyping };
}
