import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useCart, MENU_ITEMS } from '../../context/CartContext';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Sides', 'Drinks', 'Desserts'];

export default function Menu() {
  const [selected, setSelected] = useState('All');
  const [search, setSearch] = useState('');
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
        <TextInput
          style={styles.search}
          placeholder="Search menu..."
          placeholderTextColor={Colors.grey}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cats} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catBtn, selected === cat && styles.catBtnActive]}
            onPress={() => setSelected(cat)}
          >
            <Text style={[styles.catText, selected === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: 20, paddingTop: 8 }}>
        {filtered.map(item => {
          const qty = getQty(item.id);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardIcon}>
                <Ionicons name={item.icon as any} size={32} color={Colors.pink} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.price}>P {item.price}.00</Text>
                  {qty === 0 ? (
                    <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item.id)}>
                      <Ionicons name="add" size={16} color={Colors.black} />
                      <Text style={styles.addBtnText}>Add</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qtyRow}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(item.id)}>
                        <Ionicons name="remove" size={16} color={Colors.black} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{qty}</Text>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item.id)}>
                        <Ionicons name="add" size={16} color={Colors.black} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.white },
  header:     { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title:      { fontSize: 28, fontWeight: '800', color: Colors.black },
  subtitle:   { fontSize: 13, color: Colors.grey, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.lightGrey, borderRadius: 12, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  search:     { flex: 1, paddingVertical: 12, fontSize: 15, color: Colors.black },
  cats:       { flexGrow: 0, marginBottom: 4 },
  catBtn:     { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.lightGrey, marginRight: 8 },
  catBtnActive: { backgroundColor: Colors.pink },
  catText:    { fontSize: 13, fontWeight: '600', color: Colors.grey },
  catTextActive: { color: Colors.white },
  list:       { flex: 1 },
  card:       { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 14, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  cardIcon:   { width: 90, backgroundColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  cardInfo:   { flex: 1, padding: 14 },
  itemName:   { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  itemDesc:   { fontSize: 12, color: Colors.grey, lineHeight: 18, marginBottom: 10 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:      { fontSize: 16, fontWeight: '800', color: Colors.pink },
  addBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.yellow, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  addBtnText: { fontSize: 13, fontWeight: '700', color: Colors.black },
  qtyRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.lightGrey, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  qtyBtn:     { padding: 2 },
  qtyText:    { fontSize: 15, fontWeight: '800', color: Colors.black, minWidth: 20, textAlign: 'center' },
});