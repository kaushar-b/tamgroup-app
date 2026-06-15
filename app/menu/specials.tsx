import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

const { width: SW } = Dimensions.get('window');
const RED = '#b60015';
const YELLOW = '#FFD544';

// ─────────────────────────────────────────────
// WEEKLY SPECIALS — edit name/description/price/images/day here
// Sunday automatically shows ALL dishes
// ─────────────────────────────────────────────
const SPECIALS = [
  {
    id: 'ws1', day: 'Monday',
    name: 'Beef Bourguignon — Rich Beef Stew',
    description: 'Cooked beef chunks in red wine sauce...',
    details: 'Cooked beef chunks in red wine sauce with carrots, onions, bacon/pancetta, and parsley.',
    price: 150,
    images: [require('../../assets/images/products/Beef Bourguignon1.jpeg'), require('../../assets/images/products/Beef Bourguignon2.jpeg'), require('../../assets/images/products/Beef Bourguignon3.jpeg')],
  },
  {
    id: 'ws2', day: 'Tuesday',
    name: 'Coq au Vin — Braised Chicken',
    description: 'Chicken pieces in a glossy red wine...',
    details: 'Chicken pieces in a glossy red wine with pearl onions, carrots, and herbs.',
    price: 150,
    images: [require('../../assets/images/products/Coq au Vin1.jpeg'), require('../../assets/images/products/Coq au Vin2.jpeg')],
  },
  {
    id: 'ws3', day: 'Wednesday',
    name: 'Lamb Cutlets',
    description: 'Tender lamb cutlets, herb-marinated and grilled...',
    details: 'Tender lamb cutlets marinated in fresh herbs, garlic, and olive oil, grilled to perfection and served with seasonal sides.',
    price: 150,
    images: [require('../../assets/images/products/Lamb Chops1.jpeg'), require('../../assets/images/products/Lamb Chops2.jpeg')],
  },
  {
    id: 'ws4', day: 'Thursday',
    name: 'Garlic Butter Shrimp',
    description: 'Sautéed prawns in garlic, parsley, and...',
    details: 'Sautéed prawns in garlic, parsley, and olive oil/butter sauce.',
    price: 150,
    images: [require('../../assets/images/products/Garlic Butter Shrimp1.jpeg'), require('../../assets/images/products/Garlic Butter Shrimp2.jpeg'), require('../../assets/images/products/Garlic Butter Shrimp3.jpeg')],
  },
  {
    id: 'ws5', day: 'Friday',
    name: 'Fish of the Day',
    description: 'Pescado del día, prepared simply with olive oil...',
    details: 'Pescado del día — prepared simply with olive oil, herbs, and seasonal sides.',
    price: 150,
    images: [require('../../assets/images/products/dish5.jpeg')],
  },
  {
    id: 'ws6', day: 'Saturday',
    name: 'Zarzuela de Poisson',
    description: 'Rich Catalan seafood stew made with shrimp...',
    details: 'Spanish rich Catalan seafood stew made with shrimp, mussels, clams, fish, onions, tomatoes, garlic, and olive oil.',
    price: 175,
    images: [require('../../assets/images/products/Seafood Stew1.jpeg'), require('../../assets/images/products/Seafood Stew2.jpeg'), require('../../assets/images/products/Seafood Stew3.jpeg')],
  },
];

