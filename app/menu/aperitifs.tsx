import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';

const { width: SW } = Dimensions.get('window');
const RED    = '#b60015';
const YELLOW = '#FFD544';

const DISHES = [
  { id: 'a1', name: 'Signature Aperitif One',   description: 'A refreshing house aperitif.', details: 'Add your full description here.', price: 400, images: [require('../../assets/images/products/Coq au Vin1.jpeg')] },
  { id: 'a2', name: 'Signature Aperitif Two',   description: 'A classic Mediterranean aperitif.', details: 'Add your full description here.', price: 400, images: [require('../../assets/images/products/Coq au Vin2.jpeg')] },
];

function DishModal({ dish, onClose }: { dish: typeof DISHES[0] | null; onClose: () => void }) {
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

export default function Aperitifs() {
  const router = useRouter();
  const { count } = useCart();
  const [search, setSearch]         = useState('');
  const [activeDish, setActiveDish] = useState<typeof DISHES[0] | null>(null);
  const filtered = DISHES.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push('/tabs/menu')}>
          <Ionicons name="arrow-back" size={24} color="#1a1612" />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Signature Aperitifs</Text>
          <Text style={s.subtitle}>Casa Del Sol</Text>
        </View>
        <TouchableOpacity style={s.cartBtn} onPress={() => router.push('/checkout')}>
          <Ionicons name="cart" size={22} color="#1a1612" />
          {count > 0 && (
            <View style={s.cartBadge}>
              <Text style={s.cartBadgeTxt}>{count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={s.searchWrap}>
        <Ionicons name="search" size={16} color={RED} style={{ marginRight: 8 }} />
        <TextInput style={s.search} placeholder="Search..." placeholderTextColor={RED} value={search} onChangeText={setSearch} />
      </View>
      <ScrollView contentContainerStyle={s.list}>
        {filtered.map(dish => (
          <TouchableOpacity key={dish.id} style={s.card} onPress={() => setActiveDish(dish)} activeOpacity={0.88}>
            <View style={s.cardImgWrap}>
              <Image source={dish.images[0]} style={s.cardImg} resizeMode="cover" />
            </View>
            <View style={s.cardBody}>
              <Text style={s.cardName}>{dish.name}</Text>
              <Text style={s.cardDesc} numberOfLines={2}>{dish.description}</Text>
              <Text style={s.cardPrice}>P {dish.price}.00</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 60 }} />
      </ScrollView>
      <DishModal dish={activeDish} onClose={() => setActiveDish(null)} />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: YELLOW },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  cartBtn:      { padding: 8, position: 'relative', width: 44, alignItems: 'center' },
  cartBadge:    { position: 'absolute', top: 0, right: 0, backgroundColor: RED, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  cartBadgeTxt: { fontSize: 10, fontWeight: '900', color: '#fff', textAlign: 'center' },
  backBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6, width: 70 },
  backText:     { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title:        { fontSize: 18, fontWeight: '800', color: '#1a1612', textAlign: 'center' },
  subtitle:     { fontSize: 11, color: RED, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' },
  searchWrap:   { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, marginBottom: 4, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: YELLOW },
  search:       { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1a1612' },
  list:         { paddingHorizontal: 16, paddingTop: 12 },
  card:         { backgroundColor: '#fff', borderRadius: 18, marginBottom: 20, overflow: 'hidden', elevation: 2 },
  cardImgWrap:  { width: '100%', height: Math.round((SW - 40) * 0.6) },
  cardImg:      { width: '100%', height: '100%' },
  cardBody:     { padding: 16 },
  cardName:     { fontSize: 17, fontWeight: '800', color: '#1a1612', marginBottom: 4 },
  cardDesc:     { fontSize: 13, color: '#6b6b6b', lineHeight: 19, marginBottom: 8 },
  cardPrice:    { fontSize: 16, fontWeight: '800', color: RED },
});

const modal = StyleSheet.create({
  backdrop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  imageBox:     { width: SW, height: SW, backgroundColor: '#eee', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  backBtn:      { position: 'absolute', top: 14, left: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, elevation: 6, zIndex: 10 },
  backBtnText:  { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  body:         { padding: 20, paddingBottom: 40 },
  name:         { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 8 },
  desc:         { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 16 },
  priceRow:     { marginBottom: 16 },
  price:        { fontSize: 22, fontWeight: '800', color: RED },
  addBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: YELLOW, borderRadius: 14, paddingVertical: 16, marginBottom: 8 },
  addBtnTxt:    { fontSize: 16, fontWeight: '800', color: '#1a1612' },
  cartControls: { gap: 10 },
  removeBtn:    { alignItems: 'center', justifyContent: 'center', backgroundColor: RED, borderRadius: 14, paddingVertical: 14 },
  removeBtnTxt: { fontSize: 15, fontWeight: '800', color: '#fff' },
  qtyRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, backgroundColor: YELLOW, borderRadius: 14, paddingVertical: 12 },
  qtyBtn:       { padding: 4 },
  qtyText:      { fontSize: 18, fontWeight: '800', color: '#1a1612', minWidth: 24, textAlign: 'center' },
});
