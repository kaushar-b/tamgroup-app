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
];

const ITEM_SIZE = Math.round(SW / 3);

function FooterLogo() {
  return (
    <View style={footer.wrap}>
      <Image source={require('../../assets/logo.png')} style={footer.logo} resizeMode="contain" />
      <Text style={footer.text}>TAM Group Company</Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const { count } = useCart();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatRef = useRef<FlatList>(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Infinite carousel — duplicate images
  const LOOPED = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];
  const START = CAROUSEL_IMAGES.length;

  useEffect(() => {
    flatRef.current?.scrollToIndex({ index: START, animated: false });
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.cartCircle} onPress={() => router.push('/tabs/cart')}>
          <Ionicons name="cart" size={22} color="#1a1612" />
          {count > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{count > 9 ? '9+' : count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

        {/* Full screen hero image */}
        <View style={styles.heroWrap}>
          <Image source={require('../../assets/logo.png')} style={styles.heroImg} resizeMode="cover" />
        </View>

        {/* Slow auto-sliding carousel */}
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
            <Ionicons name="restaurant" size={26} color={RED} />
            <Text style={styles.actionLabel}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/about')}>
            <Ionicons name="information-circle" size={26} color={RED} />
            <Text style={styles.actionLabel}>About Us</Text>
          </TouchableOpacity>
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

        <FooterLogo />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingTop: 44, paddingBottom: 10, paddingHorizontal: 16, elevation: 2 },
  cartCircle:    { width: 42, height: 42, borderRadius: 21, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center' },
  cartBadge:     { position: 'absolute', top: -4, right: -4, backgroundColor: RED, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  heroWrap:      { width: SW, height: SW, backgroundColor: '#fff' },
  heroImg:       { width: '100%', height: '100%' },
  carouselWrap:  { marginTop: 14, marginBottom: 14 },
  carouselItem:  { width: ITEM_SIZE, height: ITEM_SIZE, marginRight: 8, borderRadius: 12, overflow: 'hidden' },
  carouselImg:   { width: '100%', height: '100%' },
  actionsRow:    { flexDirection: 'row', gap: 14, marginHorizontal: 16, marginBottom: 16 },
  actionBtn:     { flex: 1, backgroundColor: '#fff', borderRadius: 50, paddingVertical: 18, alignItems: 'center', gap: 8, elevation: 2 },
  actionLabel:   { fontSize: 15, fontWeight: '700', color: '#1a1612' },
  infoCard:      { backgroundColor: YELLOW_LIGHT, borderRadius: 16, padding: 18, marginHorizontal: 16, marginBottom: 10 },
  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoTitle:     { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  infoText:      { fontSize: 13, color: '#6b6b6b', marginLeft: 24 },
  infoDivider:   { height: 1, backgroundColor: '#FFD544', marginVertical: 12 },
});

const footer = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 20, marginTop: 10 },
  logo: { width: 60, height: 34, marginBottom: 4 },
  text: { fontSize: 11, color: '#1a1612', fontWeight: '600', opacity: 0.5 },
});
