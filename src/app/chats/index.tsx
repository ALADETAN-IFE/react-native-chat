import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { Conversation } from '@/types/conversation';

export default function ChatsList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', uid),
      orderBy('lastMessageAt', 'desc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setConversations(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Conversation, 'id'>) })),
      );
    });
    return unsub;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push(`/chats/${item.id}`)}
          >
            <Text style={styles.title}>{item.id}</Text>
            <Text style={styles.subtitle}>{item.lastMessage ?? ''}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  row: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontWeight: '600', fontSize: 16 },
  subtitle: { color: '#666', marginTop: 4 },
});
