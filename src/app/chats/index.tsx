import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/firebase';
import { LoadingState, EmptyState } from '@/components/StateViews';
import { useConversations } from '@/hooks/useConversations';
import { ConversationItem } from '@/components/ConversationItem';

export default function ChatsList() {
  const { conversations, loading, error } = useConversations();

  const signOut = async () => {
    await auth.signOut();
    router.replace('/login');
  };

  if (loading) return <LoadingState message="Loading conversations..." />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 Chats</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.newChatBtn}
            onPress={() => router.push('/chats/new')}
          >
            <Text style={styles.newChatIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {!loading && conversations.length === 0 && (
        <EmptyState
          icon="💬"
          title="No conversations yet"
          subtitle="Tap ✏️ to start a new chat"
        />
      )}

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 56 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#111' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  newChatBtn: { padding: 6 },
  newChatIcon: { fontSize: 22 },
  signOutBtn: { padding: 6 },
  signOutText: { color: '#6b7280', fontSize: 14 },
  errorBanner: { backgroundColor: '#fee2e2', padding: 10, margin: 12, borderRadius: 8 },
  errorText: { color: '#991b1b', fontSize: 13 },
});
