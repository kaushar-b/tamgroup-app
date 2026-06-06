import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

// Admins access this screen by navigating to /admin in the app
// Their email must be in your Neon users table with role='admin'
export default function AdminLogin() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      // Check role in Neon DB - for now route to admin dashboard
      router.replace('/admin/dashboard');
    } catch (err: any) {
      Alert.alert('Access Denied', err.errors?.[0]?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <Image source={require('../../assets/logo.png')} style={s.logo} resizeMode="contain" />
      <View style={s.badge}><Text style={s.badgeText}>Admin Portal</Text></View>
      <View style={s.card}>
        <Text style={s.title}>Admin Sign In</Text>
        <Text style={s.subtitle}>Restricted access only</Text>
        <TextInput style={s.input} placeholder="Admin email" placeholderTextColor="#6b6b6b" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={s.input} placeholder="Password" placeholderTextColor="#6b6b6b" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={s.btn} onPress={onLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Sign In as Admin</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1612', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo:      { width: 180, height: 100, marginBottom: 16 },
  badge:     { backgroundColor: '#FBA4AD', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 28 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  card:      { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  title:     { fontSize: 22, fontWeight: '800', color: '#1a1612', marginBottom: 4 },
  subtitle:  { fontSize: 13, color: '#6b6b6b', marginBottom: 24 },
  input:     { borderWidth: 1, borderColor: '#efefef', borderRadius: 10, padding: 14, fontSize: 15, color: '#1a1612', marginBottom: 14, backgroundColor: '#f5f5f5' },
  btn:       { backgroundColor: '#1a1612', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
});
