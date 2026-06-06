import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const DEMO_ORDERS = [
  { id: '1', name: 'Kefilwe Moyo', type: 'delivery', address: 'Plot 123, Phakalane', phone: '+267 71 234 567', items: [{ name: 'Grilled Chicken Burger', qty: 2, price: 85 }, { name: 'Loaded Fries', qty: 1, price: 45 }], total: 215, time: '2:34 PM', status: 'pending' },
  { id: '2', name: 'Thabo Nkosi', type: 'pickup', address: '', phone: '+267 77 890 123', items: [{ name: 'Beef Burger', qty: 1, price: 90 }, { name: 'Coca Cola', qty: 2, price: 20 }], total: 130, time: '2:41 PM', status: 'pending' },
  { id: '3', name: 'Mpho Seretse', type: 'delivery', address: 'Unit 5, Gaborone West', phone: '+267 72 345 678', items: [{ name: 'Grilled Steak', qty: 1, price: 160 }], total: 190, time: '2:52 PM', status: 'completed' },
];

type Order = typeof DEMO_ORDERS[0];

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'orders' | 'menu'>('orders');
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'completed' ? 'pending' : 'completed' } : o));
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => { signOut(); router.replace('/auth/sign-in'); }} style={s.signOutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#D10000" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={s.tabBar}>
        <TouchableOpacity style={[s.tabBtn, tab === 'orders' && s.tabActive]} onPress={() => setTab('orders')}>
          <Ionicons name="receipt" size={16} color={tab === 'orders' ? '#fff' : '#6b6b6b'} />
          <Text style={[s.tabText, tab === 'orders' && s.tabTextActive]}>Live Orders</Text>
          {orders.filter(o => o.status === 'pending').length > 0 && (
            <View style={s.tabBadge}><Text style={s.tabBadgeText}>{orders.filter(o => o.status === 'pending').length}</Text></View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={[s.tabBtn, tab === 'menu' && s.tabActive]} onPress={() => setTab('menu')}>
          <Ionicons name="restaurant" size={16} color={tab === 'menu' ? '#fff' : '#6b6b6b'} />
          <Text style={[s.tabText, tab === 'menu' && s.tabTextActive]}>Menu Manager</Text>
        </TouchableOpacity>
      </View>

      {tab === 'orders' ? (
        <ScrollView contentContainerStyle={s.content}>
          {orders.length === 0 ? (
            <View style={s.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#efefef" />
              <Text style={s.emptyText}>No orders yet</Text>
            </View>
          ) : orders.map(order => (
            <View key={order.id} style={[s.orderCard, order.status === 'completed' && s.orderCompleted]}>
              {/* Order Row Header */}
              <TouchableOpacity style={s.orderRow} onPress={() => setExpanded(expanded === order.id ? null : order.id)}>
                <View style={[s.orderTypeBadge, order.type === 'delivery' ? s.deliveryBadge : s.pickupBadge]}>
                  <Ionicons name={order.type === 'delivery' ? 'bicycle' : 'storefront'} size={12} color="#fff" />
                  <Text style={s.orderTypeTxt}>{order.type === 'delivery' ? 'Delivery' : 'Pick Up'}</Text>
                </View>
                <View style={s.orderInfo}>
                  <Text style={s.orderName}>{order.name}</Text>
                  <Text style={s.orderMeta}>{order.time} · P {order.total}.00</Text>
                </View>
                <Ionicons name={expanded === order.id ? 'chevron-up' : 'chevron-down'} size={18} color="#6b6b6b" />
              </TouchableOpacity>

              {/* Expanded Details */}
              {expanded === order.id && (
                <View style={s.orderDetails}>
                  <View style={s.detailDivider} />
                  {order.items.map((item, idx) => (
                    <View key={idx} style={s.detailRow}>
                      <Text style={s.detailItem}>{item.name} × {item.qty}</Text>
                      <Text style={s.detailPrice}>P {item.price * item.qty}.00</Text>
                    </View>
                  ))}
                  <View style={s.detailDivider} />
                  <View style={s.detailRow}>
                    <Text style={s.detailTotal}>Total</Text>
                    <Text style={s.detailTotalAmt}>P {order.total}.00</Text>
                  </View>
                  {order.type === 'delivery' && (
                    <View style={s.detailInfoRow}>
                      <Ionicons name="location-outline" size={14} color="#6b6b6b" />
                      <Text style={s.detailInfoTxt}>{order.address}</Text>
                    </View>
                  )}
                  <View style={s.detailInfoRow}>
                    <Ionicons name="call-outline" size={14} color="#6b6b6b" />
                    <Text style={s.detailInfoTxt}>{order.phone}</Text>
                  </View>

                  {/* Complete Button */}
                  <TouchableOpacity
                    style={[s.completeBtn, order.status === 'completed' && s.completeBtnDone]}
                    onPress={() => toggleComplete(order.id)}
                  >
                    <Ionicons name={order.status === 'completed' ? 'checkmark-circle' : 'checkmark-circle-outline'} size={18} color={order.status === 'completed' ? '#fff' : '#1a1612'} />
                    <Text style={[s.completeBtnTxt, order.status === 'completed' && s.completeBtnTxtDone]}>
                      {order.status === 'completed' ? 'ORDER COMPLETED ✓' : 'Mark as Complete'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <MenuManager />
      )}
    </View>
  );
}

function MenuManager() {
  const [showAdd, setShowAdd] = useState(false);
  const CATS = ['Starters', 'Mains', 'Sides', 'Drinks', 'Desserts'];
  const [items, setItems] = useState([
    { id: '1', name: 'Grilled Chicken Burger', category: 'Mains', price: 85, wasPrice: null as number | null, onSpecial: false, description: 'Juicy grilled chicken with fresh lettuce and house sauce' },
    { id: '2', name: 'Beef Burger', category: 'Mains', price: 90, wasPrice: null as number | null, onSpecial: false, description: 'Classic beef patty with cheese and pickles' },
  ]);
  const [form, setForm] = useState({ name: '', category: 'Mains', price: '', wasPrice: '', onSpecial: false, description: '' });

  const addItem = () => {
    if (!form.name || !form.price) { Alert.alert('Fill in name and price'); return; }
    setItems(prev => [...prev, { id: Date.now().toString(), name: form.name, category: form.category, price: Number(form.price), wasPrice: form.wasPrice ? Number(form.wasPrice) : null, onSpecial: form.onSpecial, description: form.description }]);
    setForm({ name: '', category: 'Mains', price: '', wasPrice: '', onSpecial: false, description: '' });
    setShowAdd(false);
  };

  return (
    <ScrollView contentContainerStyle={s.content}>
      <TouchableOpacity style={s.addItemBtn} onPress={() => setShowAdd(true)}>
        <Ionicons name="add-circle" size={20} color="#1a1612" />
        <Text style={s.addItemBtnTxt}>Add New Product</Text>
      </TouchableOpacity>

      {items.map(item => (
        <View key={item.id} style={s.menuItem}>
          <View style={s.menuItemInfo}>
            <View style={s.menuItemHeader}>
              <Text style={s.menuItemName}>{item.name}</Text>
              {item.onSpecial && <View style={s.specialTag}><Text style={s.specialTagTxt}>SPECIAL</Text></View>}
            </View>
            <Text style={s.menuItemCat}>{item.category}</Text>
            <View style={s.menuItemPriceRow}>
              <Text style={s.menuItemPrice}>P {item.price}.00</Text>
              {item.wasPrice && <Text style={s.menuItemWasPrice}>was P {item.wasPrice}.00</Text>}
            </View>
          </View>
          <View style={s.menuItemActions}>
            <TouchableOpacity style={s.editBtn}><Ionicons name="pencil" size={16} color="#6b6b6b" /></TouchableOpacity>
            <TouchableOpacity style={s.deleteBtn} onPress={() => setItems(prev => prev.filter(i => i.id !== item.id))}>
              <Ionicons name="trash-outline" size={16} color="#D10000" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Add Item Modal */}
      <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
        <View style={s.modalBackdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setShowAdd(false)} />
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Add New Product</Text>
            <TextInput style={s.mInput} placeholder="Product name" placeholderTextColor="#6b6b6b" value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} />
            <Text style={s.mLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {CATS.map(cat => (
                <TouchableOpacity key={cat} style={[s.mCatBtn, form.category === cat && s.mCatActive]} onPress={() => setForm(f => ({ ...f, category: cat }))}>
                  <Text style={[s.mCatTxt, form.category === cat && s.mCatTxtActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput style={s.mInput} placeholder="Price (P)" placeholderTextColor="#6b6b6b" value={form.price} onChangeText={v => setForm(f => ({ ...f, price: v }))} keyboardType="numeric" />
            <TextInput style={s.mInput} placeholder="Was price (optional, for specials)" placeholderTextColor="#6b6b6b" value={form.wasPrice} onChangeText={v => setForm(f => ({ ...f, wasPrice: v }))} keyboardType="numeric" />
            <TouchableOpacity style={s.mToggle} onPress={() => setForm(f => ({ ...f, onSpecial: !f.onSpecial }))}>
              <View style={[s.mToggleBox, form.onSpecial && s.mToggleBoxActive]}>
                {form.onSpecial && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={s.mToggleTxt}>Mark as On Special</Text>
            </TouchableOpacity>
            <TextInput style={[s.mInput, { height: 80 }]} placeholder="Description" placeholderTextColor="#6b6b6b" value={form.description} onChangeText={v => setForm(f => ({ ...f, description: v }))} multiline />
            <TouchableOpacity style={s.mSaveBtn} onPress={addItem}>
              <Text style={s.mSaveTxt}>Add Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#f5f5f5' },
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, backgroundColor: '#1a1612' },
  headerTitle:        { fontSize: 20, fontWeight: '800', color: '#fff' },
  signOutBtn:         { padding: 8 },
  tabBar:             { flexDirection: 'row', gap: 10, padding: 14, backgroundColor: '#1a1612' },
  tabBtn:             { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)' },
  tabActive:          { backgroundColor: '#FBA4AD' },
  tabText:            { fontSize: 13, fontWeight: '700', color: '#6b6b6b' },
  tabTextActive:      { color: '#fff' },
  tabBadge:           { backgroundColor: '#FFDD32', borderRadius: 8, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  tabBadgeText:       { fontSize: 11, fontWeight: '800', color: '#1a1612' },
  content:            { padding: 16 },
  emptyState:         { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText:          { fontSize: 16, color: '#6b6b6b' },
  orderCard:          { backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#efefef' },
  orderCompleted:     { borderColor: '#22c55e', borderWidth: 1.5 },
  orderRow:           { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  orderTypeBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  deliveryBadge:      { backgroundColor: '#FBA4AD' },
  pickupBadge:        { backgroundColor: '#1a1612' },
  orderTypeTxt:       { fontSize: 11, fontWeight: '700', color: '#fff' },
  orderInfo:          { flex: 1 },
  orderName:          { fontSize: 15, fontWeight: '700', color: '#1a1612' },
  orderMeta:          { fontSize: 12, color: '#6b6b6b', marginTop: 2 },
  orderDetails:       { paddingHorizontal: 14, paddingBottom: 14 },
  detailDivider:      { height: 1, backgroundColor: '#efefef', marginVertical: 10 },
  detailRow:          { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  detailItem:         { fontSize: 13, color: '#6b6b6b' },
  detailPrice:        { fontSize: 13, fontWeight: '600', color: '#1a1612' },
  detailTotal:        { fontSize: 15, fontWeight: '800', color: '#1a1612' },
  detailTotalAmt:     { fontSize: 15, fontWeight: '800', color: '#FBA4AD' },
  detailInfoRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  detailInfoTxt:      { fontSize: 13, color: '#6b6b6b' },
  completeBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, padding: 14, borderRadius: 12, backgroundColor: '#f5f5f5', borderWidth: 1.5, borderColor: '#efefef' },
  completeBtnDone:    { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  completeBtnTxt:     { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  completeBtnTxtDone: { color: '#fff' },
  addItemBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFDD32', borderRadius: 12, padding: 14, marginBottom: 16 },
  addItemBtnTxt:      { fontSize: 15, fontWeight: '700', color: '#1a1612' },
  menuItem:           { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#efefef' },
  menuItemInfo:       { flex: 1 },
  menuItemHeader:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  menuItemName:       { fontSize: 15, fontWeight: '700', color: '#1a1612' },
  specialTag:         { backgroundColor: '#FBA4AD', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  specialTagTxt:      { fontSize: 9, fontWeight: '800', color: '#fff' },
  menuItemCat:        { fontSize: 12, color: '#6b6b6b', marginBottom: 4 },
  menuItemPriceRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuItemPrice:      { fontSize: 15, fontWeight: '800', color: '#FBA4AD' },
  menuItemWasPrice:   { fontSize: 12, color: '#aaa', textDecorationLine: 'line-through' },
  menuItemActions:    { flexDirection: 'row', gap: 8 },
  editBtn:            { padding: 8, backgroundColor: '#f5f5f5', borderRadius: 8 },
  deleteBtn:          { padding: 8, backgroundColor: '#fff0f0', borderRadius: 8 },
  modalBackdrop:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet:         { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 44 },
  modalTitle:         { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 16 },
  mLabel:             { fontSize: 12, fontWeight: '600', color: '#6b6b6b', marginBottom: 8 },
  mInput:             { borderWidth: 1, borderColor: '#efefef', borderRadius: 10, padding: 12, fontSize: 15, color: '#1a1612', backgroundColor: '#f5f5f5', marginBottom: 12 },
  mCatBtn:            { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f5f5f5', marginRight: 8, borderWidth: 1, borderColor: '#efefef' },
  mCatActive:         { backgroundColor: '#FBA4AD', borderColor: '#FBA4AD' },
  mCatTxt:            { fontSize: 13, fontWeight: '600', color: '#6b6b6b' },
  mCatTxtActive:      { color: '#fff' },
  mToggle:            { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  mToggleBox:         { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#efefef', alignItems: 'center', justifyContent: 'center' },
  mToggleBoxActive:   { backgroundColor: '#FBA4AD', borderColor: '#FBA4AD' },
  mToggleTxt:         { fontSize: 14, color: '#1a1612' },
  mSaveBtn:           { backgroundColor: '#FFDD32', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4 },
  mSaveTxt:           { fontSize: 16, fontWeight: '700', color: '#1a1612' },
});
