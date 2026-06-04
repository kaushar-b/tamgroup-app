import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';

export default function Cart() {
  const { items, addToCart, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.subtitle}>{items.length === 0 ? 'No items yet' : `${items.reduce((s,i)=>s+i.quantity,0)} items`}</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}><Ionicons name="cart-outline" size={56} color={Colors.grey} /></View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add items from the menu to get started</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={{ padding: 20 }}>
          {items.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardIcon}>
                <Ionicons name={item.icon as any} size={26} color={Colors.pink} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>P {item.price}.00 each</Text>
              </View>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="remove" size={16} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item.id)}>
                  <Ionicons name="add" size={16} color={Colors.black} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.binBtn} onPress={() => {
                const it = items.find(i => i.id === item.id);
                if (it) for (let x = 0; x < it.quantity; x++) removeFromCart(item.id);
              }}>
                <Ionicons name="trash-outline" size={18} color={Colors.red} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
            <Text style={styles.clearText}>Clear Cart</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>P {total}.00</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, items.length === 0 && styles.checkoutDisabled]}
          disabled={items.length === 0}
          onPress={() => router.push('/checkout')}
        >
          <Ionicons name="card" size={18} color={Colors.black} />
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.white },
  header:           { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title:            { fontSize: 28, fontWeight: '800', color: Colors.black },
  subtitle:         { fontSize: 13, color: Colors.grey, marginTop: 2 },
  emptyWrap:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyIcon:        { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle:       { fontSize: 20, fontWeight: '700', color: Colors.black },
  emptyText:        { fontSize: 14, color: Colors.grey },
  list:             { flex: 1 },
  card:             { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, marginBottom: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardIcon:         { width: 46, height: 46, backgroundColor: Colors.lightGrey, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardInfo:         { flex: 1 },
  itemName:         { fontSize: 14, fontWeight: '700', color: Colors.black },
  itemPrice:        { fontSize: 12, color: Colors.grey, marginTop: 2 },
  qtyRow:           { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.lightGrey, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 10 },
  qtyBtn:           { padding: 2 },
  qtyText:          { fontSize: 14, fontWeight: '800', color: Colors.black, minWidth: 18, textAlign: 'center' },
  binBtn:           { padding: 6 },
  clearBtn:         { alignItems: 'center', marginTop: 4 },
  clearText:        { fontSize: 13, color: Colors.grey, textDecorationLine: 'underline' },
  footer:           { padding: 20, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.white },
  totalRow:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  totalLabel:       { fontSize: 18, fontWeight: '700', color: Colors.black },
  totalAmount:      { fontSize: 18, fontWeight: '800', color: Colors.pink },
  checkoutBtn:      { backgroundColor: Colors.yellow, borderRadius: 14, padding: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  checkoutDisabled: { opacity: 0.4 },
  checkoutText:     { fontSize: 16, fontWeight: '700', color: Colors.black },
});
