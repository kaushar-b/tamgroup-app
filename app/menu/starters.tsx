import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';

const { width: SW } = Dimensions.get('window');
const RED    = '#b60015';
const YELLOW = '#FFD544';
const GREEN  = '#22c55e';

const DISHES = [
  {
    id: 's1', name: 'Assorted Stuffed Vegetables', category: 'All',
    description: 'Mixed stuffed tomatoes, zucchini, eggplant...',
    details: 'Mixed stuffed tomatoes, zucchini, eggplant, and onion with premium minced meat filling, garnished with herbs.',
    price: 220,
    images: [
      require('../../assets/images/products/Stuffed vegetables1.jpeg'),
      require('../../assets/images/products/Stuffed Vegetables1.jpeg'),
      require('../../assets/images/products/Stuffed Vegetables2.jpeg'),
    ],
  },
  {
    id: 's2', name: 'Tomato & Basil Bruschetta', category: 'All',
    description: 'Toasted bread topped with roasted cherry tomatoes...',
    details: 'Toasted bread topped with roasted cherry tomatoes, garlic, ricotta/cream cheese, and fresh basil.',
    price: 120,
    images: [
      require('../../assets/images/products/Tomato & Basil Bruschetta1.jpeg'),
      require('../../assets/images/products/Tomato & Basil Bruschetta2.jpeg'),
      require('../../assets/images/products/Tomato & Basil Bruschetta3.jpeg'),
      require('../../assets/images/products/Bruschetta Tomato1.jpeg'),
    ],
  },
  {
    id: 's3', name: 'Seafood Stew', category: 'All',
    description: 'Mixed fish, mussels, clams in a tomato-based broth...',
    details: 'Mixed fish, mussels, clams in a tomato-based broth with lemon and herbs.',
    price: 230,
    images: [
      require('../../assets/images/products/Seafood Stew1.jpeg'),
      require('../../assets/images/products/Seafood Stew2.jpeg'),
      require('../../assets/images/products/Seafood Stew3.jpeg'),
    ],
  },
  {
    id: 's5', name: 'Marinated Bell Peppers', category: 'Signature Salads',
    description: 'Olive oil with garlic, thyme, and balsamic...',
    details: 'Olive oil with garlic, thyme, and balsamic — "Peperoni Arrostiti".',
    price: 49,
    images: [
      require('../../assets/images/products/bell pepper salad1.jpeg'),
      require('../../assets/images/products/Roasted Red1.jpeg'),
      require('../../assets/images/products/Roasted Red2.jpeg'),
      require('../../assets/images/products/Roasted Red3.jpeg'),
    ],
  },
  {
    id: 's6', name: 'Roquefort Walnut Salad', category: 'Signature Salads',
    description: 'Roquefort et noix — Endive, Roquefort/Blue Cheese...',
    details: 'Roquefort et noix — Endive, Roquefort/Blue Cheese, and Walnut Salad.',
    price: 69,
    images: [
      require('../../assets/images/products/Roquefort salad1.jpeg'),
      require('../../assets/images/products/Roquefort salad2.jpeg'),
      require('../../assets/images/products/blue cheese salad1.jpeg'),
      require('../../assets/images/products/blue cheese salad2.jpeg'),
    ],
  },
  {
    id: 's7', name: 'Batata and Onion Omelette', category: 'All',
    description: 'Spanish tortilla de patatas, golden omelette made with...',
    details: 'Tortilla de patatas — golden omelette made with potatoes, onions, eggs, and olive oil.',
    price: 50,
    images: [
      require('../../assets/images/products/batata onion omelette1.jpeg'),
      require('../../assets/images/products/batata onion omelette2.jpeg'),
    ],
  },
  {
    id: 's8', name: 'Tomato Garlic Bruschetta Skewers', category: 'All',
    description: 'Italian bruschetta spiedini, bite-sized skewers...',
    details: 'Italian bruschetta spiedini — bite-sized skewers made with toasted bread cubes, fresh tomato, garlic, olive oil, and basil.',
    price: 45,
    images: [require('../../assets/images/products/bruschetta skewers1.jpeg')],
  },
];

const CATS = ['All', 'Signature Salads'];

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

export default function Starters() {
  const router = useRouter();
  const { count } = useCart();
  const [search, setSearch]         = useState('');
  const [activeCat, setActiveCat]   = useState('All');
  const [activeDish, setActiveDish] = useState<typeof DISHES[0] | null>(null);

  const filtered = DISHES.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) &&
    (activeCat === 'All' || d.category === activeCat)
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push('/tabs/menu')}>
          <Ionicons name="arrow-back" size={24} color="#1a1612" />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Starters Menu</Text>
          <Text style={s.subtitle}>Casa Del Sol</Text>
        </View>
        <TouchableOpacity style={s.cartBtn} onPress={() => router.push('/tabs/cart')}>
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

      <View style={s.catsRow}>
        {CATS.map(cat => (
          <TouchableOpacity key={cat} style={[s.catChip, activeCat === cat && s.catChipActive]} onPress={() => setActiveCat(cat)}>
            <Text style={[s.catChipText, activeCat === cat && s.catChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
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
  container:         { flex: 1, backgroundColor: YELLOW },
  header:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  cartBtn:           { padding: 8, position: 'relative', width: 44, alignItems: 'center' },
  cartBadge:         { position: 'absolute', top: 0, right: 0, backgroundColor: RED, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  cartBadgeTxt:      { fontSize: 10, fontWeight: '900', color: '#fff', textAlign: 'center' },
  backBtn:           { flexDirection: 'row', alignItems: 'center', gap: 6, width: 70 },
  backText:          { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  headerCenter:      { flex: 1, alignItems: 'center' },
  title:             { fontSize: 18, fontWeight: '800', color: '#1a1612', textAlign: 'center' },
  subtitle:          { fontSize: 11, color: RED, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' },
  searchWrap:        { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: YELLOW },
  search:            { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1a1612' },
  catsRow:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  catChip:           { paddingHorizontal: 22, paddingVertical: 12, borderRadius: 50, backgroundColor: RED },
  catChipActive:     { backgroundColor: '#1a1612' },
  catChipText:       { fontSize: 14, fontWeight: '700', color: '#fff' },
  catChipTextActive: { color: '#fff' },
  list:              { paddingHorizontal: 16, paddingTop: 4 },
  card:              { backgroundColor: '#fff', borderRadius: 18, marginBottom: 20, overflow: 'hidden', elevation: 2 },
  cardImgWrap:       { width: '100%', height: Math.round((SW - 40) * 0.6) },
  cardImg:           { width: '100%', height: '100%' },
  cardBody:          { padding: 16 },
  cardName:          { fontSize: 17, fontWeight: '800', color: '#1a1612', marginBottom: 4 },
  cardDesc:          { fontSize: 13, color: '#6b6b6b', lineHeight: 19, marginBottom: 8 },
  cardPrice:         { fontSize: 16, fontWeight: '800', color: RED },
});

const modal = StyleSheet.create({
  backdrop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  imageBox:     { width: SW, height: SW, backgroundColor: '#eee', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  navBtn:       { position: 'absolute', top: '50%', marginTop: -22, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backBtn:      { position: 'absolute', top: 14, right: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, elevation: 6, zIndex: 10 },
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
