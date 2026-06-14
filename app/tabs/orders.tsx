import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RED = '#b60015';
const YELLOW = '#FFD544';

export default function Orders() {
  const router = useRouter();
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.push('/tabs')} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={s.homeBtn}>
          <Ionicons name="home-outline" size={22} color="#1a1612" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Orders</Text>
          <Text style={s.subtitle}>Your order history</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>
      <View style={s.emptyWrap}>
        <Ionicons name="receipt-outline" size={72} color={RED} />
        <Text style={s.emptyTitle}>No orders yet</Text>
        <Text style={s.emptyText}>Your order history will appear here</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: YELLOW },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: '#fff' },
  homeBtn:      { width: 44, height: 44, justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title:        { fontSize: 24, fontWeight: '800', color: '#1a1612' },
  subtitle:     { fontSize: 13, color: RED, marginTop: 2 },
  emptyWrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle:   { fontSize: 20, fontWeight: '700', color: '#1a1612' },
  emptyText:    { fontSize: 14, color: '#6b6b6b' },
});
