import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';

const { width: SW } = Dimensions.get('window');
const RED = '#b60015';
const YELLOW = '#FFD544';
const GREEN  = '#22c55e';

// ─────────────────────────────────────────────
// PAELLA DISHES — edit name/description/price/images here
// ─────────────────────────────────────────────
const DISHES = [
  {
    id: 'p1',
    name: 'Seafood Paella',
    description: 'Spanish rice dish with shrimp/prawns, mussels...',
    details: 'Spanish rice dish with shrimp/prawns, mussels, lemon slices, and saffron.',
    price: 225,
    images: [
      require('../../assets/images/products/Seafood paella1.jpeg'),
      require('../../assets/images/products/Seafood Paella1.jpeg'),
      require('../../assets/images/products/Seafood Paella2.jpeg'),
    ],
  },
  {
    id: 'p2',
    name: 'Spanish Chorizo Paella',
    description: 'Paella de chorizo, Spanish rice dish cooked with...',
    details: 'Paella de chorizo — Spanish rice dish cooked with chicken, tender beef, saffron, peppers, onions, and olive oil.',
    price: 175,
    images: [
      require('../../assets/images/products/chorizo paella1.jpeg'),
    ],
  },
  {
    id: 'p3',
    name: 'Spanish Vegetarian Paella',
    description: 'Paella vegetariana, colorful rice dish cooked with...',
    details: 'Paella vegetariana — colorful rice dish cooked with saffron, peppers, onions, tomatoes, green beans, and olive oil.',
    price: 95,
    images: [
      require('../../assets/images/products/vegetarian paella1.jpeg'),
      require('../../assets/images/products/vegetarian paella2.jpeg'),
    ],
  },
];

