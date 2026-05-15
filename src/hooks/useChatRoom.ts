import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { auth, db } from '@/firebase';
import { Message } from '@/types/message';
import { Conversation } from '@/types/conversation';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { sendMessage } from '@/lib/firestore';
import { useChatStore } from '@/stores/chatStore';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';

export function useChatRoom(id: string) {
  const currentUid = auth.currentUser?.uid!;
  const { messages, setMessages, isOnline, enqueueMessage } = useChatStore();
  const roomMessages = messages[id] ?? [];

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Search
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Edit
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  // Media viewer
  const [viewerUri, setViewerUri] = useState<string | null>(null);

  const { onTyping } = useTypingIndicator(id, currentUid);

  // Subscribe to conversation doc (for typing indicator)
  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'conversations', id), (snap) => {
      if (snap.exists()) {
        setConversation({ id: snap.id, ...(snap.data() as Omit<Conversation, 'id'>) });
      }
    });
    return unsub;
  }, [id]);

  // Subscribe to messages
  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, 'conversations', id, 'messages'),
      orderBy('createdAt', 'asc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const msgs = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Message, 'id'>),
        }));
        setMessages(id, msgs);
        setLoading(false);

        // Mark incoming messages as seen
        msgs.forEach((msg) => {
          if (msg.senderId !== currentUid && msg.status !== 'seen') {
            updateDoc(doc(db, 'conversations', id, 'messages', msg.id), {
              status: 'seen',
            }).catch(() => {});
          }
        });
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, [id, currentUid, setMessages]);

  const handleSend = async () => {
    if (!text.trim() && !editingMessage) return;

    if (editingMessage) {
      await updateDoc(doc(db, 'conversations', id, 'messages', editingMessage.id), {
        text: text.trim(),
        edited: true,
      });
      setEditingMessage(null);
      setText('');
      return;
    }

    const body = text.trim();
    setText('');

    if (!isOnline) {
      enqueueMessage({
        id: `${Date.now()}-${Math.random()}`,
        conversationId: id,
        senderId: currentUid,
        text: body,
        type: 'text',
        createdAt: Date.now(),
      });
      Alert.alert('Offline', 'Message queued and will be sent when back online');
      return;
    }

    await sendMessage(id, { senderId: currentUid, type: 'text', text: body });
  };

  const handlePickMedia = async (mediaType: 'image' | 'video') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        mediaType === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });

    if (result.canceled) return;
    const asset = result.assets[0];
    setUploading(true);

    try {
      let uploadUri = asset.uri;

      if (mediaType === 'image') {
        const compressed = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 1080 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
        );
        uploadUri = compressed.uri;
      }

      const { url, thumbnailUrl } = await uploadToCloudinary(uploadUri, mediaType);
      await sendMessage(id, {
        senderId: currentUid,
        type: mediaType,
        mediaUrl: url,
        thumbnailUrl,
      });
    } catch (e: unknown) {
      Alert.alert('Upload failed', (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleAudioRecorded = async (uri: string, duration: number) => {
    setUploading(true);
    try {
      const { url } = await uploadToCloudinary(uri, 'audio');
      await sendMessage(id, {
        senderId: currentUid,
        type: 'audio',
        mediaUrl: url,
        audioDuration: duration,
      });
    } catch (e: unknown) {
      Alert.alert('Upload failed', (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditPress = (message: Message) => {
    setEditingMessage(message);
    setText(message.text ?? '');
  };

  const otherUid = conversation?.participants.find((p) => p !== currentUid);
  const otherIsTyping = otherUid ? !!conversation?.typing?.[otherUid] : false;

  const displayMessages = searchTerm
    ? roomMessages.filter(
        (m) =>
          m.type === 'text' && m.text?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : roomMessages;

  const otherName = otherUid
    ? (conversation?.participantNames?.[otherUid] ??
      conversation?.participantEmails?.[otherUid] ??
      'Chat')
    : 'Chat';

  return {
    id,
    currentUid,
    isOnline,
    roomMessages,
    conversation,
    text,
    setText,
    loading,
    error,
    setError,
    uploading,
    searchVisible,
    setSearchVisible,
    searchTerm,
    setSearchTerm: (t: string) => {
      setSearchLoading(true);
      setSearchTerm(t);
      setTimeout(() => setSearchLoading(false), 300);
    },
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
  };
}
