import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Image, Dimensions, FlatList } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

const { width: SW } = Dimensions.get('window');

const HERO_SLIDES = [
  { id: '1', image: null },
  { id: '2', image: null },
  { id: '3', image: null },
];

const FOOD_SLIDES = [
  { id: '1', label: 'Grilled Chicken', image: null },
  { id: '2', label: 'Beef Burger', image: null },
  { id: '3', label: 'Loaded Fries', image: null },
  { id: '4', label: 'Arabic Food', image: null },
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
  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'there';

  useEffect(() => {
    const t = setInterval(() => {
      setHeroSlide(prev => {
        const next = (prev + 1) % HERO_SLIDES.length;
        heroRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4300);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setFoodSlide(prev => {
        const next = (prev + 1) % FOOD_SLIDES.length;
        foodRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/rectangle.png')} style={styles.logo} resizeMode="contain" />
          <View style={{ flex: 1 }} />
          <View style={styles.headerRight}>
            <Text style={styles.greeting}>Hello, {displayName}</Text>
            <TouchableOpacity style={styles.avatarCircle} onPress={() => setShowAccount(true)}>
              <Text style={styles.avatarText}>{initial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Slideshow */}
        <View style={styles.heroWrap}>
          <FlatList
            ref={heroRef}
            data={HERO_SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            keyExtractor={i => i.id}
            renderItem={() => (
              <View style={styles.heroSlide}>
                <View style={styles.heroImageBox}>
                  <Ionicons name="image-outline" size={48} color="#ccc" />
                  <Text style={styles.heroImagePlaceholder}>Add image later</Text>
                </View>
                <View style={styles.heroTextOverlay}>
                  <Text style={styles.heroTitle}>Fresh & Delicious</Text>
                  <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/tabs/menu')}>
                    <Text style={styles.heroBtnText}>Order Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.dots}>
            {HERO_SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === heroSlide && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/menu')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="restaurant" size={30} color={Colors.pink} />
            <Text style={styles.actionLabel}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/cart')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="cart" size={30} color={Colors.yellow} />
            <Text style={styles.actionLabel}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/orders')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="receipt" size={30} color={Colors.black} />
            <Text style={styles.actionLabel}>Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Food Category Slideshow */}
        <View style={styles.foodSlideWrap}>
          <FlatList
            ref={foodRef}
            data={FOOD_SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.foodSlide} onPress={() => router.push('/tabs/menu')} activeOpacity={0.85}>
                <View style={styles.foodImageBox}>
                  <Ionicons name="image-outline" size={40} color="#bbb" />
                </View>
                <View style={styles.foodLabelWrap}>
                  <Text style={styles.foodLabel}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color={Colors.red} />
            <Text style={styles.infoTitle}>Find Us</Text>
          </View>
          <Text style={styles.infoText}>Mowana Park Mall | Phakalane, Botswana</Text>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Ionicons name="time" size={18} color={Colors.yellow} />
            <Text style={styles.infoTitle}>Hours</Text>
          </View>
          <Text style={styles.infoText}>Mon – Sun: 8:00 AM – 10:00 PM</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Account Modal */}
      <Modal visible={showAccount} transparent animationType="slide" onRequestClose={() => setShowAccount(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowAccount(false)} />
        <View style={styles.accountSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.accountHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{initial}</Text>
            </View>
            <Text style={styles.accountEmail}>{user?.emailAddresses?.[0]?.emailAddress}</Text>
          </View>
          <View style={styles.accountDivider} />
          <TouchableOpacity style={styles.accountRow}>
            <Ionicons name="key-outline" size={20} color={Colors.grey} />
            <Text style={styles.accountRowText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.border} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.accountRow, styles.signOutRow]} onPress={() => { setShowAccount(false); signOut(); }}>
            <Ionicons name="log-out-outline" size={20} color={Colors.red} />
            <Text style={[styles.accountRowText, { color: Colors.red }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: Colors.white },
  content:           { paddingTop: 52, paddingBottom: 20 },
  header:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 18 },
  logo:              { width: 120, height: 44 },
  headerRight:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  greeting:          { fontSize: 14, fontWeight: '600', color: Colors.black },
  avatarCircle:      { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.pink, alignItems: 'center', justifyContent: 'center' },
  avatarText:        { fontSize: 16, fontWeight: '800', color: Colors.white },
  heroWrap:          { marginHorizontal: 20, borderRadius: 18, overflow: 'hidden', marginBottom: 24, height: 200 },
  heroSlide:         { width: SW - 40, height: 200 },
  heroImageBox:      { ...StyleSheet.absoluteFillObject, backgroundColor: '#e8e8e8', alignItems: 'center', justifyContent: 'center' },
  heroImagePlaceholder: { fontSize: 12, color: '#aaa', marginTop: 6 },
  heroTextOverlay:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'flex-end', padding: 20 },
  heroTitle:         { fontSize: 26, fontWeight: '800', color: Colors.white, marginBottom: 12, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroBtn:           { backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-start' },
  heroBtnText:       { fontSize: 14, fontWeight: '700', color: Colors.black },
  dots:              { position: 'absolute', bottom: 10, flexDirection: 'row', alignSelf: 'center', gap: 5, left: 0, right: 0, justifyContent: 'center' },
  dot:               { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive:         { width: 18, backgroundColor: Colors.white },
  sectionTitle:      { fontSize: 17, fontWeight: '700', color: Colors.black, marginBottom: 14, paddingHorizontal: 20 },
  actions:           { flexDirection: 'row', gap: 10, marginBottom: 24, paddingHorizontal: 20 },
  actionCard:        { flex: 1, backgroundColor: Colors.lightGrey, borderRadius: 14, paddingVertical: 18, alignItems: 'center', gap: 8 },
  actionLabel:       { fontSize: 13, fontWeight: '600', color: Colors.black },
  foodSlideWrap:     { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', marginBottom: 24, height: 160 },
  foodSlide:         { width: SW - 40, height: 160 },
  foodImageBox:      { ...StyleSheet.absoluteFillObject, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  foodLabelWrap:     { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 14, paddingVertical: 10 },
  foodLabel:         { fontSize: 15, fontWeight: '700', color: Colors.white },
  infoCard:          { backgroundColor: Colors.lightGrey, borderRadius: 16, padding: 18, marginHorizontal: 20 },
  infoRow:           { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoTitle:         { fontSize: 14, fontWeight: '700', color: Colors.black },
  infoText:          { fontSize: 13, color: Colors.grey, marginLeft: 24 },
  infoDivider:       { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  modalBackdrop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  accountSheet:      { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 44 },
  sheetHandle:       { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  accountHeader:     { alignItems: 'center', marginBottom: 20 },
  avatarLarge:       { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.pink, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarLargeText:   { fontSize: 32, fontWeight: '800', color: Colors.white },
  accountEmail:      { fontSize: 14, color: Colors.grey },
  accountDivider:    { height: 1, backgroundColor: Colors.border, marginBottom: 8 },
  accountRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  accountRowText:    { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.black },
  signOutRow:        { borderBottomWidth: 0 },
});
