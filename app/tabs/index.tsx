import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, FlatList, StatusBar, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext';

const { width: SW } = Dimensions.get('window');
const RED = '#b60015';
const YELLOW = '#FFD544';
const YELLOW_LIGHT = '#FFF394';

const CAROUSEL_IMAGES = [
  require('../../assets/images/products/Seafood Paella1.jpeg'),
  require('../../assets/images/products/Coq au Vin1.jpeg'),
  require('../../assets/images/products/Beef Bourguignon1.jpeg'),
  require('../../assets/images/products/Lamb Chops1.jpeg'),
  require('../../assets/images/products/Garlic Butter Shrimp1.jpeg'),
  require('../../assets/images/products/Tomato & Basil Bruschetta1.jpeg'),
];

const DISHES_FROM_WORLD = [
  { id: '1', name: 'Barcelona, Spain', image: require('../../assets/images/Barcelona, Spain.jpeg') },
  { id: '2', name: 'Lisbon, Portugal', image: require('../../assets/images/Lisbon, Portugal.jpeg') },
  { id: '3', name: 'Marseille, France', image: require('../../assets/images/Marseille, France.jpeg') },
];

const ITEM_SIZE = Math.round(SW / 3);

export default function Home() {
  const router = useRouter();
  const { count } = useCart();
  const flatRef = useRef<FlatList>(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  const LOOPED = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];
  const START = CAROUSEL_IMAGES.length;

  useEffect(() => {
    try { flatRef.current?.scrollToIndex({ index: START, animated: false }); } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentIdx(prev => {
        const next = prev + 1;
        try { flatRef.current?.scrollToIndex({ index: START + (next % CAROUSEL_IMAGES.length), animated: true }); } catch {}
        return next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: YELLOW }}>
      <StatusBar barStyle="dark-content" backgroundColor={YELLOW} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.cartCircle} onPress={() => router.push('/tabs/cart')}>
          <Ionicons name="cart" size={22} color={YELLOW} />
          {count > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{count > 9 ? '9+' : count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 0 }}>

        {/* Hero image */}
        <View style={styles.heroWrap}>
          <Image source={require('../../assets/casadelsol.logo.png')} style={styles.heroImg} resizeMode="contain" />
        </View>

        {/* Carousel */}
        <View style={styles.carouselWrap}>
          <FlatList
            ref={flatRef}
            data={LOOPED}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            getItemLayout={(_, i) => ({ length: ITEM_SIZE + 8, offset: (ITEM_SIZE + 8) * i, index: i })}
            onScrollToIndexFailed={() => {}}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image source={item} style={styles.carouselImg} resizeMode="cover" />
              </View>
            )}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/tabs/menu')}>
            <Ionicons name="restaurant" size={26} color={YELLOW} />
            <Text style={styles.actionLabel}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/about')}>
            <Ionicons name="information-circle" size={26} color={YELLOW} />
            <Text style={styles.actionLabel}>About Us</Text>
          </TouchableOpacity>
        </View>

        {/* Dishes from around the world */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Dishes from around the world</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingBottom: 4 }}>
            {DISHES_FROM_WORLD.map(dish => (
              <View key={dish.id} style={styles.worldCard}>
                <Image source={dish.image} style={styles.worldImg} resizeMode="cover" />
                <Text style={styles.worldLabel}>{dish.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Find Us & Hours */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color={RED} />
            <Text style={styles.infoTitle}>Find Us</Text>
          </View>
          <Text style={styles.infoText}>Mowana Park Mall | Phakalane, Botswana</Text>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Ionicons name="time" size={18} color={RED} />
            <Text style={styles.infoTitle}>Hours</Text>
          </View>
          <Text style={styles.infoText}>Mon – Sun: 7:00 AM – 10:00 PM</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Image source={require('../../assets/logo.png')} style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerText}>TAM Group Company</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:        { flexDirection: 'row', alignItems: 'center', backgroundColor: YELLOW, paddingTop: 44, paddingBottom: 10, paddingHorizontal: 16 },
  cartCircle:    { width: 42, height: 42, borderRadius: 21, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  cartBadge:     { position: 'absolute', top: -4, right: -4, backgroundColor: '#fff', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  cartBadgeText: { color: RED, fontSize: 10, fontWeight: '800' },
  heroWrap:      { width: SW, height: SW * 0.6, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  heroImg:       { width: '85%', height: '85%' },
  carouselWrap:  { marginTop: 8, marginBottom: 14 },
  carouselItem:  { width: ITEM_SIZE, height: ITEM_SIZE, marginRight: 8, borderRadius: 12, overflow: 'hidden' },
  carouselImg:   { width: '100%', height: '100%' },
  actionsRow:    { flexDirection: 'row', gap: 14, marginHorizontal: 16, marginBottom: 20 },
  actionBtn:     { flex: 1, backgroundColor: RED, borderRadius: 50, paddingVertical: 18, alignItems: 'center', gap: 8, elevation: 2 },
  actionLabel:   { fontSize: 17, fontWeight: '800', color: '#fff' },
  sectionWrap:   { marginBottom: 20 },
  sectionTitle:  { fontSize: 16, fontWeight: '800', color: '#1a1612', marginBottom: 12, paddingHorizontal: 16 },
  worldCard:     { width: 160, borderRadius: 14, overflow: 'hidden', backgroundColor: '#fff', elevation: 2 },
  worldImg:      { width: 160, height: 110 },
  worldLabel:    { fontSize: 12, fontWeight: '700', color: '#1a1612', padding: 8 },
  infoCard:      { backgroundColor: YELLOW_LIGHT, borderRadius: 16, padding: 18, marginHorizontal: 16, marginBottom: 20 },
  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoTitle:     { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  infoText:      { fontSize: 13, color: '#6b6b6b', marginLeft: 24 },
  infoDivider:   { height: 1, backgroundColor: YELLOW, marginVertical: 12 },
  footer:        { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 20, marginTop: 10 },
  footerLogo:    { width: 60, height: 34, marginBottom: 4 },
  footerText:    { fontSize: 11, color: '#1a1612', fontWeight: '600', opacity: 0.5 },
});
