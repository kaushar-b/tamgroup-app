import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ref, onValue, update, set, get, query, orderByChild, remove } from 'firebase/database';
import { db, auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { registerForPushToken, sendPushNotification, CHANNELS } from '../../lib/notifications';

const RED    = '#b60015';
const YELLOW = '#FFD544';

type Order = {
  id: string;
  date: string;
  name: string;
  phone: string;
  orderType: 'pickup' | 'delivery';
  address?: string;
  paymentMethod?: string | null;
  tip?: number;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  assignedToDriver: boolean;
  driverStatus: string | null;
  preparingStatus?: string | null;
  customerPushToken?: string | null;
  createdAt: number;
};

function statusInfo(order: Order): { text: string; color: string } {
  if (order.driverStatus === 'delivered')        return { text: 'Delivered', color: '#22c55e' };
  if (order.driverStatus === 'on_the_way')       return { text: 'On the Way', color: '#f59e0b' };
  if (order.driverStatus === 'preparing')        return { text: 'Preparing', color: '#3b82f6' };
  if (order.assignedToDriver)                    return { text: 'Driver Assigned', color: '#3b82f6' };
  if (order.preparingStatus === 'ready')         return { text: 'Ready for Pickup', color: '#22c55e' };
  if (order.preparingStatus === 'preparing')     return { text: 'Preparing', color: '#3b82f6' };
  if (order.status === 'completed')              return { text: 'Completed', color: '#22c55e' };
  return { text: 'Pending', color: '#6b6b6b' };
}

function OrderCard({ order, role }: { order: Order; role: 'live' | 'sent' | 'completed' | 'pickup' }) {
  const [open, setOpen] = useState(false);
  const si = statusInfo(order);

  const assignDriver = () => {
    Alert.alert('Assign to Driver', `Send "${order.name}"'s order to driver?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Assign', onPress: async () => {
          await update(ref(db, `orders/${order.id}`), { assignedToDriver: true, driverStatus: 'preparing' });

          const driverTokenSnap = await get(ref(db, 'staffTokens/driver'));
          const driverToken = driverTokenSnap.val();
          if (driverToken) {
            sendPushNotification(
              driverToken,
              'Time for Delivery!',
              `New order from ${order.name} -- P ${order.total}.00`,
              CHANNELS.DRIVER
            );
          }
        }
      }
    ]);
  };

  const deleteOrder = () => {
    Alert.alert('Delete Order', 'Permanently delete this order?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await remove(ref(db, `orders/${order.id}`));
      }},
    ]);
  };

  const markPickupPreparing = () =>
    update(ref(db, `orders/${order.id}`), { preparingStatus: 'preparing' });

  const markPickupReady = async () => {
    await update(ref(db, `orders/${order.id}`), { preparingStatus: 'ready', status: 'completed' });
    if (order.customerPushToken) {
      sendPushNotification(
        order.customerPushToken,
        'Order Ready',
        'Your order is ready for pickup!',
        CHANNELS.CUSTOMER
      );
    }
  };

  return (
    <View style={[
      c.card,
      order.driverStatus === 'delivered' || order.status === 'completed' ? c.cardDone :
      order.driverStatus === 'on_the_way' ? c.cardOnWay :
      order.assignedToDriver ? c.cardAssigned : null
    ]}>
      <TouchableOpacity style={c.cardHead} onPress={() => setOpen(o => !o)}>
        <View style={[c.typeBadge, order.orderType === 'delivery' ? c.badgeDelivery : c.badgePickup]}>
          <Ionicons name={order.orderType === 'delivery' ? 'car-sport' : 'storefront'} size={12} color="#fff" />
          <Text style={c.typeTxt}>{order.orderType === 'delivery' ? 'Delivery' : 'Pick Up'}</Text>
        </View>
        <View style={c.cardInfo}>
          <Text style={c.cardName}>{order.name}</Text>
          <Text style={c.cardMeta}>{order.date} · P {order.total}.00</Text>
          <View style={[c.statusBadge, { backgroundColor: si.color + '22' }]}>
            <Text style={[c.statusTxt, { color: si.color }]}>{si.text}</Text>
          </View>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={RED} />
      </TouchableOpacity>

      {open && (
        <View style={c.cardBody}>
          <View style={c.divider} />
          {order.items.map((item, i) => (
            <View key={i} style={c.row}>
              <Text style={c.rowItem}>{item.name} × {item.quantity}</Text>
              <Text style={c.rowPrice}>P {item.price * item.quantity}.00</Text>
            </View>
          ))}
          <View style={c.divider} />
          <View style={c.row}><Text style={c.rowTotal}>Total</Text><Text style={c.rowTotalAmt}>P {order.total}.00</Text></View>
          {order.orderType === 'delivery' && order.address ? (
            <View style={c.infoRow}><Ionicons name="location-outline" size={14} color="#6b6b6b" /><Text style={c.infoTxt}>{order.address}</Text></View>
          ) : null}
          {order.phone ? (
            <View style={c.infoRow}><Ionicons name="call-outline" size={14} color="#6b6b6b" /><Text style={c.infoTxt}>{order.phone}</Text></View>
          ) : null}
          {order.paymentMethod ? (
            <View style={c.infoRow}><Ionicons name="card-outline" size={14} color="#6b6b6b" /><Text style={c.infoTxt}>{order.paymentMethod === 'online' ? 'Pay Online' : 'Pay on Delivery'}</Text></View>
          ) : null}
          {order.tip ? (
            <View style={c.infoRow}><Ionicons name="gift-outline" size={14} color="#6b6b6b" /><Text style={c.infoTxt}>Tip: P{order.tip}.00</Text></View>
          ) : null}

          {/* ACTIONS */}
          {role === 'live' && order.orderType === 'delivery' && !order.assignedToDriver && (
            <TouchableOpacity style={c.actionBtn} onPress={assignDriver}>
              <Ionicons name="car-sport" size={18} color="#fff" />
              <Text style={c.actionTxt}>Assign to Driver</Text>
            </TouchableOpacity>
          )}
          {role === 'live' && order.orderType === 'pickup' && order.preparingStatus !== 'ready' && order.status !== 'completed' && (
            <>
              {!order.preparingStatus && (
                <TouchableOpacity style={[c.actionBtn, { backgroundColor: '#3b82f6' }]} onPress={markPickupPreparing}>
                  <Ionicons name="flame" size={18} color="#fff" />
                  <Text style={c.actionTxt}>Mark as Preparing</Text>
                </TouchableOpacity>
              )}
              {order.preparingStatus === 'preparing' && (
                <TouchableOpacity style={[c.actionBtn, { backgroundColor: '#22c55e' }]} onPress={markPickupReady}>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text style={c.actionTxt}>Ready for Pickup</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {role === 'sent' && (
            <View style={c.sentNote}>
              <Ionicons name="information-circle-outline" size={16} color="#3b82f6" />
              <Text style={c.sentNoteTxt}>Driver is handling this order — status updates live below.</Text>
            </View>
          )}
          {role === 'completed' && (
            <TouchableOpacity style={c.deleteBtn} onPress={deleteOrder}>
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={c.deleteBtnTxt}>Delete Order</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export default function ManagerDashboard() {
  const router = useRouter();
  const [tab, setTab]       = useState<'live' | 'sent' | 'completed' | 'pickup'>('live');
  const [dateFilter, setDateFilter] = useState<string>('');  // 'YYYY-MM-DD' or ''
  const [orders, setOrders] = useState<Order[]>([]);
  const knownOrderIds = useRef<Set<string>>(new Set());
  const isFirstLoad    = useRef(true);

  // Register this device's push token as the MANAGER token
  useEffect(() => {
    (async () => {
      try {
        const token = await registerForPushToken();
        if (token) {
          await set(ref(db, 'staffTokens/manager'), token);
        }
        await set(ref(db, 'debug/managerTokenAttempt'), {
          token: token ?? 'NULL',
          timestamp: Date.now(),
        });
      } catch (err: any) {
        await set(ref(db, 'debug/managerTokenAttempt'), {
          token: 'ERROR',
          error: err?.message ?? String(err),
          timestamp: Date.now(),
        });
      }
    })();
  }, []);

  // Listen for orders + fire a LOCAL notification when a brand-new order arrives
  useEffect(() => {
    const q = query(ref(db, 'orders'), orderByChild('createdAt'));
    return onValue(q, snap => {
      const data = snap.val();
      if (!data) { setOrders([]); return; }
      const list = (Object.values(data) as Order[]);

      if (isFirstLoad.current) {
        list.forEach(o => knownOrderIds.current.add(o.id));
        isFirstLoad.current = false;
      } else {
        // New order push now comes from the customer's device at checkout
        // (works even when this dashboard is killed — see checkout.tsx)
        const newOnes = list.filter(o => !knownOrderIds.current.has(o.id));
        newOnes.forEach(o => knownOrderIds.current.add(o.id));
      }

      setOrders(list.reverse());
    });
  }, []);

  const liveOrders      = orders.filter(o => o.status !== 'completed' && o.driverStatus !== 'delivered' && !o.assignedToDriver);
  const pickupOrders    = orders.filter(o => o.orderType === 'pickup' && o.preparingStatus === 'ready');
  const sentOrders      = orders.filter(o => o.assignedToDriver && o.driverStatus !== 'delivered');
  const completedOrders = orders.filter(o => o.status === 'completed' || o.driverStatus === 'delivered');

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Sign out of manager dashboard?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(auth); router.replace('/auth/sign-in'); } }
    ]);
  };

  const TABS: { key: 'live' | 'sent' | 'completed'; label: string; count: number }[] = [
    { key: 'live',      label: 'Live Orders',         count: liveOrders.length },
    { key: 'sent',      label: 'Sent for Delivery',   count: sentOrders.length },
    { key: 'completed', label: 'Completed',            count: completedOrders.length },
    { key: 'pickup',    label: 'Ready Pickups',         count: pickupOrders.length },
  ];

  const filteredCompleted = dateFilter
    ? completedOrders.filter(o => o.date.startsWith(dateFilter) || o.date.split(',')[0].trim() === dateFilter)
    : completedOrders;
  const shown = tab === 'live' ? liveOrders : tab === 'sent' ? sentOrders : tab === 'pickup' ? pickupOrders : filteredCompleted;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Manager Dashboard</Text>
          <Text style={s.headerSub}>Casa Del Sol</Text>
        </View>
        <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={s.tabBar}>
        <View style={s.tabRow}>
          {TABS.slice(0, 2).map(t => (
            <TouchableOpacity key={t.key} style={[s.tabBtn, tab === t.key && s.tabActive]} onPress={() => setTab(t.key)}>
              <Text style={[s.tabTxt, tab === t.key && s.tabTxtActive]}>{t.label}</Text>
              {t.count > 0 && (
                <View style={[s.tabBadge, tab === t.key && s.tabBadgeActive]}>
                  <Text style={[s.tabBadgeTxt, tab === t.key && s.tabBadgeTxtActive]}>{t.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={s.tabRow}>
          {TABS.slice(2, 4).map(t => (
            <TouchableOpacity key={t.key} style={[s.tabBtn, tab === t.key && s.tabActive]} onPress={() => setTab(t.key)}>
              <Text style={[s.tabTxt, tab === t.key && s.tabTxtActive]}>{t.label}</Text>
              {t.count > 0 && (
                <View style={[s.tabBadge, tab === t.key && s.tabBadgeActive]}>
                  <Text style={[s.tabBadgeTxt, tab === t.key && s.tabBadgeTxtActive]}>{t.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {tab === 'completed' && (
        <View style={s.dateFilterRow}>
          <Text style={s.dateFilterLabel}>Filter by date:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
            <TouchableOpacity
              style={[s.dateChip, dateFilter === '' && s.dateChipActive]}
              onPress={() => setDateFilter('')}
            >
              <Text style={[s.dateChipTxt, dateFilter === '' && s.dateChipTxtActive]}>All</Text>
            </TouchableOpacity>
            {Array.from(new Set(completedOrders.map(o => o.date.split(',')[0].trim()))).map(d => (
              <TouchableOpacity
                key={d}
                style={[s.dateChip, dateFilter === d && s.dateChipActive]}
                onPress={() => setDateFilter(prev => prev === d ? '' : d)}
              >
                <Text style={[s.dateChipTxt, dateFilter === d && s.dateChipTxtActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {shown.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="receipt-outline" size={56} color={RED} />
          <Text style={s.emptyTxt}>
            {tab === 'live' ? 'No live orders yet' : tab === 'sent' ? 'No orders with driver' : tab === 'pickup' ? 'No ready pickups' : 'No completed orders'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {shown.map(o => <OrderCard key={o.id} order={o} role={tab as 'live' | 'sent' | 'completed' | 'pickup'} />)}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: YELLOW },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: RED },
  headerTitle:    { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub:      { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  signOutBtn:     { padding: 8 },
  tabBar:         { backgroundColor: '#1a1612', padding: 10, gap: 8 },
  tabRow:         { flexDirection: 'row', gap: 8 },
  tabBtn:         { flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)' },
  tabActive:      { backgroundColor: RED },
  tabTxt:         { fontSize: 11, fontWeight: '700', color: '#aaa' },
  tabTxtActive:   { color: '#fff' },
  tabBadge:       { backgroundColor: YELLOW, borderRadius: 8, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  tabBadgeActive: { backgroundColor: '#fff' },
  tabBadgeTxt:    { fontSize: 10, fontWeight: '800', color: '#1a1612' },
  tabBadgeTxtActive: { color: RED },
  empty:          { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTxt:       { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  dateFilterRow:  { backgroundColor: '#fff', paddingVertical: 10, paddingLeft: 16, borderBottomWidth: 1, borderBottomColor: YELLOW, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateFilterLabel:{ fontSize: 12, fontWeight: '700', color: '#1a1612', flexShrink: 0 },
  dateChip:       { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#f3f3f3', borderWidth: 1, borderColor: '#eee' },
  dateChipActive: { backgroundColor: RED, borderColor: RED },
  dateChipTxt:    { fontSize: 12, fontWeight: '700', color: '#6b6b6b' },
  dateChipTxtActive:{ color: '#fff' },
});

const c = StyleSheet.create({
  card:         { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: '#eee', elevation: 2 },
  cardDone:     { borderColor: '#22c55e' },
  cardOnWay:    { borderColor: '#f59e0b' },
  cardAssigned: { borderColor: '#3b82f6' },
  cardHead:     { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  typeBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  badgeDelivery:{ backgroundColor: RED },
  badgePickup:  { backgroundColor: '#1a1612' },
  typeTxt:      { fontSize: 11, fontWeight: '800', color: '#fff' },
  cardInfo:     { flex: 1 },
  cardName:     { fontSize: 15, fontWeight: '800', color: '#1a1612' },
  cardMeta:     { fontSize: 12, color: '#6b6b6b', marginTop: 2 },
  statusBadge:  { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginTop: 5 },
  statusTxt:    { fontSize: 11, fontWeight: '700' },
  cardBody:     { paddingHorizontal: 14, paddingBottom: 14 },
  divider:      { height: 1, backgroundColor: YELLOW, marginVertical: 10 },
  row:          { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rowItem:      { fontSize: 13, color: '#6b6b6b', flex: 1, paddingRight: 8 },
  rowPrice:     { fontSize: 13, fontWeight: '600', color: '#1a1612' },
  rowTotal:     { fontSize: 15, fontWeight: '800', color: '#1a1612' },
  rowTotalAmt:  { fontSize: 15, fontWeight: '800', color: RED },
  infoRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  infoTxt:      { fontSize: 13, color: '#6b6b6b', flex: 1 },
  actionBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: RED },
  actionTxt:    { fontSize: 14, fontWeight: '800', color: '#fff' },
  sentNote:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: '#dbeafe' },
  sentNoteTxt:  { fontSize: 13, color: '#1d4ed8', flex: 1 },
  deleteBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: '#6b6b6b' },
  deleteBtnTxt: { fontSize: 13, fontWeight: '800', color: '#fff' },
});
