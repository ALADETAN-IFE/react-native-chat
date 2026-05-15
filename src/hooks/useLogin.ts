import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/chats');
    } catch (e: unknown) {
      Alert.alert('Sign in failed', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async () => {
    if (!email || !password || !displayName)
      return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        createdAt: serverTimestamp(),
      });
      router.replace('/chats');
    } catch (e: unknown) {
      Alert.alert('Sign up failed', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    isSignUp,
    setIsSignUp,
    loading,
    onSignIn,
    onSignUp,
  };
}
