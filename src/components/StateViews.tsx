import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#222" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  loadingText: { color: '#6b7280', fontSize: 14, marginTop: 8 },
  errorIcon: { fontSize: 40 },
  errorText: { color: '#374151', fontSize: 15, textAlign: 'center' },
  retryBtn: {
    backgroundColor: '#222',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { color: '#111', fontSize: 17, fontWeight: '600', textAlign: 'center' },
  emptySubtitle: { color: '#6b7280', fontSize: 14, textAlign: 'center' },
});
