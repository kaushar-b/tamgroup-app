import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart, MenuItem } from '../../context/CartContext';
import { useRouter } from 'expo-router';

const { width: SW } = Dimensions.get('window');

// Product images — name your files like dish1.jpeg, dish1b.jpeg, dish1c.jpeg
// and add them to assets/images/products/
// Then update the PRODUCT_IMAGES map below with the correct filenames.
const PRODUCT_IMAGES: Record<string, any[]> = {
  '1': [
    require('../../assets/images/products/dish1.jpeg'),
  ],
  '2': [
    require('../../assets/images/products/dish2.jpeg'),
  ],
  '3': [
    require('../../assets/images/products/dish3.jpeg'),
  ],
  '4': [
    require('../../assets/images/products/dish4.jpeg'),
  ],
  '5': [
    require('../../assets/images/products/dish5.jpeg'),
  ],
  '6': [
    require('../../assets/images/products/dish6.jpeg'),
  ],
  '7': [
    require('../../assets/images/products/dish7.jpeg'),
  ],
  '8': [
    require('../../assets/images/products/dish8.jpeg'),
  ],
  '9': [
    require('../../assets/images/products/dish9.jpeg'),
  ],
  '10': [
    require('../../assets/images/products/dish10.jpeg'),
  ],
  '11': [
    require('../../assets/images/products/dish11.jpeg'),
  ],
};

// IMAGE SIZES (for reference when preparing your images):
// Product card image:  width = screen width - 40px,  height = (SW - 40) * 0.6  (landscape rectangle)
// Product popup image: same width,  height = (SW - 40) * 0.6  (matches card)

const CARD_IMG_H = Math.round((SW - 40) * 0.6);

