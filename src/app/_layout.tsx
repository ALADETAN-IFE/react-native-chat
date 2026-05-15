import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { useAuthStore } from '@/stores/authStore';
import { useNetworkSync } from '@/hooks/useNetworkSync';

export default function RootLayout() {
  const { setUser, setReady } = useAuthStore();
  useNetworkSync();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, [setUser, setReady]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
