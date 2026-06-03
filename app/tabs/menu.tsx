import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../constants/Colors';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Sides', 'Drinks', 'Desserts'];

const MENU_ITEMS = [
  { id: '1', name: 'Grilled Chicken Burger', category: 'Mains', price: 85, emoji: '🍔', description: 'Juicy grilled chicken with fresh lettuce and house sauce' },
  { id: '2', name: 'Beef Burger', category: 'Mains', price: 90, emoji: '🍔', description: 'Classic beef patty with cheese and pickles' },
  { id: '3', name: 'Chicken Wings', category: 'Starters', price: 65, emoji: '🍗', description: '6 crispy wings with your choice of sauce' },
  { id: '4', name: 'Loaded Fries', category: 'Sides', price: 45, emoji: '🍟', description: 'Crispy fries topped with cheese and jalapeños' },
  { id: '5', name: 'Caesar Salad', category: 'Starters', price: 55, emoji: '🥗', description: 'Fresh romaine, croutons, parmesan and caesar dressing' },
  { id: '6', name: 'Grilled Steak', category: 'Mains', price: 160, emoji: '🥩', description: '200g sirloin steak cooked to your liking' },
  { id: '7', name: 'Coca Cola', category: 'Drinks', price: 20, emoji: '🥤', description: '330ml can' },
  { id: '8', name: 'Chocolate Cake', category: 'Desserts', price: 40, emoji: '🍰', description: 'Rich chocolate cake with cream' },
  { id: '9', name: 'Onion Rings', category: 'Sides', price: 35, emoji: '🧅', description: 'Golden crispy onion rings' },
  { id: '10', name: 'Fruit Juice', category: 'Drinks', price: 25, emoji: '🧃', description: 'Fresh orange or apple juice' },
];

export default function Menu() {
  const [selected, setSelected] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<string[]>([]);

  const filtered = MENU_ITEMS.filter(item => {
    const matchCat = selected === 'All' || item.category === selected;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (id: string) => setCart(prev => [...prev, id]);

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Our Menu</Text>
        <Text style={styles.subtitle}>Mowana Park Mall</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="🔍  Search menu..."
          placeholderTextColor={Colors.grey}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
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

      {/* Items */}
      <ScrollView style={styles.list} contentContainerStyle={{ padding: 20, paddingTop: 8 }}>
        {filtered.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardEmoji}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.price}>P {item.price}.00</Text>
                <TouchableOpacity
                  style={[styles.addBtn, cart.includes(item.id) && styles.addBtnDone]}
                  onPress={() => addToCart(item.id)}
                >
                  <Text style={styles.addBtnText}>{cart.includes(item.id) ? '✓ Added' : '+ Add'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.white },
  header:         { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: Colors.white },
  title:          { fontSize: 28, fontWeight: '800', color: Colors.black },
  subtitle:       { fontSize: 13, color: Colors.grey, marginTop: 2 },
  searchWrap:     { paddingHorizontal: 20, marginBottom: 12 },
  search:         { backgroundColor: Colors.lightGrey, borderRadius: 12, padding: 12, fontSize: 15, color: Colors.black },
  cats:           { flexGrow: 0, marginBottom: 4 },
  catBtn:         { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.lightGrey, marginRight: 8 },
  catBtnActive:   { backgroundColor: Colors.pink },
  catText:        { fontSize: 13, fontWeight: '600', color: Colors.grey },
  catTextActive:  { color: Colors.white },
  list:           { flex: 1 },
  card:           { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 14, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  cardEmoji:      { width: 90, backgroundColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  emoji:          { fontSize: 36 },
  cardInfo:       { flex: 1, padding: 14 },
  itemName:       { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  itemDesc:       { fontSize: 12, color: Colors.grey, lineHeight: 18, marginBottom: 10 },
  cardBottom:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price:          { fontSize: 16, fontWeight: '800', color: Colors.pink },
  addBtn:         { backgroundColor: Colors.yellow, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  addBtnDone:     { backgroundColor: Colors.lightGrey },
  addBtnText:     { fontSize: 13, fontWeight: '700', color: Colors.black },
});