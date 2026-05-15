import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { arrayUnion, arrayRemove, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Message } from '@/types/message';
import { ReactionPicker } from './ReactionPicker';
import { ReactionIcon } from './ReactionIcon';
import { MessageMenu } from './MessageMenu';
import { MessageContent, StatusIcon } from './MessageContent';

interface Props {
  message: Message;
  conversationId: string;
  currentUid: string;
  searchTerm?: string;
  onImagePress?: (url: string) => void;
  onEditPress?: (message: Message) => void;
}

export function MessageBubble({
  message,
  conversationId,
  currentUid,
  searchTerm,
  onImagePress,
  onEditPress,
}: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const mine = message.senderId === currentUid;

  // Hide if deleted for current user
  if (message.deletedFor?.includes(currentUid)) return null;

  const msgRef = doc(db, 'conversations', conversationId, 'messages', message.id);

  const handleReaction = async (reactionKey: string) => {
    const alreadyReacted = message.reactions?.[reactionKey]?.includes(currentUid);
    await updateDoc(msgRef, {
      [`reactions.${reactionKey}`]: alreadyReacted
        ? arrayRemove(currentUid)
        : arrayUnion(currentUid),
    });
  };

  const handleDeleteForMe = async () => {
    setMenuVisible(false);
    await updateDoc(msgRef, { deletedFor: arrayUnion(currentUid) });
  };

  const handleDeleteForEveryone = async () => {
    setMenuVisible(false);
    await deleteDoc(msgRef);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    onEditPress?.(message);
  };

  const reactions = message.reactions ?? {};
  const reactionEntries = Object.entries(reactions).filter(([, uids]) => uids.length > 0);

  return (
    <View style={[styles.wrapper, mine ? styles.wrapperMine : styles.wrapperTheirs]}>
      <TouchableOpacity
        onLongPress={() => (mine ? setMenuVisible(true) : setPickerVisible(true))}
        activeOpacity={0.85}
      >
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <MessageContent
            message={message}
            mine={mine}
            searchTerm={searchTerm}
            onImagePress={onImagePress}
          />

          {/* Edited label */}
          {message.edited && <Text style={styles.editedLabel}>edited</Text>}

          {/* Status (mine only) */}
          {mine && <StatusIcon status={message.status} />}
        </View>
      </TouchableOpacity>

      {/* Reactions display */}
      {reactionEntries.length > 0 && (
        <View style={styles.reactionsRow}>
          {reactionEntries.map(([reactionKey, uids]) => (
            <TouchableOpacity
              key={reactionKey}
              onPress={() => handleReaction(reactionKey)}
              style={styles.reactionBadge}
            >
              <ReactionIcon reactionKey={reactionKey} size={14} />
              <Text style={styles.reactionCount}>{uids.length}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ReactionPicker
        visible={pickerVisible}
        onSelect={handleReaction}
        onClose={() => setPickerVisible(false)}
      />

      <MessageMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        message={message}
        onEdit={handleEdit}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={handleDeleteForEveryone}
        onReact={() => {
          setMenuVisible(false);
          setPickerVisible(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 2, paddingHorizontal: 12 },
  wrapperMine: { alignItems: 'flex-end' },
  wrapperTheirs: { alignItems: 'flex-start' },
  bubble: { padding: 10, borderRadius: 16, maxWidth: '78%' },
  bubbleMine: { backgroundColor: '#222', borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: '#eee', borderBottomLeftRadius: 4 },
  editedLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  reactionsRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reactionCount: { fontSize: 11, color: '#374151', fontWeight: '600' },
});