function DishModal({ dish, onClose, cs, setCs, addToCart: addFn, removeFromCart: removeFn, items: cartItems }: { dish: typeof DISHES[0] | null; onClose: () => void; cs: string; setCs: (s: 'idle'|'confirming'|'added') => void; addToCart: (id:string,item?:any)=>void; removeFromCart:(id:string)=>void; items: any[] }) {
  const [imgIdx, setImgIdx] = useState(0);
  if (!dish) return null;
  const qty = cartItems.find((i:any) => i.id === dish.id)?.quantity ?? 0;
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
                <TouchableOpacity style={modal.cartCircle} onPress={() => addFn(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] })}><Ionicons name="cart" size={20} color="#1a1612" /></TouchableOpacity>
              ) : (
                <View style={modal.qtyRow}>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFn(dish.id)}><Ionicons name="remove" size={18} color="#1a1612" /></TouchableOpacity>
                  <Text style={modal.qtyText}>{qty}</Text>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => addFn(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] })}><Ionicons name="add" size={18} color="#1a1612" /></TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function Paella() {
  const router = useRouter();
  const { addToCart, removeFromCart, items } = useCart();
  const [search, setSearch] = useState('');
  const [activeDish, setActiveDish] = useState<typeof DISHES[0] | null>(null);
  const [cardStates, setCardStates] = useState<Record<string, 'idle'|'confirming'|'added'>>({});
  const setCardState = (id: string, state: 'idle'|'confirming'|'added') => setCardStates(prev => ({ ...prev, [id]: state }));
  const filtered = DISHES.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push('/tabs/menu')}>
          <Ionicons name="arrow-back" size={24} color="#1a1612" /><Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}><Text style={s.title}>Paella Menu</Text><Text style={s.subtitle}>Casa Del Sol</Text></View>
        <View style={{ width: 60 }} />
      </View>
      <View style={s.searchWrap}><Ionicons name="search" size={16} color={RED} style={{ marginRight: 8 }} /><TextInput style={s.search} placeholder="Search..." placeholderTextColor={RED} value={search} onChangeText={setSearch} /></View>
      <ScrollView contentContainerStyle={s.list}>
        {filtered.map(dish => {
          const qty = items.find(i => i.id === dish.id)?.quantity ?? 0;
          const cs  = cardStates[dish.id] ?? 'idle';
          return (
            <TouchableOpacity key={dish.id} style={s.card} onPress={() => setActiveDish(dish)} activeOpacity={0.88}>
              <View style={s.cardImgWrap}><Image source={dish.images[0]} style={s.cardImg} resizeMode="cover" /></View>
              <View style={s.cardBody}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}><Text style={s.cardName}>{dish.name}</Text><Text style={s.cardDesc} numberOfLines={2}>{dish.description}</Text></View>
                  {cs === 'idle' && (
                    <TouchableOpacity style={s.cartCircle} onPress={(e) => { e.stopPropagation(); addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] }); setCardState(dish.id, 'confirming'); }}><Ionicons name="cart" size={18} color="#1a1612" /></TouchableOpacity>
                  )}
                  {(cs === 'confirming' || cs === 'added') && (
                    <View style={s.qtyRow}>
                      <TouchableOpacity style={s.qtyBtn} onPress={(e) => { e.stopPropagation(); removeFromCart(dish.id); if (qty <= 1) setCardState(dish.id, 'idle'); }}><Ionicons name="remove" size={16} color="#1a1612" /></TouchableOpacity>
                      <Text style={s.qtyText}>{qty}</Text>
                      <TouchableOpacity style={s.qtyBtn} onPress={(e) => { e.stopPropagation(); addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] }); }}><Ionicons name="add" size={16} color="#1a1612" /></TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={s.cardPrice}>P {dish.price}.00</Text>
                {cs === 'confirming' && (
                  <View style={s.actionRow}>
                    <TouchableOpacity style={s.cancelBtn} onPress={(e) => { e.stopPropagation(); removeFromCart(dish.id); setCardState(dish.id, 'idle'); }}>
                      <Text style={s.cancelTxt}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.addBtn} onPress={(e) => { e.stopPropagation(); setCardState(dish.id, 'added'); }}>
                      <Ionicons name="cart" size={16} color="#1a1612" />
                      <Text style={s.addTxt}>Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {cs === 'added' && (
                  <View style={s.actionRow}>
                    <TouchableOpacity style={s.removeBtn} onPress={(e) => { e.stopPropagation(); removeFromCart(dish.id); setCardState(dish.id, 'idle'); }}>
                      <Text style={s.cancelTxt}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.addedBtn} disabled>
                      <Ionicons name="checkmark-circle" size={16} color="#fff" />
                      <Text style={[s.addTxt, { color: '#fff' }]}>Added to Cart</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 60 }} />
      </ScrollView>
      <DishModal
          dish={activeDish}
          onClose={() => setActiveDish(null)}
          cs={activeDish ? (cardStates[activeDish.id] ?? 'idle') : 'idle'}
          setCs={(state) => activeDish && setCardState(activeDish.id, state)}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          items={items}
        />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: YELLOW }, header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' }, backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 70 }, backText: { fontSize: 16, fontWeight: '700', color: '#1a1612' }, headerCenter: { flex: 1, alignItems: 'center' }, title: { fontSize: 18, fontWeight: '800', color: '#1a1612', textAlign: 'center' }, subtitle: { fontSize: 11, color: RED, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' }, searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: YELLOW }, search: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1a1612' }, list: { paddingHorizontal: 16, paddingTop: 4 }, card: { backgroundColor: '#fff', borderRadius: 18, marginBottom: 20, overflow: 'hidden', elevation: 2 }, cardImgWrap: { width: '100%', height: Math.round((SW - 40) * 0.6) }, cardImg: { width: '100%', height: '100%' }, cardBody: { padding: 16, paddingBottom: 8 }, cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 }, cardName: { fontSize: 17, fontWeight: '800', color: '#1a1612', marginBottom: 4 }, cardDesc: { fontSize: 13, color: '#6b6b6b', lineHeight: 19 }, cardPrice: { fontSize: 16, fontWeight: '800', color: RED }, cartCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: YELLOW, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, flexShrink: 0 }, qtyBtn: { padding: 2 }, qtyText: { fontSize: 14, fontWeight: '800', color: '#1a1612', minWidth: 18, textAlign: 'center' },
  actionRow:  { flexDirection: 'row', gap: 8, marginTop: 4 },
  cancelBtn:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#b60015' },
  removeBtn:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#b60015' },
  cancelTxt:  { fontSize: 14, fontWeight: '800', color: '#fff' },
  addBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: '#FFD544' },
  addedBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: '#22c55e' },
  addTxt:     { fontSize: 14, fontWeight: '800', color: '#1a1612' },
});
const modal = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }, sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' }, imageBox: { width: SW, height: SW, backgroundColor: '#eee', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }, navBtn: { position: 'absolute', top: '50%', marginTop: -22, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, backBtn: { position: 'absolute', top: 14, right: 14, backgroundColor: '#fff', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', elevation: 6, zIndex: 10 }, body: { padding: 20, paddingBottom: 60 }, name: { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 8 }, desc: { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 20 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, price: { fontSize: 22, fontWeight: '800', color: RED }, cartCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center' }, qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: YELLOW, borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8 }, qtyBtn: { padding: 4 }, qtyText: { fontSize: 16, fontWeight: '800', color: '#1a1612', minWidth: 20, textAlign: 'center' },
});
