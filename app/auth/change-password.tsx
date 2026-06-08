import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePassword() {
  const { user } = useUser();
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (!newPass.trim()) { Alert.alert('Error', 'Please enter a new password'); return; }
    if (newPass !== confirm) { Alert.alert('Error', 'Passwords do not match'); return; }
    if (newPass.length < 8) { Alert.alert('Error', 'Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await user?.updatePassword({ currentPassword: current, newPassword: newPass });
      Alert.alert('Success', 'Password changed successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1612" />
        </TouchableOpacity>
        <Text style={s.title}>Change Password</Text>
      </View>
      <View style={s.card}>
        <Text style={s.label}>Current Password</Text>
        <TextInput style={s.input} value={current} onChangeText={setCurrent} secureTextEntry placeholder="Enter current password" placeholderTextColor="#9b7b7e" />
        <Text style={s.label}>New Password</Text>
        <TextInput style={s.input} value={newPass} onChangeText={setNewPass} secureTextEntry placeholder="Enter new password" placeholderTextColor="#9b7b7e" />
        <Text style={s.label}>Confirm New Password</Text>
        <TextInput style={s.input} value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Confirm new password" placeholderTextColor="#9b7b7e" />
        <TouchableOpacity style={s.btn} onPress={handleChange} disabled={loading}>
          {loading ? <ActivityIndicator color="#1a1612" /> : <Text style={s.btnText}>Update Password</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, gap: 12 },
  backBtn:   { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center' },
  title:     { fontSize: 22, fontWeight: '800', color: '#1a1612' },
  card:      { padding: 24 },
  label:     { fontSize: 12, fontWeight: '600', color: '#CE6F79', marginBottom: 8, marginTop: 12 },
  input:     { borderWidth: 1, borderColor: '#F3C3C5', borderRadius: 10, padding: 14, fontSize: 15, color: '#1a1612', backgroundColor: '#FADAD9' },
  btn:       { backgroundColor: '#FFDD32', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 24 },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#1a1612' },
});
