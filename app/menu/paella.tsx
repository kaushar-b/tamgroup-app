import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';

const { width: SW } = Dimensions.get('window');
const RED = '#b60015';
const YELLOW = '#FFD544';

const DISHES = [
  { id: 'p1', name: 'Seafood Paella', description: 'Classic Spanish seafood paella with fresh catch.', details: 'Add your full description here.', price: 400, images: [require('../../assets/images/products/Seafood Paella1.jpeg'), require('../../assets/images/products/Seafood Paella2.jpeg')] },
  { id: 'p2', name: 'Garlic Butter Shrimp Paella', description: 'Rich garlic butter shrimp paella.', details: 'Add your full description here.', price: 400, images: [require('../../assets/images/products/Garlic Butter Shrimp1.jpeg'), require('../../assets/images/products/Garlic Butter Shrimp2.jpeg')] },
  { id: 'p3', name: 'Seafood Stew Paella', description: 'Hearty seafood stew style paella.', details: 'Add your full description here.', price: 400, images: [require('../../assets/images/products/Seafood Stew1.jpeg'), require('../../assets/images/products/Seafood Stew2.jpeg')] },
];

function DishModal({ dish, onClose }: { dish: typeof DISHES[0] | null; onClose: () => void }) {
  const { addToCart, removeFromCart, items } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  if (!dish) return null;
  const qty = items.find(i => i.id === dish.id)?.quantity ?? 0;
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={modal.sheet}>
          <View style={modal.imageBox}>
            <Image source={dish.images[imgIdx]} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            {dish.images.length > 1 && (<>
              <TouchableOpacity style={[modal.navBtn, { left: 10 }]} onPress={() => setImgIdx(i => Math.max(0, i - 1))}><Ionicons name="chevron-back" size={22} color="#fff" /></TouchableOpacity>
              <TouchableOpacity style={[modal.navBtn, { right: 10 }]} onPress={() => setImgIdx(i => Math.min(dish.images.length - 1, i + 1))}><Ionicons name="chevron-forward" size={22} color="#fff" /></TouchableOpacity>
            </>)}
            <TouchableOpacity style={modal.backBtn} onPress={onClose}><Ionicons name="arrow-back" size={18} color="#1a1612" /><Text style={modal.backBtnText}>Back</Text></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={modal.body}>
            <Text style={modal.name}>{dish.name}</Text>
            <Text style={modal.desc}>{dish.details}</Text>
            <View style={modal.footer}>
              <Text style={modal.price}>P {dish.price}.00</Text>
              {qty === 0 ? (
                <TouchableOpacity style={modal.cartCircle} onPress={() => addToCart(dish.id)}><Ionicons name="cart" size={20} color="#1a1612" /></TouchableOpacity>
              ) : (
                <View style={modal.qtyRow}>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFromCart(dish.id)}><Ionicons name="remove" size={18} color="#1a1612" /></TouchableOpacity>
                  <Text style={modal.qtyText}>{qty}</Text>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => addToCart(dish.id)}><Ionicons name="add" size={18} color="#1a1612" /></TouchableOpacity>
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
  const filtered = DISHES.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={20} color="#1a1612" /><Text style={s.backText}>Back</Text></TouchableOpacity>
        <View style={s.headerCenter}><Text style={s.title}>Paella Menu</Text><Text style={s.subtitle}>Casa Del Sol</Text></View>
        <View style={{ width: 60 }} />
      </View>
      <View style={s.searchWrap}><Ionicons name="search" size={16} color={RED} style={{ marginRight: 8 }} /><TextInput style={s.search} placeholder="Search..." placeholderTextColor={RED} value={search} onChangeText={setSearch} /></View>
      <ScrollView contentContainerStyle={s.list}>
        {filtered.map(dish => {
          const qty = items.find(i => i.id === dish.id)?.quantity ?? 0;
          return (
            <TouchableOpacity key={dish.id} style={s.card} onPress={() => setActiveDish(dish)} activeOpacity={0.88}>
              <View style={s.cardImgWrap}><Image source={dish.images[0]} style={s.cardImg} resizeMode="cover" /></View>
              <View style={s.cardBody}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}><Text style={s.cardName}>{dish.name}</Text><Text style={s.cardDesc} numberOfLines={2}>{dish.description}</Text></View>
                  {qty === 0 ? (
                    <TouchableOpacity style={s.cartCircle} onPress={() => addToCart(dish.id)}><Ionicons name="cart" size={18} color="#1a1612" /></TouchableOpacity>
                  ) : (
                    <View style={s.qtyRow}>
                      <TouchableOpacity style={s.qtyBtn} onPress={() => removeFromCart(dish.id)}><Ionicons name="remove" size={16} color="#1a1612" /></TouchableOpacity>
                      <Text style={s.qtyText}>{qty}</Text>
                      <TouchableOpacity style={s.qtyBtn} onPress={() => addToCart(dish.id)}><Ionicons name="add" size={16} color="#1a1612" /></TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={s.cardPrice}>P {dish.price}.00</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
      <DishModal dish={activeDish} onClose={() => setActiveDish(null)} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: YELLOW }, header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' }, backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 60 }, backText: { fontSize: 15, fontWeight: '700', color: '#1a1612' }, headerCenter: { flex: 1, alignItems: 'center' }, title: { fontSize: 18, fontWeight: '800', color: '#1a1612' }, subtitle: { fontSize: 11, color: RED, fontWeight: '700', letterSpacing: 0.5 }, searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#FFD544' }, search: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1a1612' }, list: { paddingHorizontal: 16, paddingTop: 4 }, card: { backgroundColor: '#fff', borderRadius: 18, marginBottom: 20, overflow: 'hidden', elevation: 2 }, cardImgWrap: { width: '100%', height: Math.round((SW - 40) * 0.6) }, cardImg: { width: '100%', height: '100%' }, cardBody: { padding: 16 }, cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 }, cardName: { fontSize: 17, fontWeight: '800', color: '#1a1612', marginBottom: 4 }, cardDesc: { fontSize: 13, color: '#6b6b6b', lineHeight: 19 }, cardPrice: { fontSize: 16, fontWeight: '800', color: RED }, cartCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F3C3C5', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, flexShrink: 0 }, qtyBtn: { padding: 2 }, qtyText: { fontSize: 14, fontWeight: '800', color: '#1a1612', minWidth: 18, textAlign: 'center' },
});
const modal = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }, sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' }, imageBox: { width: SW, height: SW, backgroundColor: '#FADAD9', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }, navBtn: { position: 'absolute', top: '50%', marginTop: -22, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, backBtn: { position: 'absolute', top: 14, left: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 14, paddingVertical: 8, elevation: 3 }, backBtnText: { fontSize: 14, fontWeight: '700', color: '#1a1612' }, body: { padding: 20, paddingBottom: 60 }, name: { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 8 }, desc: { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 20 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, price: { fontSize: 22, fontWeight: '800', color: RED }, cartCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center' }, qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#F3C3C5', borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8 }, qtyBtn: { padding: 4 }, qtyText: { fontSize: 16, fontWeight: '800', color: '#1a1612', minWidth: 20, textAlign: 'center' },
});
