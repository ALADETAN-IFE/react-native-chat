import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type ReactionId = 'thumbs-up' | 'heart' | 'happy' | 'surprise' | 'sad' | 'flame';
export type IconName = ComponentProps<typeof Ionicons>['name'];

export const REACTION_OPTIONS: { id: ReactionId; icon: IconName; color: string }[] = [
  { id: 'thumbs-up', icon: 'thumbs-up', color: '#2563eb' },
  { id: 'heart', icon: 'heart', color: '#ef4444' },
  { id: 'happy', icon: 'happy-outline', color: '#f59e0b' },
  { id: 'surprise', icon: 'alert-circle-outline', color: '#8b5cf6' },
  { id: 'sad', icon: 'sad-outline', color: '#6366f1' },
  { id: 'flame', icon: 'flame', color: '#f97316' },
];

const LEGACY_EMOJI_TO_ID: Record<string, ReactionId> = {
  '👍': 'thumbs-up',
  '❤️': 'heart',
  '😂': 'happy',
  '😮': 'surprise',
  '😢': 'sad',
  '🔥': 'flame',
};

export function normalizeReactionKey(key: string): ReactionId | null {
  if (REACTION_OPTIONS.some((r) => r.id === key)) return key as ReactionId;
  return LEGACY_EMOJI_TO_ID[key] ?? null;
}

export function getReactionMeta(key: string) {
  const id = normalizeReactionKey(key);
  if (!id) return null;
  return REACTION_OPTIONS.find((r) => r.id === id) ?? null;
}
