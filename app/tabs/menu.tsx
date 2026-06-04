import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
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
          <TouchableOpacity style={modal.closeBtn} onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
            {qty === 0 ? (
              <TouchableOpacity style={modal.addBtn} onPress={() => addToCart(item.id)}>
                <Ionicons name="cart" size={18} color={Colors.black} />
                <Text style={modal.addBtnText}>Add to Cart — P {item.price}.00</Text>
              </TouchableOpacity>
            ) : (
              <View style={modal.qtyRow}>
                <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFromCart(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="remove" size={20} color={Colors.black} />
                </TouchableOpacity>
                <Text style={modal.qtyText}>{qty} in cart</Text>
                <TouchableOpacity style={modal.qtyBtn} onPress={() => addToCart(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="add" size={20} color={Colors.black} />
                </TouchableOpacity>
              </View>
            )}
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
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const filtered = MENU_ITEMS.filter(item => {
    const matchCat = selected === 'All' || item.category === selected;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getQty = (id: string) => items.find(i => i.id === id)?.quantity ?? 0;

  const selectCategory = (cat: string) => {
    setSelected(cat);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/tabs')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="home-outline" size={22} color={Colors.black} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>Our Menu</Text>
          <Text style={styles.subtitle}>TAMGROUP RESTAURANT</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={Colors.grey} style={styles.searchIcon} />
        <TextInput style={styles.search} placeholder="Search menu..." placeholderTextColor={Colors.grey} value={search} onChangeText={setSearch} />
      </View>

      {/* Categories — swipeable horizontal scroll */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cats} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} style={[styles.catBtn, selected === cat && styles.catBtnActive]} onPress={() => selectCategory(cat)} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
            <Text style={[styles.catText, selected === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        renderItem={({ item }) => {
          const qty = getQty(item.id);
          return (
            <TouchableOpacity style={styles.card} onPress={() => setActiveItem(item)} activeOpacity={0.75}>
              <View style={styles.cardIcon}>
                <Ionicons name={item.icon as any} size={32} color={Colors.pink} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.price}>P {item.price}.00</Text>
                  {qty === 0 ? (
                    <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                      <Ionicons name="add" size={16} color={Colors.black} />
                      <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qtyRow}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                        <Ionicons name="remove" size={16} color={Colors.black} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{qty}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                        <Ionicons name="add" size={16} color={Colors.black} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={<View style={{ height: 16 }} />}
      />

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
  addBtn:     { backgroundColor: Colors.yellow, borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addBtnText: { fontSize: 16, fontWeight: '700', color: Colors.black },
  qtyRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, backgroundColor: Colors.lightGrey, borderRadius: 14, padding: 14 },
  qtyBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  qtyText:    { fontSize: 18, fontWeight: '800', color: Colors.black },
});

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.white },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14 },
  title:         { fontSize: 24, fontWeight: '800', color: Colors.black },
  subtitle:      { fontSize: 12, color: Colors.grey, marginTop: 1 },
  searchWrap:    { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.lightGrey, borderRadius: 12, paddingHorizontal: 12 },
  searchIcon:    { marginRight: 8 },
  search:        { flex: 1, paddingVertical: 12, fontSize: 15, color: Colors.black },
  cats:          { flexGrow: 0, marginBottom: 8 },
  catBtn:        { paddingHorizontal: 22, paddingVertical: 12, borderRadius: 24, backgroundColor: Colors.lightGrey },
  catBtnActive:  { backgroundColor: Colors.pink },
  catText:       { fontSize: 15, fontWeight: '700', color: Colors.grey },
  catTextActive: { color: Colors.white },
  card:          { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 14, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  cardIcon:      { width: 90, backgroundColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  cardInfo:      { flex: 1, padding: 14 },
  itemName:      { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  itemDesc:      { fontSize: 12, color: Colors.grey, lineHeight: 18, marginBottom: 10 },
  cardBottom:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:         { fontSize: 16, fontWeight: '800', color: Colors.pink },
  addBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.yellow, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  addBtnText:    { fontSize: 13, fontWeight: '700', color: Colors.black },
  qtyRow:        { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.lightGrey, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6 },
  qtyBtn:        { padding: 3 },
  qtyText:       { fontSize: 15, fontWeight: '800', color: Colors.black, minWidth: 20, textAlign: 'center' },
});
