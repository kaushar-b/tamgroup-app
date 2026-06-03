import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Colors } from '../../constants/Colors';

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
    setLoading(true);
    setError('');
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: result.createdSessionId });
      router.replace('/tabs');
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      {/* Logo */}
      <View style={styles.logoWrap}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>TAM</Text>
        </View>
        <Text style={styles.brandName}>TAM Group</Text>
        <Text style={styles.brandSub}>RESTAURANT</Text>
      </View>

      <View style={styles.card}>
        {!pendingVerification ? (
          <>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Sign up to start ordering</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={Colors.grey}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.grey}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.btn} onPress={onSignUp} disabled={loading}>
              {loading
                ? <ActivityIndicator color={Colors.black} />
                : <Text style={styles.btnText}>Create Account</Text>}
            </TouchableOpacity>

            <Link href="/auth/sign-in" asChild>
              <TouchableOpacity style={styles.linkWrap}>
                <Text style={styles.linkText}>Already have an account? <Text style={styles.link}>Sign in</Text></Text>
              </TouchableOpacity>
            </Link>
          </>
        ) : (
          <>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>We sent a verification code to {email}</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Verification code"
              placeholderTextColor={Colors.grey}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />

            <TouchableOpacity style={styles.btn} onPress={onVerify} disabled={loading}>
              {loading
                ? <ActivityIndicator color={Colors.black} />
                : <Text style={styles.btnText}>Verify Email</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoWrap:    { alignItems: 'center', marginBottom: 36 },
  logoBadge:   { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.yellow, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoText:    { fontSize: 24, fontWeight: '800', color: Colors.black },
  brandName:   { fontSize: 22, fontWeight: '700', color: Colors.black, letterSpacing: 2 },
  brandSub:    { fontSize: 11, fontWeight: '400', color: Colors.grey, letterSpacing: 4, marginTop: 2 },
  card:        { width: '100%', backgroundColor: Colors.white, borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  title:       { fontSize: 24, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  subtitle:    { fontSize: 14, color: Colors.grey, marginBottom: 24 },
  error:       { backgroundColor: '#fff0f0', color: Colors.red, padding: 10, borderRadius: 8, marginBottom: 12, fontSize: 13 },
  input:       { borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, fontSize: 15, color: Colors.black, marginBottom: 14, backgroundColor: Colors.lightGrey },
  btn:         { backgroundColor: Colors.yellow, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnText:     { fontSize: 16, fontWeight: '700', color: Colors.black },
  linkWrap:    { marginTop: 20, alignItems: 'center' },
  linkText:    { color: Colors.grey, fontSize: 14 },
  link:        { color: Colors.pink, fontWeight: '600' },
});