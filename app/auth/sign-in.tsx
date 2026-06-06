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
        <TextInput style={s.input} placeholder="Email address" placeholderTextColor="#6b6b6b" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={s.input} placeholder="Password" placeholderTextColor="#6b6b6b" value={password} onChangeText={setPassword} secureTextEntry />
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
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo:      { width: 240, height: 140, marginBottom: 32 },
  card:      { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: '#efefef' },
  title:     { fontSize: 24, fontWeight: '700', color: '#1a1612', marginBottom: 4 },
  subtitle:  { fontSize: 14, color: '#6b6b6b', marginBottom: 24 },
  error:     { backgroundColor: '#fff0f0', color: '#D10000', padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
  input:     { borderWidth: 1, borderColor: '#efefef', borderRadius: 10, padding: 14, fontSize: 15, color: '#1a1612', marginBottom: 14, backgroundColor: '#f5f5f5' },
  btn:       { backgroundColor: '#FFDD32', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  linkWrap:  { marginTop: 20, alignItems: 'center' },
  linkText:  { color: '#6b6b6b', fontSize: 14 },
  link:      { color: '#FBA4AD', fontWeight: '600' },
});
