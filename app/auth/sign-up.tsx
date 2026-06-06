import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSignUp = async () => {
    if (!isLoaded) return;
    setLoading(true); setError('');
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign up failed');
    } finally { setLoading(false); }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    setLoading(true); setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: result.createdSessionId });
      router.replace('/tabs');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Verification failed');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image source={require('../../assets/logo.png')} style={s.logo} resizeMode="contain" />
      <View style={s.card}>
        {!pendingVerification ? (
          <>
            <Text style={s.title}>Create account</Text>
            <Text style={s.subtitle}>Sign up to start ordering</Text>
            {error ? <Text style={s.error}>{error}</Text> : null}
            <TextInput style={s.input} placeholder="Email address" placeholderTextColor="#9b7b7e" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={s.input} placeholder="Password" placeholderTextColor="#9b7b7e" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={s.btn} onPress={onSignUp} disabled={loading}>
              {loading ? <ActivityIndicator color="#1a1612" /> : <Text style={s.btnText}>Create Account</Text>}
            </TouchableOpacity>
            <Link href="/auth/sign-in" asChild>
              <TouchableOpacity style={s.linkWrap}>
                <Text style={s.linkText}>Already have an account? <Text style={s.link}>Sign in</Text></Text>
              </TouchableOpacity>
            </Link>
          </>
        ) : (
          <>
            <Text style={s.title}>Check your email</Text>
            <Text style={s.subtitle}>We sent a code to {email}</Text>
            {error ? <Text style={s.error}>{error}</Text> : null}
            <TextInput style={s.input} placeholder="Verification code" placeholderTextColor="#9b7b7e" value={code} onChangeText={setCode} keyboardType="number-pad" />
            <TouchableOpacity style={s.btn} onPress={onVerify} disabled={loading}>
              {loading ? <ActivityIndicator color="#1a1612" /> : <Text style={s.btnText}>Verify Email</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 24 },
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
