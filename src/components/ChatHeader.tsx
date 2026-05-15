import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';

interface Props {
  otherName: string;
  otherIsTyping: boolean;
  searchVisible: boolean;
  setSearchVisible: (v: boolean | ((v: boolean) => boolean)) => void;
  searchTerm: string;
  setSearchTerm: (t: string) => void;
  searchLoading: boolean;
  noResults: boolean;
}

export function ChatHeader({
  otherName,
  otherIsTyping,
  searchVisible,
  setSearchVisible,
  searchTerm,
  setSearchTerm,
  searchLoading,
  noResults,
}: Props) {
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerName}>{otherName}</Text>
          {otherIsTyping && <Text style={styles.typingLabel}>typing...</Text>}
        </View>
        <TouchableOpacity
          onPress={() => {
            setSearchVisible((v) => !v);
            setSearchTerm('');
          }}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {searchVisible && (
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus
          />
          {searchLoading && (
            <ActivityIndicator size="small" color="#222" style={{ marginRight: 8 }} />
          )}
          {noResults && <Text style={styles.noResults}>No results</Text>}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: '#222' },
  headerCenter: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '700', color: '#111' },
  typingLabel: { fontSize: 11, color: '#9ca3af', marginTop: 1 },
  searchIcon: { fontSize: 20, padding: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  noResults: { fontSize: 12, color: '#9ca3af' },
});
