import { Stack } from 'expo-router';
import '@/firebase';

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
