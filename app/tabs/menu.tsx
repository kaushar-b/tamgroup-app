import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Dimensions, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart, MenuItem } from '../../context/CartContext';
import { useRouter } from 'expo-router';

const CATEGORIES = ['All', 'Arabic', 'French', 'Grills', 'Burgers', 'Seafood', 'Pasta', 'Salads', 'Sides', 'Drinks', 'Desserts'];
const { width: SW } = Dimensions.get('window');

function ProductModal({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { addToCart, removeFromCart, items } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  if (!item) return null;
  const qty = items.find(i => i.id === item.id)?.quantity ?? 0;
  const imgs = item.images || [];

  return (
    <Modal visible={!!item} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={modal.sheet}>
          <TouchableOpacity style={modal.closeBtn} onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close" size={20} color="#1a1612" />
          </TouchableOpacity>
          <View style={modal.imageBox}>
            {imgs.length > 0 ? (
              <Image source={{ uri: imgs[imgIdx] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name={item.icon as any} size={80} color="#CE6F79" />
                <Text style={{ fontSize: 11, color: '#CE6F79', marginTop: 8 }}>Image coming soon</Text>
              </View>
            )}
            {imgs.length > 1 && (
              <View style={modal.imgNav}>
                <TouchableOpacity onPress={() => setImgIdx(i => Math.max(0, i - 1))} style={modal.imgNavBtn}>
                  <Ionicons name="chevron-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={modal.imgDots}>
                  {imgs.map((_, i) => <View key={i} style={[modal.imgDot, i === imgIdx && modal.imgDotActive]} />)}
                </View>
                <TouchableOpacity onPress={() => setImgIdx(i => Math.min(imgs.length - 1, i + 1))} style={modal.imgNavBtn}>
                  <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <ScrollView style={{ maxHeight: 320 }} contentContainerStyle={modal.body}>
            <View style={modal.metaRow}>
              <View>
                <Text style={modal.name}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <View style={modal.catBadge}><Text style={modal.catBadgeText}>{item.category}</Text></View>
                  {item.on_special && <View style={modal.specialBadge}><Text style={modal.specialBadgeText}>SPECIAL</Text></View>}
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={modal.price}>P {item.price}.00</Text>
                {item.was_price ? <Text style={modal.wasPrice}>was P {item.was_price}.00</Text> : null}
              </View>
            </View>
            <Text style={modal.desc}>{item.description}</Text>
            {item.details ? <Text style={modal.details}>{item.details}</Text> : null}
            {qty === 0 ? (
              <TouchableOpacity style={modal.addBtn} onPress={() => addToCart(item.id)}>
                <Ionicons name="cart" size={18} color="#1a1612" />
                <Text style={modal.addBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            ) : (
              <View style={modal.qtyRow}>
                <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFromCart(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="remove" size={20} color="#1a1612" />
                </TouchableOpacity>
                <Text style={modal.qtyText}>{qty} in cart</Text>
                <TouchableOpacity style={modal.qtyBtn} onPress={() => addToCart(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="add" size={20} color="#1a1612" />
                </TouchableOpacity>
              </View>
            )}
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function Menu() {
  const [selected, setSelected] = useState('All');
  const [search, setSearch] = useState('');
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const { addToCart, removeFromCart, items, menuItems, menuLoading } = useCart();
  const router = useRouter();

  const filtered = menuItems.filter(item => {
    const matchCat = selected === 'All' || item.category === selected;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getQty = (id: string) => items.find(i => i.id === id)?.quantity ?? 0;

  return (
    <View style={styles.container}>
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

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#CE6F79" style={{ marginRight: 8 }} />
        <TextInput style={styles.search} placeholder="Search menu..." placeholderTextColor="#CE6F79" value={search} onChangeText={setSearch} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cats} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 6 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} style={[styles.catBtn, selected === cat && styles.catBtnActive]} onPress={() => setSelected(cat)} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            <Text style={styles.catText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {menuLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#CE6F79" size="large" />
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
          {filtered.map(item => {
            const qty = getQty(item.id);
            const firstImg = item.images?.[0];
            return (
              <TouchableOpacity key={item.id} style={styles.card} onPress={() => setActiveItem(item)} activeOpacity={0.75}>
                <View style={styles.cardImg}>
                  {firstImg ? (
                    <Image source={{ uri: firstImg }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <Ionicons name={item.icon as any} size={34} color="#CE6F79" />
                  )}
                </View>
                <View style={styles.cardInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.on_special && <View style={styles.specialTag}><Text style={styles.specialTagText}>SALE</Text></View>}
                  </View>
                  <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.cardBottom}>
                    <View>
                      <Text style={styles.price}>P {item.price}.00</Text>
                      {item.was_price ? <Text style={styles.wasPrice}>was P {item.was_price}.00</Text> : null}
                    </View>
                    {qty === 0 ? (
                      <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                        <Ionicons name="add" size={16} color="#1a1612" />
                        <Text style={styles.addBtnText}>Add</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.qtyRow}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                          <Ionicons name="remove" size={14} color="#1a1612" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{qty}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                          <Ionicons name="add" size={14} color="#1a1612" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 16 }} />
        </ScrollView>
      )}

      <ProductModal item={activeItem} onClose={() => { setActiveItem(null); }} />
    </View>
  );
}

const CARD_H = 110;

const modal = StyleSheet.create({
  backdrop:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:           { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  closeBtn:        { position: 'absolute', top: 14, right: 14, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center' },
  imageBox:        { width: SW, height: SW, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  imgNav:          { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  imgNavBtn:       { backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 6 },
  imgDots:         { flexDirection: 'row', gap: 5 },
  imgDot:          { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  imgDotActive:    { backgroundColor: '#fff', width: 14 },
  body:            { padding: 20 },
  metaRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  name:            { fontSize: 20, fontWeight: '800', color: '#1a1612' },
  catBadge:        { backgroundColor: '#CE6F79', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  catBadgeText:    { fontSize: 11, fontWeight: '600', color: '#fff' },
  specialBadge:    { backgroundColor: '#FFDD32', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  specialBadgeText:{ fontSize: 11, fontWeight: '700', color: '#1a1612' },
  price:           { fontSize: 22, fontWeight: '800', color: '#CE6F79' },
  wasPrice:        { fontSize: 12, color: '#aaa', textDecorationLine: 'line-through' },
  desc:            { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 8 },
  details:         { fontSize: 13, color: '#9b9b9b', lineHeight: 20, marginBottom: 20, fontStyle: 'italic' },
  addBtn:          { backgroundColor: '#FFDD32', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addBtnText:      { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  qtyRow:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, backgroundColor: '#F3C3C5', borderRadius: 14, padding: 14 },
  qtyBtn:          { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  qtyText:         { fontSize: 18, fontWeight: '800', color: '#1a1612' },
});

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F3C3C5' },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10, backgroundColor: '#fff' },
  homeBtn:       { width: 44, height: 44, justifyContent: 'center' },
  headerCenter:  { flex: 1, alignItems: 'center' },
  title:         { fontSize: 22, fontWeight: '800', color: '#1a1612' },
  subtitle:      { fontSize: 11, color: '#CE6F79', marginTop: 1, letterSpacing: 0.5 },
  searchWrap:    { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, marginBottom: 6, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: '#F3C3C5' },
  search:        { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1a1612' },
  cats:          { flexGrow: 0 },
  catBtn:        { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 8, backgroundColor: '#CE6F79' },
  catBtnActive:  { backgroundColor: '#9e4a5c' },
  catText:       { fontSize: 14, fontWeight: '700', color: '#fff' },
  list:          { flex: 1 },
  card:          { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, elevation: 1, borderWidth: 1, borderColor: '#F3C3C5', overflow: 'hidden', height: CARD_H },
  cardImg:       { width: CARD_H, height: CARD_H, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  cardInfo:      { flex: 1, padding: 12, justifyContent: 'center' },
  itemName:      { fontSize: 14, fontWeight: '700', color: '#1a1612', marginBottom: 2, flex: 1 },
  itemDesc:      { fontSize: 12, color: '#6b6b6b', lineHeight: 17, marginBottom: 8 },
  cardBottom:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:         { fontSize: 15, fontWeight: '800', color: '#CE6F79' },
  wasPrice:      { fontSize: 11, color: '#aaa', textDecorationLine: 'line-through' },
  specialTag:    { backgroundColor: '#FFDD32', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  specialTagText:{ fontSize: 9, fontWeight: '800', color: '#1a1612' },
  addBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFDD32', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnText:    { fontSize: 13, fontWeight: '700', color: '#1a1612' },
  qtyRow:        { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3C3C5', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4 },
  qtyBtn:        { padding: 3 },
  qtyText:       { fontSize: 14, fontWeight: '800', color: '#1a1612', minWidth: 18, textAlign: 'center' },
});
