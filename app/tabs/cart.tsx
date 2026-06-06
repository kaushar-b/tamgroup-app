import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';

export default function Cart() {
  const { items, addToCart, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();

  const removeAll = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) for (let x = 0; x < item.quantity; x++) removeFromCart(id);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.push('/tabs')} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={s.homeBtn}>
          <Ionicons name="home-outline" size={22} color="#1a1612" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Cart</Text>
          <Text style={s.subtitle}>{items.length === 0 ? 'No items yet' : `${items.reduce((a, i) => a + i.quantity, 0)} items`}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {items.length === 0 ? (
        <View style={s.emptyWrap}>
          <View style={s.emptyIcon}><Ionicons name="cart-outline" size={56} color="#CE6F79" /></View>
          <Text style={s.emptyTitle}>Your cart is empty</Text>
          <Text style={s.emptyText}>Add items from the menu to get started</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {items.map(item => (
            <View key={item.id} style={s.card}>
              <View style={s.cardIcon}>
                <Ionicons name={item.icon as any} size={26} color="#CE6F79" />
              </View>
              <View style={s.cardInfo}>
                <Text style={s.itemName}>{item.name}</Text>
                <Text style={s.itemPrice}>P {item.price}.00 each</Text>
              </View>
              <View style={s.qtyRow}>
                <TouchableOpacity style={s.qtyBtn} onPress={() => removeFromCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Ionicons name="remove" size={16} color="#1a1612" />
                </TouchableOpacity>
                <Text style={s.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={s.qtyBtn} onPress={() => addToCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Ionicons name="add" size={16} color="#1a1612" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={s.binBtn} onPress={() => removeAll(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="trash-outline" size={18} color="#D10000" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={s.clearBtn} onPress={clearCart}>
            <Text style={s.clearText}>Clear Cart</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      <View style={s.footer}>
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalAmount}>P {total}.00</Text>
        </View>
        <TouchableOpacity
          style={[s.checkoutBtn, items.length === 0 && s.checkoutDisabled]}
          disabled={items.length === 0}
          onPress={() => router.push('/checkout')}
        >
          <Ionicons name="card" size={18} color="#1a1612" />
          <Text style={s.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F3C3C5' },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: '#FADAD9' },
  homeBtn:          { width: 44, height: 44, justifyContent: 'center' },
  headerCenter:     { flex: 1, alignItems: 'center' },
  title:            { fontSize: 24, fontWeight: '800', color: '#1a1612' },
  subtitle:         { fontSize: 13, color: '#CE6F79', marginTop: 2 },
  emptyWrap:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyIcon:        { width: 96, height: 96, borderRadius: 48, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle:       { fontSize: 20, fontWeight: '700', color: '#1a1612' },
  emptyText:        { fontSize: 14, color: '#6b6b6b' },
  card:             { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FADAD9', borderRadius: 14, marginBottom: 12, padding: 12, borderWidth: 1, borderColor: '#F3C3C5', elevation: 1 },
  cardIcon:         { width: 46, height: 46, backgroundColor: '#F3C3C5', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardInfo:         { flex: 1 },
  itemName:         { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  itemPrice:        { fontSize: 12, color: '#CE6F79', marginTop: 2 },
  qtyRow:           { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F3C3C5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 10 },
  qtyBtn:           { padding: 3 },
  qtyText:          { fontSize: 14, fontWeight: '800', color: '#1a1612', minWidth: 18, textAlign: 'center' },
  binBtn:           { padding: 6 },
  clearBtn:         { alignItems: 'center', marginTop: 4 },
  clearText:        { fontSize: 13, color: '#CE6F79', textDecorationLine: 'underline' },
  footer:           { padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: '#F3C3C5', backgroundColor: '#FADAD9' },
  totalRow:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  totalLabel:       { fontSize: 18, fontWeight: '700', color: '#1a1612' },
  totalAmount:      { fontSize: 18, fontWeight: '800', color: '#CE6F79' },
  checkoutBtn:      { backgroundColor: '#FFDD32', borderRadius: 14, padding: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  checkoutDisabled: { opacity: 0.4 },
  checkoutText:     { fontSize: 16, fontWeight: '700', color: '#1a1612' },
});
