import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { MessageBubble } from '@/components/MessageBubble';
import { TypingDots } from '@/components/TypingDots';
import { MediaViewer } from '@/components/MediaViewer';
import { LoadingState, ErrorState } from '@/components/StateViews';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatComposer } from '@/components/ChatComposer';
import { useChatRoom } from '@/hooks/useChatRoom';

export default function ChatRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    currentUid,
    isOnline,
    roomMessages,
    text,
    setText,
    loading,
    error,
    setError,
    uploading,
    searchVisible,
    setSearchVisible,
    searchTerm,
    setSearchTerm,
    searchLoading,
    editingMessage,
    setEditingMessage,
    viewerUri,
    setViewerUri,
    onTyping,
    handleSend,
    handlePickMedia,
    handleAudioRecorded,
    handleEditPress,
    otherIsTyping,
    otherName,
    displayMessages,
  } = useChatRoom(id);

  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (roomMessages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [roomMessages.length]);

  if (loading) return <LoadingState message="Loading messages..." />;
  if (error) return <ErrorState message={error} onRetry={() => setError(null)} />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <ChatHeader
        otherName={otherName}
        otherIsTyping={otherIsTyping}
        searchVisible={searchVisible}
        setSearchVisible={setSearchVisible}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchLoading={searchLoading}
        noResults={searchTerm !== '' && !searchLoading && displayMessages.length === 0}
      />

      {/* Offline banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color="#92400e" />
          <Text style={styles.offlineText}>Offline — messages will be queued</Text>
        </View>
      )}

      {/* Upload indicator */}
      {uploading && (
        <View style={styles.uploadingBanner}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.uploadingText}>Uploading...</Text>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={displayMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            conversationId={id}
            currentUid={currentUid}
            searchTerm={searchTerm}
            onImagePress={(uri) => setViewerUri(uri)}
            onEditPress={handleEditPress}
          />
        )}
        ListEmptyComponent={
          searchTerm ? null : (
            <View style={styles.emptyChat}>
              <Ionicons name="chatbubble-outline" size={40} color="#d1d5db" />
              <Text style={styles.emptyChatText}>No messages yet. Say hi!</Text>
            </View>
          )
        }
      />

      {/* Typing dots */}
      {otherIsTyping && <TypingDots />}

      <ChatComposer
        text={text}
        setText={setText}
        onTyping={onTyping}
        handleSend={handleSend}
        editingMessage={editingMessage}
        onCancelEdit={() => {
          setEditingMessage(null);
          setText('');
        }}
        onPickMedia={handlePickMedia}
        onAudioRecorded={handleAudioRecorded}
      />

      {/* Media fullscreen viewer */}
      <MediaViewer uri={viewerUri} onClose={() => setViewerUri(null)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 56 },
  offlineBanner: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  offlineText: { fontSize: 12, color: '#92400e' },
  uploadingBanner: {
    flexDirection: 'row',
    backgroundColor: '#222',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadingText: { color: '#fff', fontSize: 13 },
  list: { paddingVertical: 12, gap: 2 },
  emptyChat: { flex: 1, alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyChatText: { color: '#9ca3af', fontSize: 14 },
});
