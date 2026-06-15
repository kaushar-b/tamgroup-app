import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

const RED = '#b60015';
const YELLOW = '#FFD544';

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const email = user?.email || '';
  const initial = (email[0] || 'U').toUpperCase();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => { await signOut(auth); router.replace('/auth/sign-in'); }
      }
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.homeBtn} onPress={() => router.push('/tabs')} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="home-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Account</Text>
        <View style={{ width: 44 }} />
      </View>
      <View style={s.avatarWrap}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>{initial}</Text>
        </View>
        <Text style={s.email}>{email}</Text>
      </View>
      <View style={s.section}>
        <TouchableOpacity style={s.row} onPress={() => router.push('/auth/change-password')}>
          <View style={s.rowIcon}><Ionicons name="key-outline" size={20} color={RED} /></View>
          <Text style={s.rowText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={16} color={RED} />
        </TouchableOpacity>
        <View style={s.rowDivider} />
        <TouchableOpacity style={s.row} onPress={() => router.push('/tabs/orders')}>
          <View style={s.rowIcon}><Ionicons name="receipt-outline" size={20} color={RED} /></View>
          <Text style={s.rowText}>My Orders</Text>
          <Ionicons name="chevron-forward" size={16} color={RED} />
        </TouchableOpacity>
        <View style={s.rowDivider} />
        <TouchableOpacity style={s.row} onPress={() => router.push('/about')}>
          <View style={s.rowIcon}><Ionicons name="information-circle-outline" size={20} color={RED} /></View>
          <Text style={s.rowText}>About Us</Text>
          <Ionicons name="chevron-forward" size={16} color={RED} />
        </TouchableOpacity>
        <View style={s.rowDividerRed} />
        <TouchableOpacity style={[s.row, s.signOutRow]} onPress={handleSignOut}>
          <View style={s.rowIcon}><Ionicons name="log-out-outline" size={20} color={RED} /></View>
          <Text style={[s.rowText, { color: RED }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: YELLOW },
  header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16, backgroundColor: RED },
  homeBtn:         { width: 44, height: 44, justifyContent: 'center' },
  title:           { flex: 1, fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center' },
  avatarWrap:      { alignItems: 'center', paddingVertical: 28, backgroundColor: YELLOW, marginBottom: 16 },
  avatarCircle:    { width: 80, height: 80, borderRadius: 40, backgroundColor: RED, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText:      { fontSize: 36, fontWeight: '800', color: '#fff' },
  email:           { fontSize: 14, color: '#1a1612' },
  section:         { backgroundColor: YELLOW },
  row:             { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  rowDivider:      { height: 1, backgroundColor: RED, marginHorizontal: 20, opacity: 0.25 },
  rowDividerRed:   { height: 1, backgroundColor: RED, marginHorizontal: 20, opacity: 0.7 },
  rowIcon:         { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowText:         { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1612' },
  signOutRow:      {},
});
