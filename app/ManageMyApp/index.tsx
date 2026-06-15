import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'expo-router';

const RED    = '#b60015';
const YELLOW = '#FFD544';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const onLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // _layout.tsx will redirect based on email
    } catch {
      Alert.alert('Access Denied', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Image source={require('../../assets/casadelsol.logo.png')} style={s.logo} resizeMode="contain" />
      <View style={s.badge}>
        <Text style={s.badgeText}>Staff Portal</Text>
      </View>
      <View style={s.card}>
        <Text style={s.title}>Staff Sign In</Text>
        <Text style={s.subtitle}>Manager & Driver access only</Text>
        <TextInput
          style={s.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={s.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={s.btn} onPress={onLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnText}>Sign In</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo:      { width: 200, height: 110, marginBottom: 16 },
  badge:     { backgroundColor: RED, paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20, marginBottom: 28 },
  badgeText: { color: '#fff', fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  card:      { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 26, elevation: 4 },
  title:     { fontSize: 22, fontWeight: '900', color: '#1a1612', marginBottom: 4 },
  subtitle:  { fontSize: 13, color: '#6b6b6b', marginBottom: 24 },
  input:     { borderWidth: 1.5, borderColor: '#eee', borderRadius: 12, padding: 14, fontSize: 15, color: '#1a1612', marginBottom: 14, backgroundColor: '#fafafa' },
  btn:       { backgroundColor: RED, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  btnText:   { fontSize: 16, fontWeight: '800', color: '#fff' },
});
