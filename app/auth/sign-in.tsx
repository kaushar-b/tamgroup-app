import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true); setError('');
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      router.replace('/tabs');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign in failed');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={require('../../assets/logo.png')} style={s.logo} resizeMode="contain" />
      <View style={s.card}>
        <Text style={s.title}>Welcome back</Text>
        <Text style={s.subtitle}>Sign in to your account</Text>
        {error ? <Text style={s.error}>{error}</Text> : null}
        <TextInput style={s.input} placeholder="Email address" placeholderTextColor="#9b7b7e" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={s.input} placeholder="Password" placeholderTextColor="#9b7b7e" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={s.btn} onPress={onSignIn} disabled={loading}>
          {loading ? <ActivityIndicator color="#1a1612" /> : <Text style={s.btnText}>Sign In</Text>}
        </TouchableOpacity>
        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity style={s.linkWrap}>
            <Text style={s.linkText}>Don't have an account? <Text style={s.link}>Sign up</Text></Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3C3C5', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo:      { width: 280, height: 160, marginBottom: 28 },
  card:      { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#CE6F79', shadowOpacity: 0.15, shadowRadius: 16, elevation: 4 },
  title:     { fontSize: 24, fontWeight: '700', color: '#1a1612', marginBottom: 4 },
  subtitle:  { fontSize: 14, color: '#6b6b6b', marginBottom: 24 },
  error:     { backgroundColor: '#fff0f0', color: '#D10000', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
  input:     { borderWidth: 1, borderColor: '#F3C3C5', borderRadius: 10, padding: 14, fontSize: 15, color: '#1a1612', marginBottom: 14, backgroundColor: '#FDF0F0' },
  btn:       { backgroundColor: '#FFDD32', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  linkWrap:  { marginTop: 20, alignItems: 'center' },
  linkText:  { color: '#6b6b6b', fontSize: 14 },
  link:      { color: '#CE6F79', fontWeight: '600' },
});
