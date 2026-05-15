import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { AppUser } from '@/types/user';
import { findOrCreateConversation } from '@/lib/firestore';
import { router } from 'expo-router';

export function useUserSearch() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [creating, setCreating] = useState(false);

  const currentUser = auth.currentUser!;

  const doSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const term = search.trim().toLowerCase();
      const emailQ = query(collection(db, 'users'), where('email', '==', term));
      const nameQ = query(
        collection(db, 'users'),
        where('displayName', '>=', search.trim()),
        where('displayName', '<=', search.trim() + '\uf8ff'),
      );

      const [emailSnap, nameSnap] = await Promise.all([getDocs(emailQ), getDocs(nameQ)]);
      const map = new Map<string, AppUser>();

      [...emailSnap.docs, ...nameSnap.docs].forEach((d) => {
        const data = d.data() as AppUser;
        if (data.uid !== currentUser.uid) map.set(data.uid, data);
      });

      setResults(Array.from(map.values()));
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (other: AppUser) => {
    setCreating(true);
    try {
      const convoId = await findOrCreateConversation(
        currentUser.uid,
        currentUser.email!,
        currentUser.displayName ?? currentUser.email!,
        other.uid,
        other.email,
        other.displayName,
      );
      router.replace(`/chats/${convoId}`);
    } finally {
      setCreating(false);
    }
  };

  return {
    search,
    setSearch,
    results,
    loading,
    searched,
    creating,
    doSearch,
    startChat,
  };
}
