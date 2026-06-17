import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { getBotswanaTime, BotswanaTime } from '../../lib/getBotswanaTime';

const { width: SW } = Dimensions.get('window');
const RED    = '#b60015';
const YELLOW = '#FFD544';

const SPECIALS = [
  {
    id: 'ws1', day: 'Monday',
    name: 'Beef Bourguignon — Rich Beef Stew',
    description: 'Cooked beef chunks in red wine sauce...',
    details: 'Cooked beef chunks in red wine sauce with carrots, onions, bacon/pancetta, and parsley.',
    price: 150,
    images: [
      require('../../assets/images/products/Beef Bourguignon1.jpeg'),
      require('../../assets/images/products/Beef Bourguignon2.jpeg'),
      require('../../assets/images/products/Beef Bourguignon3.jpeg'),
    ],
  },
  {
    id: 'ws2', day: 'Tuesday',
    name: 'Coq au Vin — Braised Chicken',
    description: 'Chicken pieces in a glossy red wine...',
    details: 'Chicken pieces in a glossy red wine with pearl onions, carrots, and herbs.',
    price: 150,
    images: [
      require('../../assets/images/products/Coq au Vin1.jpeg'),
      require('../../assets/images/products/Coq au Vin2.jpeg'),
    ],
  },
  {
    id: 'ws3', day: 'Wednesday',
    name: 'Lamb Cutlets',
    description: 'Tender lamb cutlets, herb-marinated and grilled...',
    details: 'Tender lamb cutlets marinated in fresh herbs, garlic, and olive oil, grilled to perfection and served with seasonal sides.',
    price: 150,
    images: [
      require('../../assets/images/products/Lamb Chops1.jpeg'),
      require('../../assets/images/products/Lamb Chops2.jpeg'),
    ],
  },
  {
    id: 'ws4', day: 'Thursday',
    name: 'Garlic Butter Shrimp',
    description: 'Sautéed prawns in garlic, parsley, and...',
    details: 'Sautéed prawns in garlic, parsley, and olive oil/butter sauce.',
    price: 150,
    images: [
      require('../../assets/images/products/Garlic Butter Shrimp1.jpeg'),
      require('../../assets/images/products/Garlic Butter Shrimp2.jpeg'),
      require('../../assets/images/products/Garlic Butter Shrimp3.jpeg'),
    ],
  },
  {
    id: 'ws5', day: 'Friday',
    name: 'Fish of the Day',
    description: 'Pescado del día, prepared simply with olive oil...',
    details: 'Pescado del día — prepared simply with olive oil, herbs, and seasonal sides.',
    price: 150,
    images: [require('../../assets/images/products/Fish of the day1.jpeg')],
  },
  {
    id: 'ws6', day: 'Saturday',
    name: 'Zarzuela de Poisson',
    description: 'Rich Catalan seafood stew made with shrimp...',
    details: 'Spanish rich Catalan seafood stew made with shrimp, mussels, clams, fish, onions, tomatoes, garlic, and olive oil.',
    price: 175,
    images: [require('../../assets/images/products/Zarzuela1.jpeg')],
  },
];

