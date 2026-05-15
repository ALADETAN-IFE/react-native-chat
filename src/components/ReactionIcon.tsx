import { Ionicons } from '@expo/vector-icons';
import { getReactionMeta } from '@/utils/reactions';

interface Props {
  reactionKey: string;
  size?: number;
}

export function ReactionIcon({ reactionKey, size = 16 }: Props) {
  const meta = getReactionMeta(reactionKey);
  if (!meta) return null;
  return <Ionicons name={meta.icon} size={size} color={meta.color} />;
}
