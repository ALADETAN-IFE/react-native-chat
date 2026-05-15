import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '@/types/message';
import { AudioRecorder } from './AudioMessage';

interface Props {
  text: string;
  setText: (t: string) => void;
  onTyping: () => void;
  handleSend: () => void;
  editingMessage: Message | null;
  onCancelEdit: () => void;
  onPickMedia: (type: 'image' | 'video') => void;
  onAudioRecorded: (uri: string, duration: number) => void;
}

export function ChatComposer({
  text,
  setText,
  onTyping,
  handleSend,
  editingMessage,
  onCancelEdit,
  onPickMedia,
  onAudioRecorded,
}: Props) {
  return (
    <View style={styles.container}>
      {editingMessage && (
        <View style={styles.editBanner}>
          <View style={styles.editBannerLabel}>
            <Ionicons name="create-outline" size={16} color="#1d4ed8" />
            <Text style={styles.editBannerText}>Editing message</Text>
          </View>
          <TouchableOpacity onPress={onCancelEdit}>
            <Text style={styles.editCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.composer}>
        {!editingMessage && (
          <>
            <TouchableOpacity
              onPress={() => onPickMedia('image')}
              style={styles.mediaBtn}
            >
              <Ionicons name="image-outline" size={22} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPickMedia('video')}
              style={styles.mediaBtn}
            >
              <Ionicons name="videocam-outline" size={22} color="#374151" />
            </TouchableOpacity>
            <AudioRecorder onRecorded={onAudioRecorded} />
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder={editingMessage ? 'Edit message...' : 'Message'}
          value={text}
          onChangeText={(t) => {
            setText(t);
            onTyping();
          }}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <Ionicons
            name={editingMessage ? 'checkmark' : 'arrow-up'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  editBanner: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#bfdbfe',
  },
  editBannerLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  editBannerText: { fontSize: 13, color: '#1d4ed8' },
  editCancelText: { fontSize: 13, color: '#ef4444', fontWeight: '600' },
  composer: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    alignItems: 'flex-end',
  },
  mediaBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 10,
    borderRadius: 20,
    fontSize: 15,
    maxHeight: 100,
    backgroundColor: '#f9fafb',
  },
  sendButton: {
    backgroundColor: '#222',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
