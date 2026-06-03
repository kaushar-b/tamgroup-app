import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function Orders() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
        <Text style={styles.subtitle}>Track your order history</Text>
      </View>

      <View style={styles.emptyWrap}>
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptyText}>Your order history will appear here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.white },
  header:     { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title:      { fontSize: 28, fontWeight: '800', color: Colors.black },
  subtitle:   { fontSize: 13, color: Colors.grey, marginTop: 2 },
  emptyWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.black, marginBottom: 8 },
  emptyText:  { fontSize: 14, color: Colors.grey },
});