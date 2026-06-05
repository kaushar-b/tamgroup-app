import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';

const C = { pink: '#FBA4AD', yellow: '#FFDD32', red: '#D10000', white: '#FFFFFF', black: '#1a1612', grey: '#6b6b6b', light: '#f5f5f5', border: '#efefef' };

export default function Cart() {
  const { items, addToCart, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();

  const removeAll = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) for (let x = 0; x < item.quantity; x++) removeFromCart(id);
  };

  const goToCheckout = () => {
    try {
      router.push('/checkout');
    } catch (e) {
      console.log('nav error', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/tabs')} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={styles.homeBtn}>
          <Ionicons name="home-outline" size={22} color={C.black} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Cart</Text>
          <Text style={styles.subtitle}>{items.length === 0 ? 'No items yet' : `${items.reduce((s, i) => s + i.quantity, 0)} items`}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}><Ionicons name="cart-outline" size={56} color={C.grey} /></View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add items from the menu to get started</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {items.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardIcon}>
                <Ionicons name={item.icon as any} size={26} color={C.pink} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>P {item.price}.00 each</Text>
              </View>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Ionicons name="remove" size={16} color={C.black} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Ionicons name="add" size={16} color={C.black} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.binBtn} onPress={() => removeAll(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="trash-outline" size={18} color={C.red} />
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
          onPress={goToCheckout}
        >
          <Ionicons name="card" size={18} color={C.black} />
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#fff' },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16 },
  homeBtn:          { width: 44, height: 44, justifyContent: 'center' },
  headerCenter:     { flex: 1, alignItems: 'center' },
  title:            { fontSize: 24, fontWeight: '800', color: '#1a1612' },
  subtitle:         { fontSize: 13, color: '#6b6b6b', marginTop: 2 },
  emptyWrap:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyIcon:        { width: 96, height: 96, borderRadius: 48, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle:       { fontSize: 20, fontWeight: '700', color: '#1a1612' },
  emptyText:        { fontSize: 14, color: '#6b6b6b' },
  card:             { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#efefef' },
  cardIcon:         { width: 46, height: 46, backgroundColor: '#f5f5f5', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardInfo:         { flex: 1 },
  itemName:         { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  itemPrice:        { fontSize: 12, color: '#6b6b6b', marginTop: 2 },
  qtyRow:           { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 10 },
  qtyBtn:           { padding: 3 },
  qtyText:          { fontSize: 14, fontWeight: '800', color: '#1a1612', minWidth: 18, textAlign: 'center' },
  binBtn:           { padding: 6 },
  clearBtn:         { alignItems: 'center', marginTop: 4 },
  clearText:        { fontSize: 13, color: '#6b6b6b', textDecorationLine: 'underline' },
  footer:           { padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: '#efefef', backgroundColor: '#fff' },
  totalRow:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  totalLabel:       { fontSize: 18, fontWeight: '700', color: '#1a1612' },
  totalAmount:      { fontSize: 18, fontWeight: '800', color: '#FBA4AD' },
  checkoutBtn:      { backgroundColor: '#FFDD32', borderRadius: 14, padding: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  checkoutDisabled: { opacity: 0.4 },
  checkoutText:     { fontSize: 16, fontWeight: '700', color: '#1a1612' },
});
