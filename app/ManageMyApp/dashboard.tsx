import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

const INITIAL_MENU = [
  { id: '1', name: 'Grilled Chicken Burger', category: 'Mains', price: 85, wasPrice: null as number|null, onSpecial: false, description: 'Juicy grilled chicken with fresh lettuce and house sauce', details: 'Served on a toasted brioche bun with house-made aioli, crisp lettuce, tomato, and pickles.' },
  { id: '2', name: 'Beef Burger', category: 'Mains', price: 90, wasPrice: null as number|null, onSpecial: false, description: 'Classic beef patty with cheese and pickles', details: '180g hand-pressed beef patty, double cheese, caramelised onions, gherkins and our signature smoky sauce.' },
  { id: '3', name: 'Chicken Wings', category: 'Starters', price: 65, wasPrice: null as number|null, onSpecial: false, description: '6 crispy wings with your choice of sauce', details: 'Choose from BBQ, Peri-Peri, Honey Garlic or Buffalo. Served with blue cheese dip.' },
  { id: '4', name: 'Loaded Fries', category: 'Sides', price: 45, wasPrice: null as number|null, onSpecial: false, description: 'Crispy fries topped with cheese and jalapeños', details: 'Golden crispy fries loaded with melted cheddar, pickled jalapeños, sour cream and spring onions.' },
  { id: '5', name: 'Caesar Salad', category: 'Starters', price: 55, wasPrice: null as number|null, onSpecial: false, description: 'Fresh romaine, croutons, parmesan and caesar dressing', details: 'Classic Caesar with house-made dressing, shaved parmesan, garlic croutons and a soft-boiled egg.' },
  { id: '6', name: 'Grilled Steak', category: 'Mains', price: 160, wasPrice: null as number|null, onSpecial: false, description: '200g sirloin steak cooked to your liking', details: 'Premium 200g sirloin, cooked to your preference. Served with garlic butter, seasonal vegetables.' },
  { id: '7', name: 'Coca Cola', category: 'Drinks', price: 20, wasPrice: null as number|null, onSpecial: false, description: '330ml can', details: 'Ice cold 330ml Coca-Cola can.' },
  { id: '8', name: 'Chocolate Cake', category: 'Desserts', price: 40, wasPrice: null as number|null, onSpecial: false, description: 'Rich chocolate cake with cream', details: 'Warm Belgian chocolate lava cake with vanilla ice cream and fresh berry coulis.' },
  { id: '9', name: 'Onion Rings', category: 'Sides', price: 35, wasPrice: null as number|null, onSpecial: false, description: 'Golden crispy onion rings', details: 'Thick-cut onion rings in a light beer batter. Served with smoky chipotle dipping sauce.' },
  { id: '10', name: 'Fruit Juice', category: 'Drinks', price: 25, wasPrice: null as number|null, onSpecial: false, description: 'Fresh orange or apple juice', details: 'Freshly squeezed seasonal juice. Ask our staff for today\'s available flavours.' },
];

const INITIAL_SLIDES = [
  { id: '1', label: 'Grilled Chicken' },
  { id: '2', label: 'Beef Burger' },
  { id: '3', label: 'Loaded Fries' },
  { id: '4', label: 'Arabic Food' },
];

const CATS = ['Starters', 'Mains', 'Sides', 'Drinks', 'Desserts'];
type MenuItem = typeof INITIAL_MENU[0];