function ProductModal({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { addToCart, removeFromCart, items } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  if (!item) return null;
  const qty = items.find(i => i.id === item.id)?.quantity ?? 0;
  const imgs = PRODUCT_IMAGES[item.id] || [];

  return (
    <Modal visible={!!item} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={modal.sheet}>
          <TouchableOpacity style={modal.closeBtn} onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close" size={20} color="#1a1612" />
          </TouchableOpacity>

          {/* Image area — same rectangle ratio as card */}
          <View style={modal.imageBox}>
            {imgs.length > 0 ? (
              <Image source={imgs[imgIdx]} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Ionicons name="restaurant" size={60} color="#CE6F79" />
              </View>
            )}
            {imgs.length > 1 && (
              <>
                <TouchableOpacity
                  style={[modal.navBtn, { left: 10 }]}
                  onPress={() => setImgIdx(i => Math.max(0, i - 1))}
                >
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[modal.navBtn, { right: 10 }]}
                  onPress={() => setImgIdx(i => Math.min(imgs.length - 1, i + 1))}
                >
                  <Ionicons name="chevron-forward" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={modal.imgDots}>
                  {imgs.map((_, i) => (
                    <View key={i} style={[modal.imgDot, i === imgIdx && modal.imgDotActive]} />
                  ))}
                </View>
              </>
            )}
          </View>

          {/* Info */}
          <ScrollView contentContainerStyle={modal.body}>
            <Text style={modal.name}>{item.name}</Text>
            <Text style={modal.desc}>{item.details}</Text>
            <View style={modal.footer}>
              <Text style={modal.price}>P {item.price}.00</Text>
              {qty === 0 ? (
                <TouchableOpacity style={modal.cartCircle} onPress={() => addToCart(item.id)}>
                  <Ionicons name="cart" size={20} color="#1a1612" />
                </TouchableOpacity>
              ) : (
                <View style={modal.qtyRow}>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFromCart(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="remove" size={18} color="#1a1612" />
                  </TouchableOpacity>
                  <Text style={modal.qtyText}>{qty}</Text>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => addToCart(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="add" size={18} color="#1a1612" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function Menu() {
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const { addToCart, items, menuItems } = useCart();
  const router = useRouter();

  const filtered = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const getQty = (id: string) => items.find(i => i.id === id)?.quantity ?? 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/tabs')} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={styles.homeBtn}>
          <Ionicons name="home-outline" size={22} color="#1a1612" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Menu</Text>
          <Text style={styles.subtitle}>TAM RESTAURANT GROUP</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#CE6F79" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.search}
          placeholder="Search dishes..."
          placeholderTextColor="#CE6F79"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#CE6F79" />
          </TouchableOpacity>
        )}
      </View>

      {/* Product list — one big card per dish */}
      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map(item => {
          const qty = getQty(item.id);
          const imgs = PRODUCT_IMAGES[item.id] || [];
          return (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => setActiveItem(item)} activeOpacity={0.88}>
              {/* Image */}
              <View style={styles.cardImgWrap}>
                {imgs.length > 0 ? (
                  <Image source={imgs[0]} style={styles.cardImg} resizeMode="cover" />
                ) : (
                  <View style={[styles.cardImg, styles.cardImgPlaceholder]}>
                    <Ionicons name="restaurant" size={48} color="#CE6F79" />
                  </View>
                )}
              </View>

              {/* Info box */}
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                  </View>
                  {/* Yellow cart circle */}
                  <TouchableOpacity
                    style={[styles.cartCircle, qty > 0 && styles.cartCircleActive]}
                    onPress={e => { e.stopPropagation?.(); addToCart(item.id); }}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Ionicons name="cart" size={18} color={qty > 0 ? '#fff' : '#1a1612'} />
                    {qty > 0 && <Text style={styles.cartCircleQty}>{qty}</Text>}
                  </TouchableOpacity>
                </View>
                <Text style={styles.cardPrice}>P {item.price}.00</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>

      <ProductModal item={activeItem} onClose={() => { setActiveItem(null); }} />
    </View>
  );
}

const modal = StyleSheet.create({
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  closeBtn:    { position: 'absolute', top: 14, right: 14, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  imageBox:    { width: SW, height: Math.round(SW * 0.6), backgroundColor: '#FADAD9', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  navBtn:      { position: 'absolute', top: '50%', marginTop: -22, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  imgDots:     { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  imgDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  imgDotActive:{ width: 14, backgroundColor: '#fff' },
  body:        { padding: 20, paddingBottom: 36 },
  name:        { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 8 },
  desc:        { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 20 },
  footer:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price:       { fontSize: 22, fontWeight: '800', color: '#CE6F79' },
  cartCircle:  { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFDD32', alignItems: 'center', justifyContent: 'center' },
  qtyRow:      { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#F3C3C5', borderRadius: 24, paddingHorizontal: 12, paddingVertical: 8 },
  qtyBtn:      { padding: 4 },
  qtyText:     { fontSize: 16, fontWeight: '800', color: '#1a1612', minWidth: 20, textAlign: 'center' },
});

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#F3C3C5' },
  header:             { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10, backgroundColor: '#fff' },
  homeBtn:            { width: 44, height: 44, justifyContent: 'center' },
  headerCenter:       { flex: 1, alignItems: 'center' },
  title:              { fontSize: 22, fontWeight: '800', color: '#1a1612' },
  subtitle:           { fontSize: 11, color: '#CE6F79', marginTop: 1, letterSpacing: 0.5 },
  searchWrap:         { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, marginBottom: 12, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#F3C3C5' },
  search:             { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1a1612' },
  list:               { paddingHorizontal: 16, paddingTop: 4 },
  card:               { backgroundColor: '#fff', borderRadius: 18, marginBottom: 20, overflow: 'hidden', elevation: 2, shadowColor: '#CE6F79', shadowOpacity: 0.1, shadowRadius: 8 },
  cardImgWrap:        { width: '100%', height: Math.round((SW - 40) * 0.6), overflow: 'hidden' },
  cardImg:            { width: '100%', height: '100%' },
  cardImgPlaceholder: { backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center' },
  cardBody:           { padding: 16 },
  cardTop:            { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  cardName:           { fontSize: 17, fontWeight: '800', color: '#1a1612', marginBottom: 4 },
  cardDesc:           { fontSize: 13, color: '#6b6b6b', lineHeight: 19 },
  cardPrice:          { fontSize: 16, fontWeight: '800', color: '#CE6F79' },
  cartCircle:         { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFDD32', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cartCircleActive:   { backgroundColor: '#CE6F79' },
  cartCircleQty:      { position: 'absolute', top: -4, right: -4, backgroundColor: '#1a1612', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
});
