import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { REACTION_OPTIONS, ReactionId } from '@/utils/reactions';

interface Props {
  visible: boolean;
  onSelect: (reactionId: ReactionId) => void;
  onClose: () => void;
}

export function ReactionPicker({ visible, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.picker}>
          {REACTION_OPTIONS.map((reaction) => (
            <TouchableOpacity
              key={reaction.id}
              onPress={() => {
                onSelect(reaction.id);
                onClose();
              }}
              style={styles.reactionBtn}
            >
              <Ionicons name={reaction.icon} size={26} color={reaction.color} />
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
  reactionBtn: { padding: 6 },
});
