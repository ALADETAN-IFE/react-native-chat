import {
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface Props {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  displayName: string;
  setDisplayName: (v: string) => void;
  isSignUp: boolean;
  setIsSignUp: (v: boolean | ((v: boolean) => boolean)) => void;
  loading: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
}

export function LoginForm({
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
}: Props) {
  return (
    <>
      <Text style={styles.title}>💬 ChatApp</Text>
      <Text style={styles.subtitle}>
        {isSignUp ? 'Create an account' : 'Welcome back'}
      </Text>

      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Display name"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={isSignUp ? onSignUp : onSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isSignUp ? 'Sign up' : 'Sign in'}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsSignUp((v: boolean) => !v)}
        style={styles.switchBtn}
      >
        <Text style={styles.switchText}>
          {isSignUp
            ? 'Already have an account? Sign in'
            : "Don't have an account? Sign up"}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  switchBtn: { alignItems: 'center', marginTop: 8 },
  switchText: { color: '#4b5563', fontSize: 14 },
});