export default function AdminDashboard() {
  
  const router = useRouter();
  const [tab, setTab] = useState<'orders'|'menu'|'home'>('orders');
  const [menuItems, setMenuItems] = useState(INITIAL_MENU);
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [editSlide, setEditSlide] = useState<{id:string;label:string}|null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem|null>(null);
  const [form, setForm] = useState({ name:'', category:'Mains', price:'', wasPrice:'', onSpecial:false, description:'', details:'' });

  const DEMO_ORDERS = [
    { id:'1', name:'Kefilwe Moyo', type:'delivery', address:'Plot 123, Phakalane', phone:'+267 71 234 567', items:[{name:'Grilled Chicken Burger',qty:2,price:85},{name:'Loaded Fries',qty:1,price:45}], total:215, time:'2:34 PM', status:'pending' },
    { id:'2', name:'Thabo Nkosi', type:'pickup', address:'', phone:'+267 77 890 123', items:[{name:'Beef Burger',qty:1,price:90},{name:'Coca Cola',qty:2,price:20}], total:130, time:'2:41 PM', status:'pending' },
  ];
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [expanded, setExpanded] = useState<string|null>(null);

  const toggleComplete = (id:string) => setOrders(prev => prev.map(o => o.id===id ? {...o, status: o.status==='completed'?'pending':'completed'} : o));

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setForm({ name:item.name, category:item.category, price:String(item.price), wasPrice:item.wasPrice?String(item.wasPrice):'', onSpecial:item.onSpecial, description:item.description, details:item.details });
  };

  const saveEdit = () => {
    if (!editItem) return;
    setMenuItems(prev => prev.map(i => i.id===editItem.id ? {...i, name:form.name, category:form.category, price:Number(form.price), wasPrice:form.wasPrice?Number(form.wasPrice):null, onSpecial:form.onSpecial, description:form.description, details:form.details} : i));
    setEditItem(null);
  };

  const addItem = () => {
    if (!form.name||!form.price) { Alert.alert('Fill in name and price'); return; }
    setMenuItems(prev => [...prev, { id:Date.now().toString(), name:form.name, category:form.category, price:Number(form.price), wasPrice:form.wasPrice?Number(form.wasPrice):null, onSpecial:form.onSpecial, description:form.description, details:form.details }]);
    setForm({ name:'', category:'Mains', price:'', wasPrice:'', onSpecial:false, description:'', details:'' });
    setShowAddItem(false);
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => { router.replace('/auth/sign-in'); }} style={s.signOutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#D10000" />
        </TouchableOpacity>
      </View>

      <View style={s.tabBar}>
        {(['orders','menu','home'] as const).map(t => (
          <TouchableOpacity key={t} style={[s.tabBtn, tab===t && s.tabActive]} onPress={() => setTab(t)}>
            <Ionicons name={t==='orders'?'receipt':t==='menu'?'restaurant':'home'} size={14} color={tab===t?'#fff':'#6b6b6b'} />
            <Text style={[s.tabText, tab===t && s.tabTextActive]}>{t==='orders'?'Orders':t==='menu'?'Menu':'Home Page'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab==='orders' && (
        <ScrollView contentContainerStyle={s.content}>
          {orders.map(order => (
            <View key={order.id} style={[s.orderCard, order.status==='completed' && s.orderCompleted]}>
              <TouchableOpacity style={s.orderRow} onPress={() => setExpanded(expanded===order.id?null:order.id)}>
                <View style={[s.typeBadge, order.type==='delivery'?s.deliveryBadge:s.pickupBadge]}>
                  <Ionicons name={order.type==='delivery'?'car-sport':'storefront'} size={12} color="#fff" />
                  <Text style={s.typeTxt}>{order.type==='delivery'?'Delivery':'Pick Up'}</Text>
                </View>
                <View style={s.orderInfo}>
                  <Text style={s.orderName}>{order.name}</Text>
                  <Text style={s.orderMeta}>{order.time} · P {order.total}.00</Text>
                </View>
                <Ionicons name={expanded===order.id?'chevron-up':'chevron-down'} size={18} color="#6b6b6b" />
              </TouchableOpacity>
              {expanded===order.id && (
                <View style={s.orderDetails}>
                  <View style={s.divider} />
                  {order.items.map((item,idx) => (
                    <View key={idx} style={s.detailRow}>
                      <Text style={s.detailItem}>{item.name} × {item.qty}</Text>
                      <Text style={s.detailPrice}>P {item.price*item.qty}.00</Text>
                    </View>
                  ))}
                  <View style={s.divider} />
                  <View style={s.detailRow}>
                    <Text style={s.detailTotal}>Total</Text>
                    <Text style={s.detailTotalAmt}>P {order.total}.00</Text>
                  </View>
                  {order.type==='delivery' && <View style={s.infoRow}><Ionicons name="location-outline" size={14} color="#6b6b6b"/><Text style={s.infoTxt}>{order.address}</Text></View>}
                  <View style={s.infoRow}><Ionicons name="call-outline" size={14} color="#6b6b6b"/><Text style={s.infoTxt}>{order.phone}</Text></View>
                  <TouchableOpacity style={[s.completeBtn, order.status==='completed'&&s.completeBtnDone]} onPress={()=>toggleComplete(order.id)}>
                    <Ionicons name={order.status==='completed'?'checkmark-circle':'checkmark-circle-outline'} size={18} color={order.status==='completed'?'#fff':'#1a1612'} />
                    <Text style={[s.completeTxt, order.status==='completed'&&s.completeTxtDone]}>{order.status==='completed'?'ORDER COMPLETED ✓':'Mark as Complete'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {tab==='menu' && (
        <ScrollView contentContainerStyle={s.content}>
          <TouchableOpacity style={s.addBtn} onPress={() => { setForm({name:'',category:'Mains',price:'',wasPrice:'',onSpecial:false,description:'',details:''}); setShowAddItem(true); }}>
            <Ionicons name="add-circle" size={20} color="#1a1612" />
            <Text style={s.addBtnTxt}>Add New Product</Text>
          </TouchableOpacity>
          {menuItems.map(item => (
            <View key={item.id} style={s.menuItem}>
              <View style={s.menuItemInfo}>
                <View style={s.menuItemHeader}>
                  <Text style={s.menuItemName}>{item.name}</Text>
                  {item.onSpecial && <View style={s.specialTag}><Text style={s.specialTxt}>SPECIAL</Text></View>}
                </View>
                <Text style={s.menuItemCat}>{item.category}</Text>
                <View style={s.priceRow}>
                  <Text style={s.menuItemPrice}>P {item.price}.00</Text>
                  {item.wasPrice && <Text style={s.wasPrice}>was P {item.wasPrice}.00</Text>}
                </View>
                <Text style={s.menuItemDesc} numberOfLines={1}>{item.description}</Text>
              </View>
              <View style={s.menuActions}>
                <TouchableOpacity style={s.editBtn} onPress={() => openEdit(item)}><Ionicons name="pencil" size={16} color="#6b6b6b"/></TouchableOpacity>
                <TouchableOpacity style={s.delBtn} onPress={() => setMenuItems(prev=>prev.filter(i=>i.id!==item.id))}><Ionicons name="trash-outline" size={16} color="#D10000"/></TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {tab==='home' && (
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.sectionHead}>Food Slideshow Labels</Text>
          <Text style={s.sectionSub}>Edit the label text shown on each slideshow image below the Quick Actions section.</Text>
          {slides.map(slide => (
            <View key={slide.id} style={s.slideRow}>
              <View style={s.slideIcon}><Ionicons name="image-outline" size={22} color="#CE6F79"/></View>
              <Text style={s.slideLabel}>{slide.label}</Text>
              <TouchableOpacity style={s.editBtn} onPress={() => setEditSlide({id:slide.id, label:slide.label})}>
                <Ionicons name="pencil" size={16} color="#6b6b6b"/>
              </TouchableOpacity>
            </View>
          ))}
          <View style={s.noticeBox}>
            <Ionicons name="information-circle-outline" size={18} color="#CE6F79"/>
            <Text style={s.noticeTxt}>To add actual images to the slideshows, upload image files to the assets/ folder in your code and update the references. This will require a new build. Contact your developer when you have the images ready.</Text>
          </View>
        </ScrollView>
      )}

      {/* Edit Slide Label Modal */}
      <Modal visible={!!editSlide} transparent animationType="slide" onRequestClose={() => setEditSlide(null)}>
        <View style={s.modalBackdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setEditSlide(null)} />
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Edit Slide Label</Text>
            <TextInput style={s.mInput} value={editSlide?.label||''} onChangeText={v => setEditSlide(p => p?{...p,label:v}:p)} placeholder="Label text" placeholderTextColor="#9b7b7e" />
            <TouchableOpacity style={s.mSaveBtn} onPress={() => {
              if (editSlide) setSlides(prev => prev.map(sl => sl.id===editSlide.id?{...sl,label:editSlide.label}:sl));
              setEditSlide(null);
            }}>
              <Text style={s.mSaveTxt}>Save Label</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Item Modal */}
      <Modal visible={showAddItem||!!editItem} transparent animationType="slide" onRequestClose={() => { setShowAddItem(false); setEditItem(null); }}>
        <View style={s.modalBackdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => { setShowAddItem(false); setEditItem(null); }} />
          <ScrollView style={s.modalSheet} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={s.modalTitle}>{editItem?'Edit Product':'Add New Product'}</Text>
            <TextInput style={s.mInput} placeholder="Product name" placeholderTextColor="#9b7b7e" value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} />
            <Text style={s.mLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>
              {CATS.map(cat => (
                <TouchableOpacity key={cat} style={[s.mCatBtn, form.category===cat&&s.mCatActive]} onPress={() => setForm(f=>({...f,category:cat}))}>
                  <Text style={[s.mCatTxt, form.category===cat&&s.mCatTxtActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput style={s.mInput} placeholder="Price (P)" placeholderTextColor="#9b7b7e" value={form.price} onChangeText={v=>setForm(f=>({...f,price:v}))} keyboardType="numeric" />
            <TextInput style={s.mInput} placeholder="Was price (optional, for specials)" placeholderTextColor="#9b7b7e" value={form.wasPrice} onChangeText={v=>setForm(f=>({...f,wasPrice:v}))} keyboardType="numeric" />
            <TouchableOpacity style={s.mToggle} onPress={()=>setForm(f=>({...f,onSpecial:!f.onSpecial}))}>
              <View style={[s.mToggleBox, form.onSpecial&&s.mToggleBoxActive]}>{form.onSpecial&&<Ionicons name="checkmark" size={14} color="#fff"/>}</View>
              <Text style={s.mToggleTxt}>Mark as On Special</Text>
            </TouchableOpacity>
            <TextInput style={s.mInput} placeholder="Short description" placeholderTextColor="#9b7b7e" value={form.description} onChangeText={v=>setForm(f=>({...f,description:v}))} />
            <TextInput style={[s.mInput,{height:80}]} placeholder="Full details (shown in popup)" placeholderTextColor="#9b7b7e" value={form.details} onChangeText={v=>setForm(f=>({...f,details:v}))} multiline />
            <TouchableOpacity style={s.mSaveBtn} onPress={editItem?saveEdit:addItem}>
              <Text style={s.mSaveTxt}>{editItem?'Save Changes':'Add Product'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:       { flex:1, backgroundColor:'#f5f5f5' },
  header:          { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingTop:52, paddingBottom:16, backgroundColor:'#1a1612' },
  headerTitle:     { fontSize:20, fontWeight:'800', color:'#fff' },
  signOutBtn:      { padding:8 },
  tabBar:          { flexDirection:'row', gap:8, padding:12, backgroundColor:'#1a1612' },
  tabBtn:          { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:5, paddingVertical:10, borderRadius:10, backgroundColor:'rgba(255,255,255,0.1)' },
  tabActive:       { backgroundColor:'#CE6F79' },
  tabText:         { fontSize:12, fontWeight:'700', color:'#6b6b6b' },
  tabTextActive:   { color:'#fff' },
  content:         { padding:16 },
  orderCard:       { backgroundColor:'#fff', borderRadius:14, marginBottom:12, overflow:'hidden', borderWidth:1, borderColor:'#efefef' },
  orderCompleted:  { borderColor:'#22c55e', borderWidth:1.5 },
  orderRow:        { flexDirection:'row', alignItems:'center', padding:14, gap:10 },
  typeBadge:       { flexDirection:'row', alignItems:'center', gap:4, paddingHorizontal:8, paddingVertical:4, borderRadius:8 },
  deliveryBadge:   { backgroundColor:'#CE6F79' },
  pickupBadge:     { backgroundColor:'#1a1612' },
  typeTxt:         { fontSize:11, fontWeight:'700', color:'#fff' },
  orderInfo:       { flex:1 },
  orderName:       { fontSize:15, fontWeight:'700', color:'#1a1612' },
  orderMeta:       { fontSize:12, color:'#6b6b6b', marginTop:2 },
  orderDetails:    { paddingHorizontal:14, paddingBottom:14 },
  divider:         { height:1, backgroundColor:'#efefef', marginVertical:10 },
  detailRow:       { flexDirection:'row', justifyContent:'space-between', marginBottom:6 },
  detailItem:      { fontSize:13, color:'#6b6b6b' },
  detailPrice:     { fontSize:13, fontWeight:'600', color:'#1a1612' },
  detailTotal:     { fontSize:15, fontWeight:'800', color:'#1a1612' },
  detailTotalAmt:  { fontSize:15, fontWeight:'800', color:'#CE6F79' },
  infoRow:         { flexDirection:'row', alignItems:'center', gap:6, marginTop:8 },
  infoTxt:         { fontSize:13, color:'#6b6b6b' },
  completeBtn:     { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, marginTop:14, padding:14, borderRadius:12, backgroundColor:'#f5f5f5', borderWidth:1.5, borderColor:'#efefef' },
  completeBtnDone: { backgroundColor:'#22c55e', borderColor:'#22c55e' },
  completeTxt:     { fontSize:14, fontWeight:'700', color:'#1a1612' },
  completeTxtDone: { color:'#fff' },
  addBtn:          { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:'#FFDD32', borderRadius:12, padding:14, marginBottom:16 },
  addBtnTxt:       { fontSize:15, fontWeight:'700', color:'#1a1612' },
  menuItem:        { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:12, padding:14, marginBottom:10, borderWidth:1, borderColor:'#efefef' },
  menuItemInfo:    { flex:1 },
  menuItemHeader:  { flexDirection:'row', alignItems:'center', gap:8, marginBottom:2 },
  menuItemName:    { fontSize:15, fontWeight:'700', color:'#1a1612', flex:1 },
  specialTag:      { backgroundColor:'#CE6F79', paddingHorizontal:6, paddingVertical:2, borderRadius:4 },
  specialTxt:      { fontSize:9, fontWeight:'800', color:'#fff' },
  menuItemCat:     { fontSize:12, color:'#6b6b6b', marginBottom:2 },
  priceRow:        { flexDirection:'row', alignItems:'center', gap:8, marginBottom:2 },
  menuItemPrice:   { fontSize:14, fontWeight:'800', color:'#CE6F79' },
  wasPrice:        { fontSize:12, color:'#aaa', textDecorationLine:'line-through' },
  menuItemDesc:    { fontSize:12, color:'#9b9b9b' },
  menuActions:     { flexDirection:'row', gap:8 },
  editBtn:         { padding:8, backgroundColor:'#f5f5f5', borderRadius:8 },
  delBtn:          { padding:8, backgroundColor:'#fff0f0', borderRadius:8 },
  sectionHead:     { fontSize:17, fontWeight:'800', color:'#1a1612', marginBottom:6 },
  sectionSub:      { fontSize:13, color:'#6b6b6b', marginBottom:16, lineHeight:19 },
  slideRow:        { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:12, padding:14, marginBottom:10, borderWidth:1, borderColor:'#efefef', gap:12 },
  slideIcon:       { width:44, height:44, backgroundColor:'#FADAD9', borderRadius:10, alignItems:'center', justifyContent:'center' },
  slideLabel:      { flex:1, fontSize:15, fontWeight:'600', color:'#1a1612' },
  noticeBox:       { flexDirection:'row', gap:10, backgroundColor:'#FADAD9', borderRadius:12, padding:14, marginTop:8 },
  noticeTxt:       { flex:1, fontSize:12, color:'#6b6b6b', lineHeight:18 },
  modalBackdrop:   { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
  modalSheet:      { backgroundColor:'#fff', borderTopLeftRadius:24, borderTopRightRadius:24, padding:24, maxHeight:'85%' },
  modalTitle:      { fontSize:20, fontWeight:'800', color:'#1a1612', marginBottom:16 },
  mLabel:          { fontSize:12, fontWeight:'600', color:'#6b6b6b', marginBottom:8 },
  mInput:          { borderWidth:1, borderColor:'#F3C3C5', borderRadius:10, padding:12, fontSize:15, color:'#1a1612', backgroundColor:'#FADAD9', marginBottom:12 },
  mCatBtn:         { paddingHorizontal:16, paddingVertical:8, borderRadius:8, backgroundColor:'#f5f5f5', marginRight:8, borderWidth:1, borderColor:'#efefef' },
  mCatActive:      { backgroundColor:'#CE6F79', borderColor:'#CE6F79' },
  mCatTxt:         { fontSize:13, fontWeight:'600', color:'#6b6b6b' },
  mCatTxtActive:   { color:'#fff' },
  mToggle:         { flexDirection:'row', alignItems:'center', gap:10, marginBottom:12 },
  mToggleBox:      { width:22, height:22, borderRadius:6, borderWidth:2, borderColor:'#F3C3C5', alignItems:'center', justifyContent:'center' },
  mToggleBoxActive:{ backgroundColor:'#CE6F79', borderColor:'#CE6F79' },
  mToggleTxt:      { fontSize:14, color:'#1a1612' },
  mSaveBtn:        { backgroundColor:'#FFDD32', borderRadius:12, padding:16, alignItems:'center', marginTop:4 },
  mSaveTxt:        { fontSize:16, fontWeight:'700', color:'#1a1612' },
});
