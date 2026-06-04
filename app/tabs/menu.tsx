import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useCart, MENU_ITEMS } from '../../context/CartContext';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Sides', 'Drinks', 'Desserts'];

function ProductModal({ item, onClose }: { item: typeof MENU_ITEMS[0] | null; onClose: () => void }) {
  const { addToCart, removeFromCart, items } = useCart();
  if (!item) return null;
  const qty = items.find(i => i.id === item.id)?.quantity ?? 0;

  return (
    <Modal visible={!!item} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={modal.sheet}>
          <TouchableOpacity style={modal.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={Colors.black} />
          </TouchableOpacity>
          <View style={modal.imageBox}>
            <Ionicons name={item.icon as any} size={64} color={Colors.pink} />
          </View>
          <View style={modal.body}>
            <Text style={modal.name}>{item.name}</Text>
            <View style={modal.catRow}>
              <View style={modal.catBadge}><Text style={modal.catText}>{item.category}</Text></View>
              <Text style={modal.price}>P {item.price}.00</Text>
            </View>
            <Text style={modal.desc}>{item.description}</Text>
            <View style={modal.footer}>
              {qty === 0 ? (
                <TouchableOpacity style={modal.addBtn} onPress={() => addToCart(item.id)}>
                  <Ionicons name="cart" size={18} color={Colors.black} />
                  <Text style={modal.addBtnText}>Add to Cart — P {item.price}.00</Text>
                </TouchableOpacity>
              ) : (
                <View style={modal.qtyRow}>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFromCart(item.id)}>
                    <Ionicons name="remove" size={20} color={Colors.black} />
                  </TouchableOpacity>
                  <Text style={modal.qtyText}>{qty} in cart</Text>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => addToCart(item.id)}>
                    <Ionicons name="add" size={20} color={Colors.black} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
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

  const filtered = MENU_ITEMS.filter(item => {
    const matchCat = selected === 'All' || item.category === selected;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getQty = (id: string) => items.find(i => i.id === id)?.quantity ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Menu</Text>
        <Text style={styles.subtitle}>Mowana Park Mall</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={Colors.grey} style={styles.searchIcon} />
        <TextInput style={styles.search} placeholder="Search menu..." placeholderTextColor={Colors.grey} value={search} onChangeText={setSearch} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cats} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} style={[styles.catBtn, selected === cat && styles.catBtnActive]} onPress={() => setSelected(cat)}>
            <Text style={[styles.catText, selected === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 20, paddingTop: 8 }}>
        {filtered.map(item => {
          const qty = getQty(item.id);
          return (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => setActiveItem(item)} activeOpacity={0.8}>
              <View style={styles.cardIcon}>
                <Ionicons name={item.icon as any} size={32} color={Colors.pink} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.price}>P {item.price}.00</Text>
                  {qty === 0 ? (
                    <TouchableOpacity style={styles.addBtn} onPress={(e) => { e.stopPropagation?.(); addToCart(item.id); }}>
                      <Ionicons name="add" size={16} color={Colors.black} />
                      <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qtyRow}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={(e) => { e.stopPropagation?.(); removeFromCart(item.id); }}>
                        <Ionicons name="remove" size={16} color={Colors.black} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{qty}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={(e) => { e.stopPropagation?.(); addToCart(item.id); }}>
                        <Ionicons name="add" size={16} color={Colors.black} />
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

const modal = StyleSheet.create({
  backdrop:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 },
  closeBtn:   { position: 'absolute', top: 16, right: 16, zIndex: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  imageBox:   { height: 180, backgroundColor: Colors.lightGrey, borderTopLeftRadius: 24, borderTopRightRadius: 24, alignItems: 'center', justifyContent: 'center' },
  body:       { padding: 24 },
  name:       { fontSize: 22, fontWeight: '800', color: Colors.black, marginBottom: 10 },
  catRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  catBadge:   { backgroundColor: '#FFF0F3', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  catText:    { fontSize: 12, fontWeight: '600', color: Colors.pink },
  price:      { fontSize: 22, fontWeight: '800', color: Colors.pink },
  desc:       { fontSize: 14, color: Colors.grey, lineHeight: 22, marginBottom: 24 },
  footer:     {},
  addBtn:     { backgroundColor: Colors.yellow, borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addBtnText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  qtyRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, backgroundColor: Colors.lightGrey, borderRadius: 14, padding: 14 },
  qtyBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  qtyText:    { fontSize: 18, fontWeight: '800', color: Colors.black },
});

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.white },
  header:        { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title:         { fontSize: 28, fontWeight: '800', color: Colors.black },
  subtitle:      { fontSize: 13, color: Colors.grey, marginTop: 2 },
  searchWrap:    { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.lightGrey, borderRadius: 12, paddingHorizontal: 12 },
  searchIcon:    { marginRight: 8 },
  search:        { flex: 1, paddingVertical: 12, fontSize: 15, color: Colors.black },
  cats:          { flexGrow: 0, marginBottom: 4 },
  catBtn:        { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.lightGrey, marginRight: 8 },
  catBtnActive:  { backgroundColor: Colors.pink },
  catText:       { fontSize: 13, fontWeight: '600', color: Colors.grey },
  catTextActive: { color: Colors.white },
  list:          { flex: 1 },
  card:          { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 14, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  cardIcon:      { width: 90, backgroundColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  cardInfo:      { flex: 1, padding: 14 },
  itemName:      { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  itemDesc:      { fontSize: 12, color: Colors.grey, lineHeight: 18, marginBottom: 10 },
  cardBottom:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:         { fontSize: 16, fontWeight: '800', color: Colors.pink },
  addBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.yellow, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnText:    { fontSize: 13, fontWeight: '700', color: Colors.black },
  qtyRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.lightGrey, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  qtyBtn:        { padding: 2 },
  qtyText:       { fontSize: 15, fontWeight: '800', color: Colors.black, minWidth: 20, textAlign: 'center' },
});
