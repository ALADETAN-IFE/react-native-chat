import { Message } from '@/types/message';

export function getLastMessagePreview(
  payload: Pick<Message, 'type' | 'text'>,
): string {
  if (payload.type === 'text') return payload.text ?? '';
  if (payload.type === 'audio') return 'Audio message';
  if (payload.type === 'image') return 'Image';
  return 'Video';
}
