import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useLogin } from '@/hooks/useLogin';
import { LoginForm } from '@/components/LoginForm';

export default function Login() {
  const loginState = useLogin();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LoginForm {...loginState} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
