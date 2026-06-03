import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function Cart() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.subtitle}>Review your order</Text>
      </View>

      <View style={styles.emptyWrap}>
        <Ionicons name="cart-outline" size={72} color={Colors.border} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add items from the menu to get started</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>P 0.00</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Ionicons name="card" size={18} color={Colors.black} />
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.white },
  header:       { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title:        { fontSize: 28, fontWeight: '800', color: Colors.black },
  subtitle:     { fontSize: 13, color: Colors.grey, marginTop: 2 },
  emptyWrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle:   { fontSize: 20, fontWeight: '700', color: Colors.black },
  emptyText:    { fontSize: 14, color: Colors.grey },
  footer:       { padding: 20, borderTopWidth: 1, borderTopColor: Colors.border },
  totalRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel:   { fontSize: 18, fontWeight: '700', color: Colors.black },
  totalAmount:  { fontSize: 18, fontWeight: '800', color: Colors.pink },
  checkoutBtn:  { backgroundColor: Colors.yellow, borderRadius: 12, padding: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  checkoutText: { fontSize: 16, fontWeight: '700', color: Colors.black },
});