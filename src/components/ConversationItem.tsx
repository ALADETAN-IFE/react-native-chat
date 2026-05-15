import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/firebase';
import { Conversation } from '@/types/conversation';

interface Props {
  item: Conversation;
}

export function ConversationItem({ item }: Props) {
  const uid = auth.currentUser?.uid;
  const otherUid = item.participants.find((p) => p !== uid);
  const name = otherUid
    ? (item.participantNames?.[otherUid] ??
      item.participantEmails?.[otherUid] ??
      'Unknown')
    : 'Unknown';

  return (
    <TouchableOpacity style={styles.row} onPress={() => router.push(`/chats/${item.id}`)}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name[0]?.toUpperCase() ?? '?'}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowName}>{name}</Text>
        <Text style={styles.rowPreview} numberOfLines={1}>
          {item.lastMessage ?? 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  rowText: { flex: 1 },
  rowName: { fontSize: 15, fontWeight: '700', color: '#111' },
  rowPreview: { fontSize: 13, color: '#6b7280', marginTop: 3 },
});
