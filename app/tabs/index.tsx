import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image, Dimensions, FlatList, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

const { width: SW } = Dimensions.get('window');
const SQ = SW - 40;
const HERO_BG = ['#FBA4AD', '#f0b8be', '#FBA4AD'];
const FOOD_SLIDES = [
  { id: '1', label: 'Grilled Chicken' },
  { id: '2', label: 'Beef Burger' },
  { id: '3', label: 'Loaded Fries' },
  { id: '4', label: 'Arabic Food' },
];

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [heroSlide, setHeroSlide] = useState(0);
  const [foodSlide, setFoodSlide] = useState(0);
  const [showAccount, setShowAccount] = useState(false);
  const heroRef = useRef<FlatList>(null);
  const foodRef = useRef<FlatList>(null);
  const initial = (user?.emailAddresses?.[0]?.emailAddress?.[0] || 'U').toUpperCase();

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
      <ScrollView contentContainerStyle={styles.content} stickyHeaderIndices={[0]}>

        {/* Header — white, extends to very top */}
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.avatarCircle} onPress={() => setShowAccount(true)}>
            <Text style={styles.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <FlatList
            ref={heroRef}
            data={HERO_BG}
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            keyExtractor={(_, i) => String(i)}
            style={StyleSheet.absoluteFill}
            renderItem={({ item }) => <View style={[styles.heroSlide, { backgroundColor: item }]} />}
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

        {/* Food Slideshow — square, auto */}
        <View style={styles.foodSlideWrap}>
          <FlatList
            ref={foodRef}
            data={FOOD_SLIDES}
            horizontal pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.foodSlide} onPress={() => router.push('/tabs/menu')} activeOpacity={0.85}>
                <View style={styles.foodImageBox}>
                  <Ionicons name="image-outline" size={40} color="#CE6F79" />
                </View>
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
          <Text style={styles.infoText}>Mon – Sun: 8:00 AM – 10:00 PM</Text>
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      <Modal visible={showAccount} transparent animationType="slide" onRequestClose={() => setShowAccount(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowAccount(false)} />
        <View style={styles.accountSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.accountHeader}>
            <View style={styles.avatarLarge}><Text style={styles.avatarLargeText}>{initial}</Text></View>
            <Text style={styles.accountEmail}>{user?.emailAddresses?.[0]?.emailAddress}</Text>
          </View>
          <View style={styles.accountDivider} />
          <TouchableOpacity style={styles.accountRow}>
            <Ionicons name="key-outline" size={20} color="#6b6b6b" />
            <Text style={styles.accountRowText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={16} color="#efefef" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.accountRow, { borderBottomWidth: 0 }]} onPress={() => { setShowAccount(false); signOut(); }}>
            <Ionicons name="log-out-outline" size={20} color="#D10000" />
            <Text style={[styles.accountRowText, { color: '#D10000' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content:         { paddingBottom: 20 },
  header:          { flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 0, paddingRight: 20, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  logo:            { width: 180, height: 64 },
  avatarCircle:    { width: 42, height: 42, borderRadius: 21, backgroundColor: '#CE6F79', alignItems: 'center', justifyContent: 'center' },
  avatarText:      { fontSize: 18, fontWeight: '800', color: '#fff' },
  heroWrap:        { marginHorizontal: 20, marginTop: 16, borderRadius: 18, overflow: 'hidden', marginBottom: 20, height: 200 },
  heroSlide:       { width: SQ, height: 200 },
  heroTextOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, justifyContent: 'flex-end', padding: 20, backgroundColor: 'rgba(0,0,0,0.15)' },
  heroTitle:       { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 14, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroBtn:         { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-start' },
  heroBtnText:     { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  dots:            { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  dot:             { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive:       { width: 18, backgroundColor: '#fff' },
  sectionTitle:    { fontSize: 17, fontWeight: '700', color: '#1a1612', marginBottom: 12, paddingHorizontal: 20 },
  actions:         { flexDirection: 'row', gap: 10, marginBottom: 20, paddingHorizontal: 20 },
  actionCard:      { flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingVertical: 18, alignItems: 'center', gap: 8, elevation: 1, shadowColor: '#CE6F79', shadowOpacity: 0.1, shadowRadius: 4 },
  actionLabel:     { fontSize: 13, fontWeight: '600', color: '#1a1612' },
  foodSlideWrap:   { marginHorizontal: 20, marginBottom: 8, height: SQ, borderRadius: 16, overflow: 'hidden' },
  foodSlide:       { width: SQ, height: SQ },
  foodImageBox:    { ...StyleSheet.absoluteFillObject, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center' },
  foodLabelWrap:   { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 14, paddingVertical: 12 },
  foodLabel:       { fontSize: 16, fontWeight: '700', color: '#fff' },
  foodDots:        { position: 'absolute', bottom: 52, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  foodDot:         { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  foodDotActive:   { width: 16, backgroundColor: '#fff' },
  infoCard:        { backgroundColor: '#FADAD9', borderRadius: 16, padding: 18, marginHorizontal: 20, marginTop: 12 },
  infoRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoTitle:       { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  infoText:        { fontSize: 13, color: '#6b6b6b', marginLeft: 24 },
  infoDivider:     { height: 1, backgroundColor: '#F3C3C5', marginVertical: 12 },
  modalBackdrop:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  accountSheet:    { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 44 },
  sheetHandle:     { width: 40, height: 4, backgroundColor: '#F3C3C5', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  accountHeader:   { alignItems: 'center', marginBottom: 20 },
  avatarLarge:     { width: 72, height: 72, borderRadius: 36, backgroundColor: '#CE6F79', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarLargeText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  accountEmail:    { fontSize: 14, color: '#6b6b6b' },
  accountDivider:  { height: 1, backgroundColor: '#F3C3C5', marginBottom: 8 },
  accountRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3C3C5' },
  accountRowText:  { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1612' },
});
