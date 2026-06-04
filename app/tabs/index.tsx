import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

const { width: SW } = Dimensions.get('window');

const SLIDES = [
  { bg: Colors.pink, icon: 'restaurant', title: 'Fresh & Delicious', sub: 'Handcrafted meals made daily' },
  { bg: '#A00003', icon: 'flame', title: 'Hot Specials', sub: 'Check out today\'s deals' },
  { bg: '#1a1612', icon: 'star', title: 'Premium Quality', sub: 'Only the finest ingredients' },
];

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [showAccount, setShowAccount] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const initial = (user?.emailAddresses?.[0]?.emailAddress?.[0] || user?.firstName?.[0] || 'U').toUpperCase();

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(prev => {
        const next = (prev + 1) % SLIDES.length;
        Animated.timing(slideAnim, { toValue: 0, duration: 0, useNativeDriver: true }).start();
        return next;
      });
    }, 2300);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greeting}>Hello, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'there'} 👋</Text>
            <Text style={styles.subGreeting}>What would you like today?</Text>
          </View>
          <TouchableOpacity style={styles.avatarCircle} onPress={() => setShowAccount(true)}>
            <Text style={styles.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>

        {/* Slideshow Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroBg, { backgroundColor: SLIDES[slide].bg }]}>
            <View style={styles.heroOverlay} />
            <Ionicons name={SLIDES[slide].icon as any} size={52} color="rgba(255,255,255,0.25)" style={styles.heroBgIcon} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{SLIDES[slide].title}</Text>
              <Text style={styles.heroSub}>{SLIDES[slide].sub}</Text>
              <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/tabs/menu')}>
                <Text style={styles.heroBtnText}>Order Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dots}>
              {SLIDES.map((_, i) => (
                <View key={i} style={[styles.dot, i === slide && styles.dotActive]} />
              ))}
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/menu')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF0F3' }]}>
              <Ionicons name="restaurant" size={24} color={Colors.pink} />
            </View>
            <Text style={styles.actionLabel}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/cart')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFFBEA' }]}>
              <Ionicons name="cart" size={24} color="#B8860B" />
            </View>
            <Text style={styles.actionLabel}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/orders')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF0F0' }]}>
              <Ionicons name="receipt" size={24} color={Colors.red} />
            </View>
            <Text style={styles.actionLabel}>Orders</Text>
          </TouchableOpacity>
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
            <Ionicons name="time" size={18} color={Colors.red} />
            <Text style={styles.infoTitle}>Hours</Text>
          </View>
          <Text style={styles.infoText}>Mon – Sun: 8:00 AM – 10:00 PM</Text>
        </View>

        <View style={{ height: 20 }} />
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
          <TouchableOpacity style={styles.accountRow} onPress={() => { setShowAccount(false); Alert.alert('Change Password', 'A password reset link will be sent to your email.'); }}>
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
  container:       { flex: 1, backgroundColor: Colors.white },
  content:         { padding: 20, paddingTop: 56 },
  header:          { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logoCircle:      { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.yellow, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#e6c000' },
  logoText:        { fontSize: 10, fontWeight: '800', color: Colors.black },
  greeting:        { fontSize: 17, fontWeight: '700', color: Colors.black },
  subGreeting:     { fontSize: 13, color: Colors.grey, marginTop: 1 },
  avatarCircle:    { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.pink, alignItems: 'center', justifyContent: 'center' },
  avatarText:      { fontSize: 18, fontWeight: '800', color: Colors.white },
  hero:            { borderRadius: 20, overflow: 'hidden', marginBottom: 24, height: 200 },
  heroBg:          { flex: 1, position: 'relative' },
  heroOverlay:     { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  heroBgIcon:      { position: 'absolute', right: 20, top: 20 },
  heroContent:     { padding: 24, paddingTop: 28 },
  heroTitle:       { fontSize: 26, fontWeight: '800', color: Colors.white, marginBottom: 6, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  heroSub:         { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 18, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  heroBtn:         { backgroundColor: Colors.yellow, borderRadius: 10, paddingHorizontal: 22, paddingVertical: 10, alignSelf: 'flex-start' },
  heroBtnText:     { fontSize: 14, fontWeight: '700', color: Colors.black },
  dots:            { flexDirection: 'row', position: 'absolute', bottom: 12, alignSelf: 'center', gap: 6, left: 0, right: 0, justifyContent: 'center' },
  dot:             { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotActive:       { width: 18, backgroundColor: Colors.white },
  sectionTitle:    { fontSize: 17, fontWeight: '700', color: Colors.black, marginBottom: 12 },
  actions:         { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionCard:      { flex: 1, backgroundColor: Colors.lightGrey, borderRadius: 14, padding: 16, alignItems: 'center', gap: 8 },
  actionIcon:      { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionLabel:     { fontSize: 13, fontWeight: '600', color: Colors.black },
  infoCard:        { backgroundColor: Colors.lightGrey, borderRadius: 16, padding: 18 },
  infoRow:         { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoTitle:       { fontSize: 14, fontWeight: '700', color: Colors.black },
  infoText:        { fontSize: 13, color: Colors.grey, marginLeft: 24 },
  infoDivider:     { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  modalBackdrop:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  accountSheet:    { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetHandle:     { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  accountHeader:   { alignItems: 'center', marginBottom: 20 },
  avatarLarge:     { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.pink, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarLargeText: { fontSize: 32, fontWeight: '800', color: Colors.white },
  accountEmail:    { fontSize: 14, color: Colors.grey },
  accountDivider:  { height: 1, backgroundColor: Colors.border, marginBottom: 8 },
  accountRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  accountRowText:  { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.black },
  signOutRow:      { borderBottomWidth: 0 },
});
