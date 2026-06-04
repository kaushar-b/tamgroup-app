import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Orders() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/tabs')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="home-outline" size={22} color={Colors.black} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>Your Orders</Text>
          <Text style={styles.subtitle}>Track your order history</Text>
        </View>
      </View>
      <View style={styles.emptyWrap}>
        <Ionicons name="receipt-outline" size={72} color={Colors.border} />
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptyText}>Your order history will appear here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.white },
  header:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16 },
  title:      { fontSize: 26, fontWeight: '800', color: Colors.black },
  subtitle:   { fontSize: 13, color: Colors.grey, marginTop: 2 },
  emptyWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.black },
  emptyText:  { fontSize: 14, color: Colors.grey },
});
