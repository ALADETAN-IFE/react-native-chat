import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { Message } from '@/types/message';

export default function ChatRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, 'conversations', id, 'messages'),
      orderBy('createdAt', 'asc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, 'id'>) })),
      );
    });
    return unsub;
  }, [id]);

  const send = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !id || !text.trim()) return;
    const body = text;
    setText('');
    await addDoc(collection(db, 'conversations', id, 'messages'), {
      senderId: uid,
      text: body,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'conversations', id), {
      lastMessage: body,
      lastMessageAt: serverTimestamp(),
    });
  };

  const currentUid = auth.currentUser?.uid;

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const mine = item.senderId === currentUid;
          return (
            <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
              <Text style={mine ? styles.textMine : styles.textTheirs}>{item.text}</Text>
            </View>
          );
        }}
      />
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={send}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  list: { padding: 12, gap: 6 },
  bubble: { padding: 10, borderRadius: 8, maxWidth: '75%' },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: '#222' },
  bubbleTheirs: { alignSelf: 'flex-start', backgroundColor: '#eee' },
  textMine: { color: '#fff' },
  textTheirs: { color: '#111' },
  composer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6 },
  sendButton: {
    backgroundColor: '#222',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 6,
  },
  sendText: { color: '#fff', fontWeight: '600' },
});
