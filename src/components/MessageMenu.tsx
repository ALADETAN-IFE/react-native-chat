import { Modal, Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Message } from '@/types/message';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  visible: boolean;
  onClose: () => void;
  message: Message;
  onEdit: () => void;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
  onReact: () => void;
}

function MenuItem({
  icon,
  label,
  danger,
  onPress,
}: {
  icon: IconName;
  label: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <Ionicons name={icon} size={20} color={danger ? '#ef4444' : '#374151'} />
      <Text style={[styles.menuItemText, danger && styles.menuItemTextDanger]}>{label}</Text>
    </TouchableOpacity>
  );
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
            <MenuItem icon="create-outline" label="Edit" onPress={onEdit} />
          )}
          <MenuItem icon="happy-outline" label="React" onPress={onReact} />
          <MenuItem icon="trash-outline" label="Delete for me" onPress={onDeleteForMe} />
          <MenuItem
            icon="trash-outline"
            label="Delete for everyone"
            danger
            onPress={onDeleteForEveryone}
          />
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
  },
  menuItemText: { fontSize: 15, color: '#111' },
  menuItemTextDanger: { color: '#ef4444' },
});
