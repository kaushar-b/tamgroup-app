import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart, MENU_ITEMS } from '../../context/CartContext';
import { useRouter } from 'expo-router';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Sides', 'Drinks', 'Desserts'];
const { width: SW } = Dimensions.get('window');

function ProductModal({ item, onClose }: { item: typeof MENU_ITEMS[0] | null; onClose: () => void }) {
  const { addToCart, removeFromCart, items } = useCart();
  if (!item) return null;
  const qty = items.find(i => i.id === item.id)?.quantity ?? 0;

  return (
    <Modal visible={!!item} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={modal.sheet}>
          <TouchableOpacity style={modal.closeBtn} onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close" size={20} color="#1a1612" />
          </TouchableOpacity>
          <View style={modal.imageBox}>
            <Ionicons name={item.icon as any} size={80} color="#CE6F79" />
            <Text style={{ fontSize: 11, color: '#CE6F79', marginTop: 8 }}>Image coming soon</Text>
          </View>
          <ScrollView style={{ maxHeight: 320 }} contentContainerStyle={modal.body}>
            <Text style={modal.name}>{item.name}</Text>
            <View style={modal.metaRow}>
              <View style={modal.catBadge}><Text style={modal.catBadgeText}>{item.category}</Text></View>
              <Text style={modal.price}>P {item.price}.00</Text>
            </View>
            <Text style={modal.desc}>{item.description}</Text>
            <Text style={modal.details}>{item.details}</Text>
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
  const [activeItem, setActiveItem] = useState<typeof MENU_ITEMS[0] | null>(null);
  const { addToCart, removeFromCart, items } = useCart();
  const router = useRouter();

  const filtered = MENU_ITEMS.filter(item => {
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
          <Text style={styles.subtitle}>TAM GROUP RESTAURANT</Text>
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
            <Text style={[styles.catText, selected === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingTop: 8 }}>
        {filtered.map(item => {
          const qty = getQty(item.id);
          return (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => setActiveItem(item)} activeOpacity={0.75}>
              <View style={styles.cardImg}>
                <Ionicons name={item.icon as any} size={34} color="#CE6F79" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.price}>P {item.price}.00</Text>
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

      <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />
    </View>
  );
}

const CARD_H = 110;

const modal = StyleSheet.create({
  backdrop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  closeBtn:     { position: 'absolute', top: 14, right: 14, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center' },
  imageBox:     { width: SW, height: SW, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  body:         { padding: 24 },
  name:         { fontSize: 22, fontWeight: '800', color: '#1a1612', marginBottom: 10 },
  metaRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  catBadge:     { backgroundColor: '#FADAD9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  catBadgeText: { fontSize: 12, fontWeight: '600', color: '#CE6F79' },
  price:        { fontSize: 22, fontWeight: '800', color: '#CE6F79' },
  desc:         { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 8 },
  details:      { fontSize: 13, color: '#9b9b9b', lineHeight: 20, marginBottom: 24, fontStyle: 'italic' },
  addBtn:       { backgroundColor: '#FFDD32', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addBtnText:   { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  qtyRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, backgroundColor: '#F3C3C5', borderRadius: 14, padding: 14 },
  qtyBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  qtyText:      { fontSize: 18, fontWeight: '800', color: '#1a1612' },
});

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#F3C3C5' },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14, backgroundColor: '#FADAD9' },
  homeBtn:       { width: 44, height: 44, justifyContent: 'center' },
  headerCenter:  { flex: 1, alignItems: 'center' },
  title:         { fontSize: 22, fontWeight: '800', color: '#1a1612' },
  subtitle:      { fontSize: 11, color: '#CE6F79', marginTop: 1, letterSpacing: 0.5 },
  searchWrap:    { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 14, marginBottom: 8, backgroundColor: '#FADAD9', borderRadius: 12, paddingHorizontal: 12 },
  search:        { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1a1612' },
  cats:          { flexGrow: 0 },
  catBtn:        { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 8, backgroundColor: '#FADAD9', borderWidth: 1, borderColor: '#F3C3C5' },
  catBtnActive:  { backgroundColor: '#CE6F79', borderColor: '#CE6F79' },
  catText:       { fontSize: 14, fontWeight: '700', color: '#CE6F79' },
  catTextActive: { color: '#fff' },
  list:          { flex: 1 },
  card:          { flexDirection: 'row', backgroundColor: '#FADAD9', borderRadius: 14, marginBottom: 12, elevation: 1, borderWidth: 1, borderColor: '#F3C3C5', overflow: 'hidden', height: CARD_H },
  cardImg:       { width: CARD_H, height: CARD_H, backgroundColor: '#F3C3C5', alignItems: 'center', justifyContent: 'center' },
  cardInfo:      { flex: 1, padding: 12, justifyContent: 'center' },
  itemName:      { fontSize: 15, fontWeight: '700', color: '#1a1612', marginBottom: 4 },
  itemDesc:      { fontSize: 12, color: '#6b6b6b', lineHeight: 17, marginBottom: 10 },
  cardBottom:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:         { fontSize: 15, fontWeight: '800', color: '#CE6F79' },
  addBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFDD32', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnText:    { fontSize: 13, fontWeight: '700', color: '#1a1612' },
  qtyRow:        { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3C3C5', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4 },
  qtyBtn:        { padding: 3 },
  qtyText:       { fontSize: 14, fontWeight: '800', color: '#1a1612', minWidth: 18, textAlign: 'center' },
});
