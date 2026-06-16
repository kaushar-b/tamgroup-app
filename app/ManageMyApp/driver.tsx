import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ref, onValue, update, set, query, orderByChild } from 'firebase/database';
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
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  assignedToDriver: boolean;
  driverStatus: string | null;
  customerPushToken?: string | null;
  createdAt: number;
};

function DriverOrderCard({ order, isCompleted }: { order: Order; isCompleted: boolean }) {
  const [open, setOpen] = useState(false);
  const ds = order.driverStatus;

  const confirmStatus = (newStatus: 'on_the_way' | 'delivered') => {
    const label = newStatus === 'on_the_way' ? 'mark this order as On the Way' : 'mark this order as Delivered';
    Alert.alert(
      'Confirm',
      `Are you sure you want to ${label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            const updates: Record<string, string> = { driverStatus: newStatus };
            if (newStatus === 'delivered') updates.status = 'completed';
            update(ref(db, `orders/${order.id}`), updates);

            if (order.customerPushToken) {
              if (newStatus === 'on_the_way') {
                sendPushNotification(
                  order.customerPushToken,
                  'Delivery on the Way',
                  'Your order is on the way!',
                  CHANNELS.CUSTOMER
                );
              } else {
                sendPushNotification(
                  order.customerPushToken,
                  'Order Delivered',
                  'Your order has been delivered. Enjoy your meal!',
                  CHANNELS.CUSTOMER
                );
              }
            }
          }
        }
      ]
    );
  };

  const statusColor = ds === 'delivered' ? '#22c55e' : ds === 'on_the_way' ? '#f59e0b' : '#3b82f6';
  const statusText  = ds === 'delivered' ? 'Delivered' : ds === 'on_the_way' ? 'On the Way' : 'Assigned';

  return (
    <View style={[
      c.card,
      ds === 'delivered' ? c.cardDone :
      ds === 'on_the_way' ? c.cardOnWay : c.cardAssigned
    ]}>
      <TouchableOpacity style={c.cardHead} onPress={() => setOpen(o => !o)}>
        <View style={c.cardInfo}>
          <Text style={c.cardName}>{order.name}</Text>
          <Text style={c.cardMeta}>{order.date}</Text>
          <Text style={c.cardAddr} numberOfLines={1}>{order.address || 'No address'}</Text>
          <View style={[c.statusBadge, { backgroundColor: statusColor + '22' }]}>
            <Text style={[c.statusTxt, { color: statusColor }]}>{statusText}</Text>
          </View>
        </View>
        <View style={c.cardRight}>
          <Text style={c.cardTotal}>P {order.total}.00</Text>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={RED} />
        </View>
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
          <View style={c.row}>
            <Text style={c.rowTotal2}>Total</Text>
            <Text style={c.rowTotalAmt}>P {order.total}.00</Text>
          </View>
          {order.address ? (
            <View style={c.infoRow}>
              <Ionicons name="location-outline" size={14} color="#6b6b6b" />
              <Text style={c.infoTxt}>{order.address}</Text>
            </View>
          ) : null}
          {order.phone ? (
            <View style={c.infoRow}>
              <Ionicons name="call-outline" size={14} color="#6b6b6b" />
              <Text style={c.infoTxt}>{order.phone}</Text>
            </View>
          ) : null}

          {!isCompleted && (
            <View style={c.btnGroup}>
              {/* ON THE WAY button — only show if not yet on_the_way or delivered */}
              <TouchableOpacity
                style={[
                  c.driverBtn,
                  ds === 'on_the_way' || ds === 'delivered' ? c.btnDone : c.btnOnWay
                ]}
                onPress={() => {
                  if (ds !== 'on_the_way' && ds !== 'delivered') {
                    confirmStatus('on_the_way');
                  }
                }}
                disabled={ds === 'on_the_way' || ds === 'delivered'}
              >
                <Ionicons name="car-sport" size={16} color="#fff" />
                <Text style={c.driverBtnTxt}>On the Way</Text>
                {(ds === 'on_the_way' || ds === 'delivered') && (
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                )}
              </TouchableOpacity>

              {/* DELIVERED button — only enabled after on_the_way */}
              <TouchableOpacity
                style={[
                  c.driverBtn,
                  ds === 'delivered' ? c.btnDelivered :
                  ds === 'on_the_way' ? c.btnDeliverReady : c.btnDisabled
                ]}
                onPress={() => {
                  if (ds === 'on_the_way') confirmStatus('delivered');
                }}
                disabled={ds !== 'on_the_way'}
              >
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
                <Text style={c.driverBtnTxt}>Delivered</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function DriverDashboard() {
  const router = useRouter();
  const [tab, setTab]       = useState<'orders' | 'completed'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const token = await registerForPushToken();
      if (token) {
        await set(ref(db, 'staffTokens/driver'), token);
      }
    })();
  }, []);

  useEffect(() => {
    const q = query(ref(db, 'orders'), orderByChild('createdAt'));
    return onValue(q, snap => {
      const data = snap.val();
      if (!data) { setOrders([]); return; }
      setOrders((Object.values(data) as Order[]).reverse());
    });
  }, []);

  const activeOrders    = orders.filter(o => o.assignedToDriver && o.driverStatus !== 'delivered');
  const completedOrders = orders.filter(o => o.driverStatus === 'delivered');

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Sign out of driver dashboard?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await signOut(auth); router.replace('/auth/sign-in'); } }
    ]);
  };

  const shown = tab === 'orders' ? activeOrders : completedOrders;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Driver Dashboard</Text>
          <Text style={s.headerSub}>Casa Del Sol</Text>
        </View>
        <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={s.tabBar}>
        {([
          { key: 'orders' as const,    label: 'My Orders',        count: activeOrders.length },
          { key: 'completed' as const, label: 'Completed',        count: 0 },
        ]).map(t => (
          <TouchableOpacity
            key={t.key}
            style={[s.tabBtn, tab === t.key && s.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Ionicons
              name={t.key === 'orders' ? 'car-sport' : 'checkmark-circle'}
              size={14}
              color={tab === t.key ? '#fff' : '#aaa'}
            />
            <Text style={[s.tabTxt, tab === t.key && s.tabTxtActive]}>{t.label}</Text>
            {t.count > 0 && (
              <View style={[s.tabBadge, tab === t.key && s.tabBadgeActive]}>
                <Text style={[s.tabBadgeTxt, tab === t.key && s.tabBadgeTxtActive]}>{t.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {shown.length === 0 ? (
        <View style={s.empty}>
          <Ionicons
            name={tab === 'orders' ? 'car-sport-outline' : 'checkmark-circle-outline'}
            size={56}
            color={RED}
          />
          <Text style={s.emptyTxt}>
            {tab === 'orders' ? 'No orders assigned yet' : 'No completed deliveries'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {shown.map(o => (
            <DriverOrderCard key={o.id} order={o} isCompleted={tab === 'completed'} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:         { flex: 1, backgroundColor: YELLOW },
  header:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: RED },
  headerTitle:       { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub:         { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  signOutBtn:        { padding: 8 },
  tabBar:            { flexDirection: 'row', backgroundColor: '#1a1612', padding: 10, gap: 8 },
  tabBtn:            { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)' },
  tabActive:         { backgroundColor: RED },
  tabTxt:            { fontSize: 12, fontWeight: '700', color: '#aaa' },
  tabTxtActive:      { color: '#fff' },
  tabBadge:          { backgroundColor: YELLOW, borderRadius: 8, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  tabBadgeActive:    { backgroundColor: '#fff' },
  tabBadgeTxt:       { fontSize: 10, fontWeight: '800', color: '#1a1612' },
  tabBadgeTxtActive: { color: RED },
  empty:             { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTxt:          { fontSize: 16, fontWeight: '700', color: '#1a1612' },
});

const c = StyleSheet.create({
  card:           { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: '#eee', elevation: 2 },
  cardDone:       { borderColor: '#22c55e' },
  cardOnWay:      { borderColor: '#f59e0b' },
  cardAssigned:   { borderColor: '#3b82f6' },
  cardHead:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  cardInfo:       { flex: 1 },
  cardName:       { fontSize: 15, fontWeight: '800', color: '#1a1612' },
  cardMeta:       { fontSize: 12, color: '#6b6b6b', marginTop: 2 },
  cardAddr:       { fontSize: 12, color: '#6b6b6b', marginTop: 2 },
  statusBadge:    { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginTop: 5 },
  statusTxt:      { fontSize: 11, fontWeight: '700' },
  cardRight:      { alignItems: 'flex-end', gap: 4 },
  cardTotal:      { fontSize: 16, fontWeight: '800', color: RED },
  cardBody:       { paddingHorizontal: 14, paddingBottom: 14 },
  divider:        { height: 1, backgroundColor: YELLOW, marginVertical: 10 },
  row:            { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rowItem:        { fontSize: 13, color: '#6b6b6b', flex: 1, paddingRight: 8 },
  rowPrice:       { fontSize: 13, fontWeight: '600', color: '#1a1612' },
  rowTotal2:      { fontSize: 15, fontWeight: '800', color: '#1a1612' },
  rowTotalAmt:    { fontSize: 15, fontWeight: '800', color: RED },
  infoRow:        { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  infoTxt:        { fontSize: 13, color: '#6b6b6b', flex: 1 },
  btnGroup:       { flexDirection: 'row', gap: 10, marginTop: 14 },
  driverBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 12 },
  btnOnWay:       { backgroundColor: '#f59e0b' },
  btnDeliverReady:{ backgroundColor: RED },
  btnDelivered:   { backgroundColor: '#22c55e' },
  btnDone:        { backgroundColor: '#22c55e' },
  btnDisabled:    { backgroundColor: '#d1d5db' },
  driverBtnTxt:   { fontSize: 12, fontWeight: '800', color: '#fff' },
});
