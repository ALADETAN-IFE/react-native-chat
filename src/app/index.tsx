import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { LoadingState } from '@/components/StateViews';

export default function Index() {
  const { user, ready } = useAuthStore();

  if (!ready) return <LoadingState message="Starting up..." />;
  return user ? <Redirect href="/chats" /> : <Redirect href="/login" />;
}
