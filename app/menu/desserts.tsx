import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useCart } from '../../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RED    = '#b60015';
const YELLOW = '#FFD544';

// ─────────────────────────────────────────────────────────────
// DESSERTS IMAGES — drop your own images into:
//   assets/images/products/
// and update the require() paths below (4 images total).
// Current placeholders use existing dish images.
// ─────────────────────────────────────────────────────────────
const DESSERT_IMAGES = [
  require('../../assets/images/products/dessert1.jpeg'),
  require('../../assets/images/products/dessert2.jpeg'),
  require('../../assets/images/products/dessert4.jpeg'),
  require('../../assets/images/products/dessert3.jpeg'),
];

export default function Desserts() {
  const router = useRouter();
  const { count } = useCart();
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push('/tabs/menu')}>
          <Ionicons name="arrow-back" size={24} color="#1a1612" />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Desserts Menu</Text>
          <Text style={s.subtitle}>Casa Del Sol</Text>
        </View>
        <TouchableOpacity style={s.cartBtn} onPress={() => router.push('/tabs/cart')}>
          <Ionicons name="cart" size={22} color="#1a1612" />
          {count > 0 && (
            <View style={s.cartBadge}>
              <Text style={s.cartBadgeTxt}>{count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <View style={s.promoCard}>
          <Text style={s.promoTitle}>Download Gourmet Fine Pastries</Text>
          <Text style={s.promoSub}>Check out our desserts, cakes & pastries!</Text>
          <View style={s.storeRow}>
            <TouchableOpacity style={s.storeBtn} activeOpacity={0.85}>
              <Ionicons name="logo-google-playstore" size={26} color="#E9548C" />
              <View>
                <Text style={s.storeSmall}>GET IT ON</Text>
                <Text style={s.storeBig}>Google Play</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={s.storeBtn} activeOpacity={0.85}>
              <Ionicons name="logo-apple-appstore" size={26} color="#E9548C" />
              <View>
                <Text style={s.storeSmall}>Download on the</Text>
                <Text style={s.storeBig}>App Store</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {DESSERT_IMAGES.map((img, i) => (
          <View key={i} style={s.imgCard}>
            <Image source={img} style={s.img} resizeMode="cover" />
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: YELLOW },
  header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  cartBtn:         { padding: 8, position: 'relative', width: 44, alignItems: 'center' },
  cartBadge:       { position: 'absolute', top: 0, right: 0, backgroundColor: RED, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  cartBadgeTxt:    { fontSize: 10, fontWeight: '900', color: '#fff', textAlign: 'center' },
  backBtn:         { flexDirection: 'row', alignItems: 'center', gap: 6, width: 70 },
  backText:        { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  headerCenter:    { flex: 1, alignItems: 'center' },
  title:           { fontSize: 18, fontWeight: '800', color: '#1a1612', textAlign: 'center' },
  subtitle:        { fontSize: 11, color: RED, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' },
  content:         { padding: 16, alignItems: 'center' },
  promoCard:       { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 22, marginTop: 8, marginBottom: 20, alignItems: 'center', elevation: 3, borderWidth: 1.5, borderColor: '#F5C6D6' },
  promoTitle:      { fontSize: 19, fontWeight: '900', color: '#1a1612', textAlign: 'center', marginBottom: 6 },
  promoSub:        { fontSize: 13, color: '#6b6b6b', textAlign: 'center', marginBottom: 16, fontWeight: '600' },
  storeRow:        { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  storeBtn:        { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 2, borderColor: '#E9548C', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14 },
  storeSmall:      { fontSize: 8, fontWeight: '700', color: '#E9548C', letterSpacing: 0.5 },
  storeBig:        { fontSize: 14, fontWeight: '900', color: '#E9548C' },
  comingSoonBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: RED, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, marginBottom: 12, marginTop: 8 },
  comingSoonText:  { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  sub:             { fontSize: 14, color: '#1a1612', textAlign: 'center', lineHeight: 22, marginBottom: 24, fontWeight: '600' },
  imgCard:         { width: '100%', aspectRatio: 1, borderRadius: 18, overflow: 'hidden', marginBottom: 16, elevation: 3, backgroundColor: '#fff' },
  img:             { width: '100%', height: '100%' },
});