function DishModal({ dish, onClose }: { dish: typeof SPECIALS[0] | null; onClose: () => void }) {
  const { addToCart, removeFromCart, items } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  if (!dish) return null;
  const qty = items.find(i => i.id === dish.id)?.quantity ?? 0;
  const inCart = qty > 0;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={modal.sheet}>
          <View style={modal.imageBox}>
            <Image source={dish.images[imgIdx]} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            {dish.images.length > 1 && (
              <>
                <TouchableOpacity style={[modal.navBtn, { left: 10 }]} onPress={() => setImgIdx(i => Math.max(0, i - 1))}>
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[modal.navBtn, { right: 10 }]} onPress={() => setImgIdx(i => Math.min(dish.images.length - 1, i + 1))}>
                  <Ionicons name="chevron-forward" size={22} color="#fff" />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={modal.backBtn} onPress={onClose}>
              <Ionicons name="arrow-back" size={18} color="#1a1612" />
              <Text style={modal.backBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={modal.body}>
            <Text style={modal.name}>{dish.name}</Text>
            <Text style={modal.desc}>{dish.details}</Text>
            <View style={modal.priceRow}>
              <Text style={modal.price}>P {dish.price}.00</Text>
            </View>
            {!inCart ? (
              <TouchableOpacity
                style={modal.addBtn}
                onPress={() => addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] })}
              >
                <Ionicons name="cart" size={20} color="#1a1612" />
                <Text style={modal.addBtnTxt}>Add to Cart</Text>
              </TouchableOpacity>
            ) : (
              <View style={modal.cartControls}>
                <TouchableOpacity style={modal.removeBtn} onPress={() => { for (let i = 0; i < qty; i++) removeFromCart(dish.id); }}>
                  <Text style={modal.removeBtnTxt}>Remove</Text>
                </TouchableOpacity>
                <View style={modal.qtyRow}>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFromCart(dish.id)}>
                    <Ionicons name="remove" size={18} color="#1a1612" />
                  </TouchableOpacity>
                  <Text style={modal.qtyText}>{qty}</Text>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] })}>
                    <Ionicons name="add" size={18} color="#1a1612" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function WeeklySpecials() {
  const router = useRouter();
  const [activeDish, setActiveDish] = useState<typeof SPECIALS[0] | null>(null);
  const [bwTime, setBwTime]         = useState<BotswanaTime | null>(null);
  const [loading, setLoading]       = useState(true);

  // Fetch real Botswana time — retries up to 3 times so phone clock spoofing doesn't work
  const fetchTime = useCallback(async () => {
    setLoading(true);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const t = await getBotswanaTime();
        setBwTime(t);
        setLoading(false);
        return;
      } catch {
        await new Promise(r => setTimeout(r, 500));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTime(); }, [fetchTime]);

  const isSunday    = bwTime?.isSunday ?? false;
  const today       = bwTime?.dayName  ?? '';
  const todayDishes = isSunday ? SPECIALS : SPECIALS.filter(s => s.day === today);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push('/tabs/menu')}>
          <Ionicons name="arrow-back" size={24} color="#1a1612" />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Weekly Specials</Text>
          <Text style={s.subtitle}>Casa Del Sol</Text>
        </View>
        <View style={{ width: 70 }} />
      </View>

      <View style={s.dayBanner}>
        <Ionicons name="calendar" size={16} color="#1a1612" />
        <Text style={s.dayLabel}>
          {loading ? 'Loading...' : isSunday ? 'Sunday — All Specials!' : `Today: ${today}`}
        </Text>
        <TouchableOpacity onPress={fetchTime} style={s.refreshBtn}>
          <Ionicons name="refresh" size={16} color={RED} />
        </TouchableOpacity>
      </View>

      {!loading && todayDishes.length === 0 ? (
        <View style={s.emptyWrap}>
          <Ionicons name="moon-outline" size={48} color={RED} />
          <Text style={s.emptyText}>No specials today. Check back tomorrow!</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.list}>
          {todayDishes.map(dish => (
            <TouchableOpacity key={dish.id} style={s.card} onPress={() => setActiveDish(dish)} activeOpacity={0.88}>
              <View style={s.cardImgWrap}>
                <Image source={dish.images[0]} style={s.cardImg} resizeMode="cover" />
              </View>
              <View style={s.cardBody}>
                <Text style={s.cardDay}>{dish.day}</Text>
                <Text style={s.cardName}>{dish.name}</Text>
                <Text style={s.cardDesc} numberOfLines={2}>{dish.description}</Text>
                <Text style={s.cardPrice}>P {dish.price}.00</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 60 }} />
        </ScrollView>
      )}

      <DishModal dish={activeDish} onClose={() => setActiveDish(null)} />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: YELLOW },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  backBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6, width: 70 },
  backText:     { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title:        { fontSize: 18, fontWeight: '800', color: '#1a1612', textAlign: 'center' },
  subtitle:     { fontSize: 11, color: RED, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' },
  dayBanner:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12, marginBottom: 4, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: YELLOW },
  dayLabel:     { flex: 1, fontSize: 14, fontWeight: '700', color: '#1a1612' },
  refreshBtn:   { padding: 4 },
  emptyWrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  emptyText:    { fontSize: 15, fontWeight: '600', color: '#1a1612', textAlign: 'center' },
  list:         { paddingHorizontal: 16, paddingTop: 12 },
  card:         { backgroundColor: '#fff', borderRadius: 18, marginBottom: 20, overflow: 'hidden', elevation: 2 },
  cardImgWrap:  { width: '100%', height: Math.round((SW - 40) * 0.6) },
  cardImg:      { width: '100%', height: '100%' },
  cardBody:     { padding: 16 },
  cardDay:      { fontSize: 11, fontWeight: '700', color: RED, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 },
  cardName:     { fontSize: 17, fontWeight: '800', color: '#1a1612', marginBottom: 4 },
  cardDesc:     { fontSize: 13, color: '#6b6b6b', lineHeight: 19, marginBottom: 8 },
  cardPrice:    { fontSize: 16, fontWeight: '800', color: RED },
});

const modal = StyleSheet.create({
  backdrop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  imageBox:     { width: SW, height: SW * 0.75, backgroundColor: '#eee', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  navBtn:       { position: 'absolute', top: '50%', marginTop: -22, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backBtn:      { position: 'absolute', top: 14, left: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, elevation: 6, zIndex: 10 },
  backBtnText:  { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  body:         { padding: 20, paddingBottom: 40 },
  name:         { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 8 },
  desc:         { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 16 },
  priceRow:     { marginBottom: 16 },
  price:        { fontSize: 22, fontWeight: '800', color: RED },
  addBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: YELLOW, borderRadius: 14, paddingVertical: 16, marginBottom: 24 },
  addBtnTxt:    { fontSize: 16, fontWeight: '800', color: '#1a1612' },
  cartControls: { gap: 10 },
  removeBtn:    { alignItems: 'center', justifyContent: 'center', backgroundColor: RED, borderRadius: 14, paddingVertical: 14 },
  removeBtnTxt: { fontSize: 15, fontWeight: '800', color: '#fff' },
  qtyRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, backgroundColor: YELLOW, borderRadius: 14, paddingVertical: 12 },
  qtyBtn:       { padding: 4 },
  qtyText:      { fontSize: 18, fontWeight: '800', color: '#1a1612', minWidth: 24, textAlign: 'center' },
});
