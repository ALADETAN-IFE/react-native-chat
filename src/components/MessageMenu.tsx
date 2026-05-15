import { Modal, Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Message } from '@/types/message';

interface Props {
  visible: boolean;
  onClose: () => void;
  message: Message;
  onEdit: () => void;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
  onReact: () => void;
}

export function MessageMenu({
  visible,
  onClose,
  message,
  onEdit,
  onDeleteForMe,
  onDeleteForEveryone,
  onReact,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.menuBackdrop} onPress={onClose}>
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>Message options</Text>
          {message.type === 'text' && (
            <TouchableOpacity onPress={onEdit} style={styles.menuItem}>
              <Text style={styles.menuItemText}>✏️ Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onReact} style={styles.menuItem}>
            <Text style={styles.menuItemText}>😊 React</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeleteForMe} style={styles.menuItem}>
            <Text style={styles.menuItemText}>🗑️ Delete for me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDeleteForEveryone}
            style={[styles.menuItem, styles.menuItemDanger]}
          >
            <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
              🗑️ Delete for everyone
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    width: 260,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  menuTitle: {
    fontSize: 12,
    color: '#9ca3af',
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: '600',
  },
  menuItem: { paddingHorizontal: 12, paddingVertical: 14, borderRadius: 8 },
  menuItemText: { fontSize: 15, color: '#111' },
  menuItemDanger: { marginTop: 4 },
  menuItemTextDanger: { color: '#ef4444' },
});
