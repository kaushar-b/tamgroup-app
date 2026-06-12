import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image, Dimensions, FlatList, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

const { width: SW } = Dimensions.get('window');
const SQ = SW - 40;
const HERO_BG = ['#FBA4AD', '#f0b8be', '#FBA4AD'];

const HERO_IMAGES = [
  require('../../assets/images/Pink Slide.jpeg'),
  require('../../assets/images/Yellow Slide.jpeg'),
  require('../../assets/images/Red Slide.jpeg'),
];

const FOOD_IMAGES: Record<string, any> = {
  '1': require('../../assets/images/products/Beef Bourguignon2.jpeg'),
  '2': require('../../assets/images/products/Seafood Stew1.jpeg'),
  '3': require('../../assets/images/products/Tomato & Basil Bruschetta1.jpeg'),
};

const FOOD_SLIDES = [
  { id: '1', label: 'Beef Bourguignon — France' },
  { id: '2', label: 'Seafood Stew — Spain' },
  { id: '3', label: 'Tomato & Basil Bruschetta — Italy' },
];

export default function Home() {
  const router = useRouter();
  const [heroSlide, setHeroSlide] = useState(0);
  const [foodSlide, setFoodSlide] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const heroRef = useRef<FlatList>(null);
  const foodRef = useRef<FlatList>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setHeroSlide(prev => {
        const next = (prev + 1) % HERO_BG.length;
        try { heroRef.current?.scrollToIndex({ index: next, animated: true }); } catch {}
        return next;
      });
    }, 4300);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setFoodSlide(prev => {
        const next = (prev + 1) % FOOD_SLIDES.length;
        try { foodRef.current?.scrollToIndex({ index: next, animated: true }); } catch {}
        return next;
      });
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F3C3C5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandText}>TAM Restaurant Group</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.menuBtn} onPress={() => setShowDropdown(true)}>
          <Ionicons name="ellipsis-vertical" size={22} color="#1a1612" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero Slideshow */}
        <View style={styles.heroWrap}>
          <FlatList
            ref={heroRef}
            data={HERO_BG}
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            keyExtractor={(_, i) => String(i)}
            style={StyleSheet.absoluteFill}
            renderItem={({ item, index }) => (
              <View style={[styles.heroSlide, { backgroundColor: item }]}>
                <Image source={HERO_IMAGES[index]} style={{ ...StyleSheet.absoluteFillObject }} resizeMode="cover" />
              </View>
            )}
          />
          <View style={styles.heroTextOverlay} pointerEvents="box-none">
            <Text style={styles.heroTitle}>Fresh & Delicious</Text>
            <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/tabs/menu')}>
              <Text style={styles.heroBtnText}>Order Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dots}>
            {HERO_BG.map((_, i) => <View key={i} style={[styles.dot, i === heroSlide && styles.dotActive]} />)}
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/menu')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="restaurant" size={30} color="#CE6F79" />
            <Text style={styles.actionLabel}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/cart')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="cart" size={30} color="#CE6F79" />
            <Text style={styles.actionLabel}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/orders')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="receipt" size={30} color="#CE6F79" />
            <Text style={styles.actionLabel}>Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Food Slideshow */}
        <Text style={styles.sectionTitle}>Dishes from Around the World</Text>
        <View style={styles.foodSlideWrap}>
          <FlatList
            ref={foodRef}
            data={FOOD_SLIDES}
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.foodSlide} onPress={() => router.push('/tabs/menu')} activeOpacity={0.85}>
                <Image source={FOOD_IMAGES[item.id]} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <View style={styles.foodLabelWrap}>
                  <Text style={styles.foodLabel}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={styles.foodDots}>
            {FOOD_SLIDES.map((_, i) => <View key={i} style={[styles.foodDot, i === foodSlide && styles.foodDotActive]} />)}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color="#CE6F79" />
            <Text style={styles.infoTitle}>Find Us</Text>
          </View>
          <Text style={styles.infoText}>Mowana Park Mall | Phakalane, Botswana</Text>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Ionicons name="time" size={18} color="#CE6F79" />
            <Text style={styles.infoTitle}>Hours</Text>
          </View>
          <Text style={styles.infoText}>Mon – Sun: 7:00 AM – 10:00 PM</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Dropdown Menu Modal */}
      <Modal visible={showDropdown} transparent animationType="fade" onRequestClose={() => setShowDropdown(false)}>
        <TouchableOpacity style={styles.dropdownBackdrop} activeOpacity={1} onPress={() => setShowDropdown(false)} />
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.dropdownRow} onPress={() => { setShowDropdown(false); router.push('/about'); }}>
            <Ionicons name="information-circle-outline" size={18} color="#CE6F79" />
            <Text style={styles.dropdownText}>About Us</Text>
          </TouchableOpacity>

        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header:          { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingTop: 44, paddingBottom: 6, paddingLeft: 20, paddingRight: 14, elevation: 2, shadowColor: '#CE6F79', shadowOpacity: 0.08, shadowRadius: 4 },
  logo:            { width: 160, height: 62, marginLeft: 0 },
  brandText:       { fontSize: 20, fontWeight: '800', color: '#AD946B', letterSpacing: 0.2 },
  menuBtn:         { padding: 8 },
  content:         { paddingBottom: 20 },
  heroWrap:        { marginHorizontal: 20, marginTop: 14, borderRadius: 18, overflow: 'hidden', marginBottom: 18, height: 200 },
  heroSlide:       { width: SQ, height: 200 },
  heroTextOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, justifyContent: 'flex-end', padding: 20, backgroundColor: 'rgba(0,0,0,0.25)' },
  heroTitle:       { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 14, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroBtn:         { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-start' },
  heroBtnText:     { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  dots:            { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  dot:             { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive:       { width: 18, backgroundColor: '#fff' },
  sectionTitle:    { fontSize: 17, fontWeight: '700', color: '#1a1612', marginBottom: 12, paddingHorizontal: 20 },
  actions:         { flexDirection: 'row', gap: 10, marginBottom: 18, paddingHorizontal: 20 },
  actionCard:      { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 18, alignItems: 'center', gap: 8, elevation: 1, shadowColor: '#CE6F79', shadowOpacity: 0.1, shadowRadius: 4 },
  actionLabel:     { fontSize: 13, fontWeight: '600', color: '#1a1612' },
  foodSlideWrap:   { marginHorizontal: 20, marginBottom: 8, height: SQ, borderRadius: 16, overflow: 'hidden' },
  foodSlide:       { width: SQ, height: SQ },
  foodLabelWrap:   { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 14, paddingVertical: 12 },
  foodLabel:       { fontSize: 16, fontWeight: '700', color: '#fff' },
  foodDots:        { position: 'absolute', bottom: 52, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  foodDot:         { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  foodDotActive:   { width: 16, backgroundColor: '#fff' },
  infoCard:        { backgroundColor: '#FADAD9', borderRadius: 16, padding: 18, marginHorizontal: 20, marginTop: 10 },
  infoRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoTitle:       { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  infoText:        { fontSize: 13, color: '#6b6b6b', marginLeft: 24 },
  infoDivider:     { height: 1, backgroundColor: '#F3C3C5', marginVertical: 12 },
  dropdownBackdrop:{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  dropdownMenu:    { position: 'absolute', top: 100, right: 14, backgroundColor: '#fff', borderRadius: 14, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 8, minWidth: 160, overflow: 'hidden' },
  dropdownRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  dropdownText:    { fontSize: 15, fontWeight: '600', color: '#1a1612' },
  dropdownDivider: { height: 1, backgroundColor: '#F3C3C5', marginHorizontal: 16 },
});
