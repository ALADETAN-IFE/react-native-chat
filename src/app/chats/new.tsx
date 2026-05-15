import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { EmptyState } from '@/components/StateViews';
import { useUserSearch } from '@/hooks/useUserSearch';

export default function NewChat() {
  const { search, setSearch, results, loading, searched, creating, doSearch, startChat } =
    useUserSearch();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Chat</Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Search by name or email"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={doSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={doSearch} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.searchBtnText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      {creating && (
        <View style={styles.creatingRow}>
          <ActivityIndicator size="small" color="#222" />
          <Text style={styles.creatingText}>Opening chat...</Text>
        </View>
      )}

      {searched && !loading && results.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No users found"
          subtitle="Try a different name or email"
        />
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userRow} onPress={() => startChat(item)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.displayName?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{item.displayName}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 56 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: '#222' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  searchRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
    backgroundColor: '#f9fafb',
  },
  searchBtn: {
    backgroundColor: '#222',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
  },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  creatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    justifyContent: 'center',
  },
  creatingText: { color: '#6b7280', fontSize: 13 },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  userName: { fontSize: 15, fontWeight: '600', color: '#111' },
  userEmail: { fontSize: 13, color: '#6b7280', marginTop: 2 },
});
