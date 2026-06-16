import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Dimensions, Animated } from 'react-native';
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
    description: 'Italian bruschetta spiedini, bite-sized skewers made with...',
    details: 'Italian bruschetta spiedini — bite-sized skewers made with toasted bread cubes, fresh tomato, garlic, olive oil, and basil.',
    price: 45,
    images: [require('../../assets/images/products/bruschetta skewers1.jpeg')],
  },
];

const STARTER_CATS = ['All', 'Signature Salads'];

// ── Cart action state per dish id ──
type CardState = 'idle' | 'confirming' | 'added';

function DishModal({ dish, onClose, cs, setCs, addToCart: addFn, removeFromCart: removeFn, items: cartItems }: { dish: typeof DISHES[0] | null; onClose: () => void; cs: string; setCs: (s: 'idle'|'confirming'|'added') => void; addToCart: (id:string,item?:any)=>void; removeFromCart:(id:string)=>void; items: any[] }) {
  const [imgIdx, setImgIdx]     = useState(0);
  const [cardState, setCardState] = useState<CardState>('idle');
  if (!dish) return null;
  const qty = items.find(i => i.id === dish.id)?.quantity ?? 0;

  const handleCartPress = () => {
    if (cs === 'idle') {
      addFn(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] });
      setCs('confirming');
    }
  };
  const handleAdd = () => {
    setCs('added');
  };
  const handleCancel = () => {
    if (cs === 'added') {
      removeFn(dish.id);
      setCs('idle');
    } else {
      removeFn(dish.id);
      setCs('idle');
    }
  };

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
            {/* Back button TOP RIGHT of image */}
            <TouchableOpacity style={modal.backBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="#1a1612" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={modal.body}>
            <Text style={modal.name}>{dish.name}</Text>
            <Text style={modal.desc}>{dish.details}</Text>
            <View style={modal.footer}>
              <Text style={modal.price}>P {dish.price}.00</Text>
              {cs === 'idle' ? (
                <TouchableOpacity style={modal.cartCircle} onPress={handleCartPress}>
                  <Ionicons name="cart" size={22} color="#1a1612" />
                </TouchableOpacity>
              ) : cs === 'confirming' ? (
                <View style={modal.qtyRow}>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFn(dish.id)}><Ionicons name="remove" size={18} color="#1a1612" /></TouchableOpacity>
                  <Text style={modal.qtyText}>{qty}</Text>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => addFn(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] })}><Ionicons name="add" size={18} color="#1a1612" /></TouchableOpacity>
                </View>
              ) : null}
            </View>
            {cardState !== 'idle' && (
              <View style={modal.actionRow}>
                <TouchableOpacity
                  style={[modal.cancelBtn, cs === 'added' && modal.removeBtn]}
                  onPress={handleCancel}
                >
                  <Text style={modal.cancelTxt}>{cs === 'added' ? 'Remove' : 'Cancel'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[modal.addBtn, cs === 'added' && modal.addedBtn]}
                  onPress={handleAdd}
                  disabled={cs === 'added'}
                >
                  {cs === 'added'
                    ? <><Ionicons name="checkmark-circle" size={18} color="#fff" /><Text style={modal.addTxt}>Added to Cart</Text></>
                    : <><Ionicons name="cart" size={18} color="#1a1612" /><Text style={[modal.addTxt, { color: '#1a1612' }]}>Add to Cart</Text></>
                  }
                </TouchableOpacity>
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
  const { addToCart, removeFromCart, items } = useCart();
  const [search, setSearch]         = useState('');
  const [activeCat, setActiveCat]   = useState('All');
  const [activeDish, setActiveDish] = useState<typeof DISHES[0] | null>(null);
  // Track which card is in "confirming" or "added" state
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});

  const setCardState = (id: string, state: CardState) =>
    setCardStates(prev => ({ ...prev, [id]: state }));

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
        <View style={{ width: 70 }} />
      </View>

      <View style={s.searchWrap}>
        <Ionicons name="search" size={16} color={RED} style={{ marginRight: 8 }} />
        <TextInput style={s.search} placeholder="Search..." placeholderTextColor={RED} value={search} onChangeText={setSearch} />
      </View>

      <View style={s.catsRow}>
        {STARTER_CATS.map(cat => (
          <TouchableOpacity key={cat} style={[s.catChip, activeCat === cat && s.catChipActive]} onPress={() => setActiveCat(cat)}>
            <Text style={[s.catChipText, activeCat === cat && s.catChipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.list}>
        {filtered.map(dish => {
          const qty = items.find(i => i.id === dish.id)?.quantity ?? 0;
          const cs  = cardStates[dish.id] ?? 'idle';
          return (
            <TouchableOpacity key={dish.id} style={s.card} onPress={() => setActiveDish(dish)} activeOpacity={0.88}>
              <View style={s.cardImgWrap}>
                <Image source={dish.images[0]} style={s.cardImg} resizeMode="cover" />
              </View>
              <View style={s.cardBody}>
                <View style={s.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cardName}>{dish.name}</Text>
                    <Text style={s.cardDesc} numberOfLines={2}>{dish.description}</Text>
                  </View>
                  {/* Cart circle — shown when idle */}
                  {cs === 'idle' && (
                    <TouchableOpacity style={s.cartCircle} onPress={(e) => {
                      e.stopPropagation();
                      addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] });
                      setCardState(dish.id, 'confirming');
                    }}>
                      <Ionicons name="cart" size={18} color="#1a1612" />
                    </TouchableOpacity>
                  )}
                  {/* Qty row — shown when confirming or added */}
                  {(cs === 'confirming' || cs === 'added') && (
                    <View style={s.qtyRow}>
                      <TouchableOpacity style={s.qtyBtn} onPress={(e) => { e.stopPropagation(); removeFromCart(dish.id); if (qty <= 1) setCardState(dish.id, 'idle'); }}>
                        <Ionicons name="remove" size={16} color="#1a1612" />
                      </TouchableOpacity>
                      <Text style={s.qtyText}>{qty}</Text>
                      <TouchableOpacity style={s.qtyBtn} onPress={(e) => { e.stopPropagation(); addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: dish.images[0] }); }}>
                        <Ionicons name="add" size={16} color="#1a1612" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <Text style={s.cardPrice}>P {dish.price}.00</Text>

                {/* Cancel / Add to Cart buttons */}
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
  container:         { flex: 1, backgroundColor: YELLOW },
  header:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
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
  cardTop:           { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  cardName:          { fontSize: 17, fontWeight: '800', color: '#1a1612', marginBottom: 4 },
  cardDesc:          { fontSize: 13, color: '#6b6b6b', lineHeight: 19 },
  cardPrice:         { fontSize: 16, fontWeight: '800', color: RED, marginBottom: 8 },
  cartCircle:        { width: 44, height: 44, borderRadius: 22, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  qtyRow:            { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: YELLOW, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, flexShrink: 0 },
  qtyBtn:            { padding: 2 },
  qtyText:           { fontSize: 14, fontWeight: '800', color: '#1a1612', minWidth: 18, textAlign: 'center' },
  actionRow:         { flexDirection: 'row', gap: 8, marginTop: 4 },
  cancelBtn:         { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: RED },
  removeBtn:         { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: RED },
  cancelTxt:         { fontSize: 14, fontWeight: '800', color: '#fff' },
  addBtn:            { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: YELLOW },
  addedBtn:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: GREEN },
  addTxt:            { fontSize: 14, fontWeight: '800', color: '#1a1612' },
});

const modal = StyleSheet.create({
  backdrop:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  imageBox:   { width: SW, height: SW * 0.75, backgroundColor: '#eee', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  navBtn:     { position: 'absolute', top: '50%', marginTop: -22, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backBtn:    { position: 'absolute', top: 14, right: 14, backgroundColor: '#fff', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', elevation: 6, zIndex: 10 },
  body:       { padding: 20, paddingBottom: 40 },
  name:       { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 8 },
  desc:       { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 20 },
  footer:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  price:      { fontSize: 22, fontWeight: '800', color: RED },
  cartCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center' },
  qtyRow:     { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: YELLOW, borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8 },
  qtyBtn:     { padding: 4 },
  qtyText:    { fontSize: 16, fontWeight: '800', color: '#1a1612', minWidth: 20, textAlign: 'center' },
  actionRow:  { flexDirection: 'row', gap: 8, marginTop: 4 },
  cancelBtn:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, backgroundColor: RED },
  removeBtn:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, backgroundColor: RED },
  cancelTxt:  { fontSize: 15, fontWeight: '800', color: '#fff' },
  addBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 14, backgroundColor: YELLOW },
  addedBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, borderRadius: 14, backgroundColor: GREEN },
  addTxt:     { fontSize: 15, fontWeight: '800', color: '#1a1612' },
});
