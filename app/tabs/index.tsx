import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, FlatList, StatusBar, useState as _u } from 'react-native';
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

// Manually set your 3 images + names here
const DISHES_FROM_WORLD = [
  { id: '1', name: 'Beef Bourguignon - France', image: require('../../assets/images/products/Beef Bourguignon2.jpeg') },
  { id: '2', name: 'Seafood Stew - Spain', image: require('../../assets/images/products/Seafood Stew1.jpeg') },
  { id: '3', name: 'Tomato & Basil Bruschetta - Italy', image: require('../../assets/images/products/Tomato & Basil Bruschetta2.jpeg') },
];

const ITEM_SIZE = Math.round(SW / 3);

export default function Home() {
  const router = useRouter();
  const { count } = useCart();
  const flatRef = useRef<FlatList>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [worldIdx, setWorldIdx] = useState(0);

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

  useEffect(() => {
    const t = setInterval(() => {
      setWorldIdx(prev => (prev + 1) % DISHES_FROM_WORLD.length);
    }, 4000);
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

        <View style={{ height: 8 }} />
        <View style={styles.divider} />

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

        <View style={styles.divider} />

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionImgBtn} onPress={() => router.push('/tabs/menu')}>
            <Image source={require('../../assets/images/buttons/menu btn.png')} style={styles.actionImg} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionImgBtn} onPress={() => router.push('/about')}>
            <Image source={require('../../assets/images/buttons/about btn.png')} style={styles.actionImg} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* Dishes from around the world - single rotating square image */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Dishes from Around the World</Text>
          <TouchableOpacity style={styles.worldWrap} onPress={() => router.push('/tabs/menu')} activeOpacity={0.9}>
            <Image source={DISHES_FROM_WORLD[worldIdx].image} style={styles.worldImg} resizeMode="cover" />
            <Text style={styles.worldLabel}>{DISHES_FROM_WORLD[worldIdx].name}</Text>
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

        <View style={{ height: 20 }} />

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
  header:        { flexDirection: 'row', alignItems: 'center', backgroundColor: YELLOW, paddingTop: 44, paddingBottom: 2, paddingHorizontal: 16 },
  cartCircle:    { width: 42, height: 42, borderRadius: 21, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  cartBadge:     { position: 'absolute', top: -4, right: -4, backgroundColor: '#fff', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  cartBadgeText: { color: RED, fontSize: 10, fontWeight: '800' },
  heroWrap:      { width: SW, height: SW * 0.72, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingTop: 0 },
  heroImg:       { width: '100%', height: '100%' },
  divider:       { height: 1, backgroundColor: '#1a1612', marginHorizontal: 16 },
  carouselWrap:  { marginTop: 2, marginBottom: 6, paddingTop: 2 },
  carouselItem:  { width: ITEM_SIZE, height: ITEM_SIZE, marginRight: 8, borderRadius: 12, overflow: 'hidden' },
  carouselImg:   { width: '100%', height: '100%' },
  actionsRow:    { flexDirection: 'row', gap: 14, marginHorizontal: 16, marginTop: 14, marginBottom: 20 },
  actionBtn:     { flex: 1, backgroundColor: RED, borderRadius: 50, paddingVertical: 18, alignItems: 'center', gap: 8, elevation: 2 },
  actionLabel:   { fontSize: 19, fontWeight: '800', color: '#fff' },
  actionImgBtn:  { flex: 1 },
  actionImg:     { width: '100%', height: undefined, aspectRatio: 1024 / 512, borderRadius: 16 },
  sectionWrap:   { marginBottom: 20 },
  sectionTitle:  { fontSize: 18, fontWeight: '800', color: '#1a1612', marginBottom: 12, paddingHorizontal: 16 },
  worldWrap:     { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff', elevation: 2 },
  worldImg:      { width: '100%', height: SW - 32, aspectRatio: 1 },
  worldLabel:    { fontSize: 14, fontWeight: '700', color: '#1a1612', padding: 12, textAlign: 'center' },
  infoCard:      { backgroundColor: YELLOW_LIGHT, borderRadius: 16, padding: 18, marginHorizontal: 16, marginBottom: 20 },
  infoRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoTitle:     { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  infoText:      { fontSize: 13, color: '#6b6b6b', marginLeft: 24 },
  infoDivider:   { height: 1, backgroundColor: YELLOW, marginVertical: 12 },
  footer:        { backgroundColor: '#fff', alignItems: 'center', flexDirection: 'row', gap: 10, paddingTop: 24, paddingBottom: 32, width: '100%', justifyContent: 'center' },
  footerLogo:    { width: 44, height: 28 },
  footerText:    { fontSize: 11, color: '#1a1612', fontWeight: '600', opacity: 0.6 },
});
