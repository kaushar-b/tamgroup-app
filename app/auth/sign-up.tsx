import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSignUp = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      // AuthGate handles navigation automatically
    } catch (err: any) {
      const code = err.code;
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError('Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={require('../../assets/logo.png')} style={s.logo} resizeMode="contain" />
      <View style={s.card}>
        <Text style={s.title}>Create account</Text>
        <Text style={s.subtitle}>Sign up to start ordering</Text>
        {error ? <Text style={s.error}>{error}</Text> : null}
        <TextInput style={s.input} placeholder="Email address" placeholderTextColor="#9b7b7e" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={s.input} placeholder="Password" placeholderTextColor="#9b7b7e" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={s.input} placeholder="Confirm password" placeholderTextColor="#9b7b7e" value={confirm} onChangeText={setConfirm} secureTextEntry />
        <TouchableOpacity style={s.btn} onPress={onSignUp} disabled={loading}>
          {loading ? <ActivityIndicator color="#1a1612" /> : <Text style={s.btnText}>Create Account</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={s.linkWrap} onPress={() => router.push('/auth/sign-in')}>
          <Text style={s.linkText}>Already have an account? <Text style={s.link}>Sign in</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD544', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo:      { width: 280, height: 160, marginBottom: 28 },
  card:      { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#CE6F79', shadowOpacity: 0.12, shadowRadius: 16, elevation: 4 },
  title:     { fontSize: 24, fontWeight: '700', color: '#1a1612', marginBottom: 4 },
  subtitle:  { fontSize: 14, color: '#6b6b6b', marginBottom: 24 },
  error:     { backgroundColor: '#fff0f0', color: '#D10000', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
  input:     { borderWidth: 1, borderColor: '#F3C3C5', borderRadius: 10, padding: 14, fontSize: 15, color: '#1a1612', marginBottom: 14, backgroundColor: '#FADAD9' },
  btn:       { backgroundColor: '#FFDD32', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  linkWrap:  { marginTop: 20, alignItems: 'center' },
  linkText:  { color: '#6b6b6b', fontSize: 14 },
  link:      { color: '#CE6F79', fontWeight: '600' },
});
