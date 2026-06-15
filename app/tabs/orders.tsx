import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useCart } from '../../context/CartContext';

const RED    = '#b60015';
const YELLOW = '#FFD544';

type OrderItem = { id: string; name: string; price: number; quantity: number; icon: string };

type SavedOrder = {
  id: string;
  date: string;
  orderType: 'pickup' | 'delivery';
  name: string;
  phone: string;
  address?: string;
  items: OrderItem[];
  total: number;
  status: string;
  driverStatus: string | null;
  preparingStatus?: string | null;
  assignedToDriver: boolean;
};

function statusLabel(order: SavedOrder): { text: string; color: string; icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap } {
  if (order.driverStatus === 'delivered')     return { text: 'Delivered',           color: '#22c55e', icon: 'checkmark-circle' };
  if (order.driverStatus === 'on_the_way')    return { text: 'On the Way',          color: '#f59e0b', icon: 'car-sport' };
  if (order.driverStatus === 'preparing')     return { text: 'Preparing',           color: '#3b82f6', icon: 'flame' };
  if (order.assignedToDriver)                 return { text: 'Driver Assigned',     color: '#3b82f6', icon: 'person' };
  if (order.preparingStatus === 'ready')      return { text: 'Ready for Pickup',    color: '#22c55e', icon: 'checkmark-circle' };
  if (order.preparingStatus === 'preparing')  return { text: 'Preparing',           color: '#3b82f6', icon: 'flame' };
  if (order.status === 'completed')           return { text: 'Completed',           color: '#22c55e', icon: 'checkmark-circle' };
  return { text: 'Pending', color: '#6b6b6b', icon: 'time' };
}

export default function Orders() {
  const router = useRouter();
  const { addToCart, clearCart } = useCart();
  const [orders, setOrders]       = useState<SavedOrder[]>([]);
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  // We filter orders by the user's phone stored during checkout
  // Since we save phone as "+267XXXXXXXX", we can match on that
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {});
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(ref(db, 'orders'), orderByChild('createdAt'));
    const unsub = onValue(q, snap => {
      const data = snap.val();
      if (!data) { setOrders([]); return; }
      const all = (Object.values(data) as SavedOrder[]).reverse();
      setOrders(all);
    });
    return () => unsub();
  }, []);

  const handleReorder = (order: SavedOrder) => {
    Alert.alert('Reorder', 'Add all items from this order to your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Add to Cart', onPress: () => {
          clearCart();
          order.items.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
              addToCart(item.id, { id: item.id, name: item.name, price: item.price, icon: item.icon || 'restaurant' });
            }
          });
          router.push('/tabs/cart');
        }
      }
    ]);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.push('/tabs')} style={s.homeBtn}>
          <Ionicons name="home-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>My Orders</Text>
          <Text style={s.subtitle}>Your order history</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {orders.length === 0 ? (
        <View style={s.emptyWrap}>
          <Ionicons name="receipt-outline" size={72} color={RED} />
          <Text style={s.emptyTitle}>No orders yet</Text>
          <Text style={s.emptyText}>Your order history will appear here</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
          {orders.map(order => {
            const sl = statusLabel(order);
            return (
              <View key={order.id} style={s.card}>
                <TouchableOpacity style={s.cardHeader} onPress={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <View style={s.cardLeft}>
                    <Text style={s.cardDate}>{order.date}</Text>
                    <Text style={s.cardType}>{order.orderType === 'pickup' ? 'Pick Up' : 'Delivery'}</Text>
                    <View style={[s.statusBadge, { backgroundColor: sl.color + '22' }]}>
                      <Ionicons name={sl.icon} size={12} color={sl.color} />
                      <Text style={[s.statusText, { color: sl.color }]}>{sl.text}</Text>
                    </View>
                  </View>
                  <View style={s.cardRight}>
                    <Text style={s.cardTotal}>P {order.total}.00</Text>
                    <Ionicons name={expanded === order.id ? 'chevron-up' : 'chevron-down'} size={18} color={RED} />
                  </View>
                </TouchableOpacity>

                {expanded === order.id && (
                  <View style={s.cardBody}>
                    <View style={s.divider} />
                    {order.items.map((item, idx) => (
                      <View key={idx} style={s.itemRow}>
                        <Text style={s.itemName}>{item.name} × {item.quantity}</Text>
                        <Text style={s.itemPrice}>P {item.price * item.quantity}.00</Text>
                      </View>
                    ))}
                    <View style={s.divider} />
                    <Text style={s.enjoyText}>Enjoyed your meal?</Text>
                    <TouchableOpacity style={s.reorderBtn} onPress={() => handleReorder(order)}>
                      <Ionicons name="refresh" size={18} color="#fff" />
                      <Text style={s.reorderText}>Order Again</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: YELLOW },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: RED },
  homeBtn:      { width: 44, height: 44, justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title:        { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle:     { fontSize: 13, color: '#fff', opacity: 0.85, marginTop: 2 },
  emptyWrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle:   { fontSize: 20, fontWeight: '700', color: '#1a1612' },
  emptyText:    { fontSize: 14, color: '#6b6b6b' },
  card:         { backgroundColor: '#fff', borderRadius: 16, marginBottom: 14, overflow: 'hidden', elevation: 2 },
  cardHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  cardLeft:     { gap: 4, flex: 1 },
  cardDate:     { fontSize: 13, color: '#6b6b6b' },
  cardType:     { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  statusBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 4 },
  statusText:   { fontSize: 12, fontWeight: '700' },
  cardRight:    { alignItems: 'flex-end', gap: 4 },
  cardTotal:    { fontSize: 16, fontWeight: '800', color: RED },
  cardBody:     { paddingHorizontal: 16, paddingBottom: 16 },
  divider:      { height: 1, backgroundColor: YELLOW, marginVertical: 10 },
  itemRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemName:     { fontSize: 13, color: '#6b6b6b', flex: 1, paddingRight: 8 },
  itemPrice:    { fontSize: 13, fontWeight: '600', color: '#1a1612' },
  enjoyText:    { fontSize: 13, color: '#6b6b6b', textAlign: 'center', marginBottom: 10 },
  reorderBtn:   { backgroundColor: RED, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  reorderText:  { fontSize: 15, fontWeight: '700', color: '#fff' },
});
