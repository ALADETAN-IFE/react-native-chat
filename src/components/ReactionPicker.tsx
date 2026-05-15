import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

interface Props {
  visible: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ visible, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.picker}>
          {EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => {
                onSelect(emoji);
                onClose();
              }}
              style={styles.emojiBtn}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 10,
    gap: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  emojiBtn: { padding: 6 },
  emoji: { fontSize: 26 },
});
