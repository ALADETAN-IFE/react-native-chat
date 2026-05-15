import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message, MessageStatus } from '@/types/message';
import { AudioPlayer } from './AudioMessage';

export function StatusIcon({ status }: { status: MessageStatus }) {
  if (status === 'seen') {
    return <Ionicons name="checkmark-done" size={14} color="#60a5fa" style={styles.statusIcon} />;
  }
  if (status === 'delivered') {
    return (
      <Ionicons
        name="checkmark-done"
        size={14}
        color="rgba(255,255,255,0.6)"
        style={styles.statusIcon}
      />
    );
  }
  return (
    <Ionicons
      name="checkmark"
      size={14}
      color="rgba(255,255,255,0.4)"
      style={styles.statusIcon}
    />
  );
}

export function HighlightedText({
  text,
  term,
  style,
}: {
  text: string;
  term?: string;
  style?: StyleProp<TextStyle>;
}) {
  if (!term || !text.toLowerCase().includes(term.toLowerCase())) {
    return <Text style={style}>{text}</Text>;
  }
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  return (
    <Text style={style}>
      {text.slice(0, idx)}
      <Text style={styles.highlight}>{text.slice(idx, idx + term.length)}</Text>
      {text.slice(idx + term.length)}
    </Text>
  );
}

interface ContentProps {
  message: Message;
  mine: boolean;
  searchTerm?: string;
  onImagePress?: (url: string) => void;
}

export function MessageContent({
  message,
  mine,
  searchTerm,
  onImagePress,
}: ContentProps) {
  if (message.type === 'text' && message.text) {
    return mine ? (
      <Text style={styles.textMine}>{message.text}</Text>
    ) : (
      <HighlightedText text={message.text} term={searchTerm} style={styles.textTheirs} />
    );
  }

  if (message.type === 'audio' && message.mediaUrl) {
    return <AudioPlayer url={message.mediaUrl} duration={message.audioDuration} />;
  }

  if (message.type === 'image' && message.mediaUrl) {
    return (
      <TouchableOpacity onPress={() => onImagePress?.(message.mediaUrl!)}>
        <Image source={{ uri: message.mediaUrl }} style={styles.media} />
      </TouchableOpacity>
    );
  }

  if (message.type === 'video') {
    return (
      <TouchableOpacity onPress={() => onImagePress?.(message.mediaUrl!)}>
        <View style={styles.videoThumb}>
          {message.thumbnailUrl ? (
            <Image source={{ uri: message.thumbnailUrl }} style={styles.media} />
          ) : (
            <View style={[styles.media, styles.videoPlaceholder]} />
          )}
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={32} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  textMine: { color: '#fff', fontSize: 15 },
  textTheirs: { color: '#111', fontSize: 15 },
  highlight: { backgroundColor: '#fde68a', color: '#111' },
  statusIcon: { alignSelf: 'flex-end', marginTop: 2 },
  media: { width: 200, height: 160, borderRadius: 10 },
  videoThumb: { position: 'relative' },
  videoPlaceholder: { backgroundColor: '#333' },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
  },
});
