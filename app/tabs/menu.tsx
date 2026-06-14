import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useEffect, useState } from 'react';

const { width: SW } = Dimensions.get('window');
const RED = '#b60015';
const YELLOW = '#FFD544';
const ITEM_SIZE = Math.round(SW / 3);

const CAROUSEL_IMAGES = [
  require('../../assets/images/products/Seafood Paella1.jpeg'),
  require('../../assets/images/products/Coq au Vin1.jpeg'),
  require('../../assets/images/products/Beef Bourguignon1.jpeg'),
  require('../../assets/images/products/Lamb Chops1.jpeg'),
  require('../../assets/images/products/Garlic Butter Shrimp1.jpeg'),
  require('../../assets/images/products/Tomato & Basil Bruschetta1.jpeg'),
];

const CATEGORIES = [
  { id: 'starters',  label: 'Starters',            route: '/menu/starters' },
  { id: 'paella',    label: 'Paella',               route: '/menu/paella' },
  { id: 'specials',  label: 'Weekly Specials',      route: '/menu/specials' },
  { id: 'aperitifs', label: 'Signature Aperitifs',  route: '/menu/aperitifs' },
  { id: 'desserts',  label: 'Desserts',             route: '/menu/desserts' },
];

export default function MenuSelector() {
  const router = useRouter();
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
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.replace('/tabs')}>
          <Ionicons name="arrow-back" size={20} color="#1a1612" />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.title}>Our Menu</Text>
        <Text style={s.subtitle}>Casa Del Sol Restaurant</Text>

        {/* Carousel */}
        <View style={s.carouselWrap}>
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
              <View style={s.carouselItem}>
                <Image source={item} style={s.carouselImg} resizeMode="cover" />
              </View>
            )}
          />
        </View>

        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat.id} style={s.catBtn} onPress={() => router.push(cat.route as any)}>
            <Text style={s.catLabel}>{cat.label}</Text>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        ))}

        {/* Footer */}
        <View style={s.footer}>
          <Image source={require('../../assets/logo.png')} style={s.footerLogo} resizeMode="contain" />
          <Text style={s.footerText}>TAM Group Company</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: YELLOW },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
  backBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText:     { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  content:      { padding: 20, paddingTop: 4 },
  title:        { fontSize: 30, fontWeight: '900', color: '#1a1612', marginBottom: 4, textAlign: 'center' },
  subtitle:     { fontSize: 14, color: RED, fontWeight: '700', marginBottom: 16, letterSpacing: 1, textAlign: 'center' },
  carouselWrap: { marginBottom: 20, marginHorizontal: -20 },
  carouselItem: { width: ITEM_SIZE, height: ITEM_SIZE, marginRight: 8, borderRadius: 12, overflow: 'hidden' },
  carouselImg:  { width: '100%', height: '100%' },
  catBtn:       { backgroundColor: RED, borderRadius: 50, paddingVertical: 20, paddingHorizontal: 28, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 3 },
  catLabel:     { fontSize: 20, fontWeight: '800', color: '#fff', flex: 1, textAlign: 'center' },
  footer:       { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, paddingVertical: 14, marginTop: 30, marginHorizontal: -20 },
  footerLogo:   { width: 44, height: 28 },
  footerText:   { fontSize: 11, color: '#1a1612', fontWeight: '600', opacity: 0.6 },
});
