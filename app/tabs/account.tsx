import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function Account() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const initial = (user?.emailAddresses?.[0]?.emailAddress?.[0] || 'U').toUpperCase();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/sign-in');
        }
      }
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Account</Text>
      </View>

      <View style={s.avatarWrap}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>{initial}</Text>
        </View>
        <Text style={s.email}>{user?.emailAddresses?.[0]?.emailAddress}</Text>
      </View>

      <View style={s.section}>
        <TouchableOpacity style={s.row} onPress={() => router.push('/auth/change-password')}>
          <View style={s.rowIcon}><Ionicons name="key-outline" size={20} color="#CE6F79" /></View>
          <Text style={s.rowText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={s.row} onPress={() => router.push('/tabs/orders')}>
          <View style={s.rowIcon}><Ionicons name="receipt-outline" size={20} color="#CE6F79" /></View>
          <Text style={s.rowText}>My Orders</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={s.row} onPress={() => router.push('/about')}>
          <View style={s.rowIcon}><Ionicons name="information-circle-outline" size={20} color="#CE6F79" /></View>
          <Text style={s.rowText}>About Us</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={s.row} onPress={() => router.push('/terms')}>
          <View style={s.rowIcon}><Ionicons name="document-text-outline" size={20} color="#CE6F79" /></View>
          <Text style={s.rowText}>Policy & Terms</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={s.section}>
        <TouchableOpacity style={[s.row, s.signOutRow]} onPress={handleSignOut}>
          <View style={s.rowIcon}><Ionicons name="log-out-outline" size={20} color="#D10000" /></View>
          <Text style={[s.rowText, { color: '#D10000' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F3C3C5' },
  header:      { paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: '#fff' },
  title:       { fontSize: 26, fontWeight: '800', color: '#1a1612' },
  avatarWrap:  { alignItems: 'center', paddingVertical: 28, backgroundColor: '#fff', marginBottom: 16 },
  avatarCircle:{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#CE6F79', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText:  { fontSize: 36, fontWeight: '800', color: '#fff' },
  email:       { fontSize: 14, color: '#6b6b6b' },
  section:     { backgroundColor: '#fff', marginBottom: 12, borderRadius: 0 },
  row:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3C3C5' },
  rowIcon:     { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowText:     { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1612' },
  signOutRow:  { borderBottomWidth: 0 },
});