function DishModal({ dish, onClose }: { dish: typeof SPECIALS[0] | null; onClose: () => void }) {
  const { addToCart, removeFromCart, items } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  if (!dish) return null;
  const qty = items.find(i => i.id === dish.id)?.quantity ?? 0;
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <TouchableOpacity style={modal.backBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={18} color="#1a1612" /><Text style={modal.backBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={modal.sheet}>
          <View style={modal.imageBox}>
            <Image source={dish.images[imgIdx]} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            {dish.images.length > 1 && (<>
              <TouchableOpacity style={[modal.navBtn, { left: 10 }]} onPress={() => setImgIdx(i => Math.max(0, i - 1))}><Ionicons name="chevron-back" size={22} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={[modal.navBtn, { right: 10 }]} onPress={() => setImgIdx(i => Math.min(dish.images.length - 1, i + 1))}><Ionicons name="chevron-forward" size={22} color="#fff" /></TouchableOpacity>
            </>)}
          </View>
          <ScrollView contentContainerStyle={modal.body}>
            <Text style={modal.name}>{dish.name}</Text>
            <Text style={modal.desc}>{dish.details}</Text>
            <View style={modal.footer}>
              <Text style={modal.price}>P {dish.price}.00</Text>
              {qty === 0 ? (
                <TouchableOpacity style={modal.cartCircle} onPress={() => addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] })}><Ionicons name="cart" size={20} color="#1a1612" /></TouchableOpacity>
              ) : (
                <View style={modal.qtyRow}>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFromCart(dish.id)}><Ionicons name="remove" size={18} color="#1a1612" /></TouchableOpacity>
                  <Text style={modal.qtyText}>{qty}</Text>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] })}><Ionicons name="add" size={18} color="#1a1612" /></TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function Specials() {
  const router = useRouter();
  const { addToCart, removeFromCart, items } = useCart();
  const [activeDish, setActiveDish] = useState<typeof SPECIALS[0] | null>(null);

  const dayOfWeek = new Date().getDay(); // 0=Sun
  const isSunday = dayOfWeek === 0;
  const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = DAY_NAMES[dayOfWeek];
  const todayDishes = isSunday ? SPECIALS : SPECIALS.filter(s => s.day === today);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push('/tabs/menu')}>
          <Ionicons name="arrow-back" size={20} color="#1a1612" /><Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Weekly Specials</Text>
          <Text style={s.subtitle}>Casa Del Sol</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.dayLabel}>{isSunday ? 'Sunday — All Specials!' : `Today: ${today}`}</Text>

        {todayDishes.map(dish => {
          const qty = items.find(i => i.id === dish.id)?.quantity ?? 0;
          return (
            <TouchableOpacity key={dish.id} style={s.card} onPress={() => setActiveDish(dish)} activeOpacity={0.88}>
              <View style={s.cardImgWrap}><Image source={dish.images[0]} style={s.cardImg} resizeMode="cover" /></View>
              <View style={s.cardBody}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardName}>{dish.name}</Text>
                    <Text style={s.cardDesc} numberOfLines={2}>{dish.description}</Text>
                  </View>
                  {qty === 0 ? (
                    <TouchableOpacity style={s.cartCircle} onPress={() => addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] })}><Ionicons name="cart" size={18} color="#1a1612" /></TouchableOpacity>
                  ) : (
                    <View style={s.qtyRow}>
                      <TouchableOpacity style={s.qtyBtn} onPress={() => removeFromCart(dish.id)}><Ionicons name="remove" size={16} color="#1a1612" /></TouchableOpacity>
                      <Text style={s.qtyText}>{qty}</Text>
                      <TouchableOpacity style={s.qtyBtn} onPress={() => addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] })}><Ionicons name="add" size={16} color="#1a1612" /></TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={s.cardPrice}>P {dish.price}.00</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={s.tableWrap}>
          <Text style={s.tableTitle}>See What's Cooking!</Text>
          {SPECIALS.map(sp => (
            <View key={sp.id} style={s.tableRow}>
              <Text style={s.tableDay}>{sp.day}</Text>
              <Text style={s.tableDish}>{sp.name}</Text>
            </View>
          ))}
          <View style={s.tableRow}>
            <Text style={s.tableDay}>Sunday</Text>
            <Text style={s.tableDish}>All 6 Specials</Text>
          </View>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
      <DishModal dish={activeDish} onClose={() => setActiveDish(null)} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: YELLOW }, header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' }, backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 60 }, backText: { fontSize: 15, fontWeight: '700', color: '#1a1612' }, headerCenter: { flex: 1, alignItems: 'center' }, title: { fontSize: 18, fontWeight: '800', color: '#1a1612', textAlign: 'center' }, subtitle: { fontSize: 11, color: RED, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' }, content: { padding: 16 }, dayLabel: { fontSize: 20, fontWeight: '800', color: RED, marginBottom: 16, textAlign: 'center' }, card: { backgroundColor: '#fff', borderRadius: 18, marginBottom: 20, overflow: 'hidden', elevation: 2 }, cardImgWrap: { width: '100%', height: Math.round((SW - 40) * 0.6) }, cardImg: { width: '100%', height: '100%' }, cardBody: { padding: 16 }, cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 }, cardName: { fontSize: 17, fontWeight: '800', color: '#1a1612', marginBottom: 4 }, cardDesc: { fontSize: 13, color: '#6b6b6b', lineHeight: 19 }, cardPrice: { fontSize: 16, fontWeight: '800', color: RED }, cartCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: YELLOW, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, flexShrink: 0 }, qtyBtn: { padding: 2 }, qtyText: { fontSize: 14, fontWeight: '800', color: '#1a1612', minWidth: 18, textAlign: 'center' }, tableWrap: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 8 }, tableTitle: { fontSize: 16, fontWeight: '800', color: RED, marginBottom: 12, textAlign: 'center' }, tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: YELLOW }, tableDay: { fontSize: 14, fontWeight: '700', color: '#1a1612' }, tableDish: { fontSize: 14, color: '#6b6b6b', flex: 1, textAlign: 'right' },
});
const modal = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }, sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' }, imageBox: { width: SW, height: SW, backgroundColor: '#eee', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }, navBtn: { position: 'absolute', top: '50%', marginTop: -22, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, backBtn: { position: 'absolute', top: 50, left: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 10, elevation: 5, zIndex: 10 }, backBtnText: { fontSize: 14, fontWeight: '700', color: '#1a1612' }, body: { padding: 20, paddingBottom: 60 }, name: { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 8 }, desc: { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 20 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, price: { fontSize: 22, fontWeight: '800', color: RED }, cartCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center' }, qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: YELLOW, borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8 }, qtyBtn: { padding: 4 }, qtyText: { fontSize: 16, fontWeight: '800', color: '#1a1612', minWidth: 20, textAlign: 'center' },
});
