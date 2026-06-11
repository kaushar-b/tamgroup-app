import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'expo-router';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace('/ManageMyApp/dashboard');
    } catch (err: any) {
      Alert.alert('Access Denied', 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <Image source={require('../../assets/logo.png')} style={s.logo} resizeMode="contain" />
      <View style={s.badge}><Text style={s.badgeText}>Admin Portal</Text></View>
      <View style={s.card}>
        <Text style={s.title}>Admin Sign In</Text>
        <Text style={s.subtitle}>Restricted access only</Text>
        <TextInput style={s.input} placeholder="Admin email" placeholderTextColor="#9b7b7e" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={s.input} placeholder="Password" placeholderTextColor="#9b7b7e" value={password} onChangeText={setPassword} secureTextEntry />
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
  badge:     { backgroundColor: '#CE6F79', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 28 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  card:      { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  title:     { fontSize: 22, fontWeight: '800', color: '#1a1612', marginBottom: 4 },
  subtitle:  { fontSize: 13, color: '#6b6b6b', marginBottom: 24 },
  input:     { borderWidth: 1, borderColor: '#F3C3C5', borderRadius: 10, padding: 14, fontSize: 15, color: '#1a1612', marginBottom: 14, backgroundColor: '#FADAD9' },
  btn:       { backgroundColor: '#1a1612', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 4 },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
});
