import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RED = '#b60015';
const YELLOW = '#FFD544';

const CATEGORIES = [
  { id: 'starters', label: 'Starters', route: '/menu/starters' },
  { id: 'paella', label: 'Paella', route: '/menu/paella' },
  { id: 'specials', label: 'Weekly Specials', route: '/menu/specials' },
  { id: 'aperitifs', label: 'Signature Aperitifs', route: '/menu/aperitifs' },
  { id: 'desserts', label: 'Desserts', route: '/menu/desserts' },
];

function FooterLogo() {
  return (
    <View style={footer.wrap}>
      <Image source={require('../../assets/logo.png')} style={footer.logo} resizeMode="contain" />
      <Text style={footer.text}>TAM Group Company</Text>
    </View>
  );
}

export default function MenuSelector() {
  const router = useRouter();
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push('/tabs')}>
          <Ionicons name="arrow-back" size={20} color="#1a1612" />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.title}>Our Menu</Text>
        <Text style={s.subtitle}>Casa Del Sol</Text>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat.id} style={s.catBtn} onPress={() => router.push(cat.route as any)}>
            <Text style={s.catLabel}>{cat.label}</Text>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        ))}
        <FooterLogo />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: YELLOW },
  header:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
  backBtn:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText:  { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  content:   { padding: 20, paddingTop: 8 },
  title:     { fontSize: 30, fontWeight: '900', color: '#1a1612', marginBottom: 4 },
  subtitle:  { fontSize: 14, color: RED, fontWeight: '700', marginBottom: 28, letterSpacing: 1 },
  catBtn:    { backgroundColor: RED, borderRadius: 50, paddingVertical: 20, paddingHorizontal: 28, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 3 },
  catLabel:  { fontSize: 20, fontWeight: '800', color: '#fff' },
});

const footer = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 20, marginTop: 10 },
  logo: { width: 60, height: 34, marginBottom: 4 },
  text: { fontSize: 11, color: '#1a1612', fontWeight: '600', opacity: 0.5 },
});
