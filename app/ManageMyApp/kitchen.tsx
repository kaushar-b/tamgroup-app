import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../../lib/firebase';

const RED    = '#b60015';
const YELLOW = '#FFD544';
const GREEN  = '#22c55e';
const DARK   = '#1a1612';

type Order = {
  id: string; orderNumber?: number | null; date: string; name: string;
  orderType: 'pickup' | 'delivery';
  items: { name: string; price: number; quantity: number }[];
  status: string; cooked?: boolean; createdAt: number;
};

function KitchenCard({ order }: { order: Order }) {
  const cooked = !!order.cooked;
  const toggleCooked = () => {
    if (!cooked) {
      Alert.alert('Mark as Cooked', 'Mark order as cooked?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => { await update(ref(db, `orders/${order.id}`), { cooked: true }); } },
      ]);
    } else {
      Alert.alert('Undo', 'Mark this order as NOT cooked?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => { await update(ref(db, `orders/${order.id}`), { cooked: false }); } },
      ]);
    }
  };

  return (
    <View style={c.card}>
      <View style={c.orderBar}>
        <Text style={c.orderBarLabel}>Order</Text>
        <Text style={c.orderBarNum}>#{order.orderNumber ? String(order.orderNumber).padStart(3, '0') : '--'}</Text>
      </View>
      <View style={c.cardInner}>
        <View style={c.cardHeader}>
          <Text style={c.cardDate}>{order.date}</Text>
          <View style={c.typeBadge}><Text style={c.typeBadgeText}>{order.orderType.toUpperCase()}</Text></View>
        </View>
        <Text style={c.cardName}>{order.name}</Text>

        <View style={c.divider} />
        {order.items?.map((item, i) => (
          <View key={i} style={c.itemRow}>
            <Text style={c.itemName}>{item.quantity}× {item.name}</Text>
          </View>
        ))}

        <TouchableOpacity style={[c.cookBtn, cooked && c.cookBtnDone]} onPress={toggleCooked} activeOpacity={0.85}>
          <Ionicons name={cooked ? 'checkmark-circle' : 'flame-outline'} size={22} color={cooked ? '#fff' : GREEN} />
          <Text style={[c.cookBtnTxt, cooked && c.cookBtnTxtDone]}>{cooked ? 'Cooked' : 'Order Cooked'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Kitchen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const todayLabel = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const [dateFilter, setDateFilter] = useState<string>(todayLabel);

  useEffect(() => {
    const unsub = onValue(ref(db, 'orders'), snap => {
      const all: Order[] = [];
      snap.forEach(child => { all.push({ id: child.key!, ...child.val() }); });
      all.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
      setOrders(all);
      setLoading(false);
    });
    return unsub;
  }, []);

  const shown = dateFilter
    ? orders.filter(o => o.date && (o.date.startsWith(dateFilter) || o.date.split(',')[0].trim() === dateFilter))
    : orders;

  const otherDates = Array.from(new Set(orders.map(o => (o.date || '').split(',')[0].trim()).filter(Boolean)))
    .filter(d => d !== todayLabel);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={DARK} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Kitchen</Text>
        <View style={{ width: 76 }} />
      </View>

      <View style={s.dateFilterRow}>
        <Text style={s.dateFilterLabel}>Date:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
          <TouchableOpacity style={[s.dateChip, dateFilter === todayLabel && s.dateChipActive]} onPress={() => setDateFilter(todayLabel)}>
            <Text style={[s.dateChipTxt, dateFilter === todayLabel && s.dateChipTxtActive]}>Today - {todayLabel}</Text>
          </TouchableOpacity>
          {otherDates.map(d => (
            <TouchableOpacity key={d} style={[s.dateChip, dateFilter === d && s.dateChipActive]} onPress={() => setDateFilter(d)}>
              <Text style={[s.dateChipTxt, dateFilter === d && s.dateChipTxtActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[s.dateChip, dateFilter === '' && s.dateChipActive]} onPress={() => setDateFilter('')}>
            <Text style={[s.dateChipTxt, dateFilter === '' && s.dateChipTxtActive]}>All</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading ? (
        <View style={s.center}><ActivityIndicator size="large" color={RED} /></View>
      ) : shown.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="restaurant-outline" size={56} color={RED} />
          <Text style={s.emptyTxt}>No orders for this date</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {shown.map(o => <KitchenCard key={o.id} order={o} />)}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: YELLOW },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  backBtn:         { flexDirection: 'row', alignItems: 'center', gap: 4, width: 76 },
  backText:        { fontSize: 16, fontWeight: '700', color: DARK },
  headerTitle:     { fontSize: 17, fontWeight: '800', color: DARK, flex: 1, textAlign: 'center' },
  dateFilterRow:   { backgroundColor: '#fff', paddingVertical: 10, paddingLeft: 16, borderBottomWidth: 1, borderBottomColor: YELLOW, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateFilterLabel: { fontSize: 12, fontWeight: '700', color: DARK, flexShrink: 0 },
  dateChip:        { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f3f3f3', borderWidth: 1, borderColor: '#eee' },
  dateChipActive:  { backgroundColor: RED, borderColor: RED },
  dateChipTxt:     { fontSize: 12, fontWeight: '700', color: '#6b6b6b' },
  dateChipTxtActive:{ color: '#fff' },
  center:          { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTxt:        { fontSize: 16, fontWeight: '700', color: DARK },
});

const c = StyleSheet.create({
  card:         { backgroundColor: '#fff', borderRadius: 16, marginBottom: 14, elevation: 2, overflow: 'hidden' },
  orderBar:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: RED, paddingHorizontal: 14, paddingVertical: 9 },
  orderBarLabel:{ fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  orderBarNum:  { fontSize: 22, fontWeight: '900', color: '#fff' },
  cardInner:    { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 10 },
  cardHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardDate:     { fontSize: 15, fontWeight: '700', color: DARK },
  typeBadge:    { backgroundColor: YELLOW, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  typeBadgeText:{ fontSize: 10, fontWeight: '900', color: DARK },
  cardName:     { fontSize: 16, fontWeight: '800', color: DARK, marginBottom: 4 },
  divider:      { height: 1, backgroundColor: YELLOW, marginVertical: 10 },
  itemRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemName:     { fontSize: 15, fontWeight: '700', color: DARK },
  cookBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#fff', borderWidth: 2, borderColor: GREEN, borderRadius: 14, paddingVertical: 18, marginTop: 14 },
  cookBtnDone:  { backgroundColor: GREEN, borderColor: GREEN },
  cookBtnTxt:   { fontSize: 16, fontWeight: '800', color: GREEN },
  cookBtnTxtDone:{ color: '#fff' },
});