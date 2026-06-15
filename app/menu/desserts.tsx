import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RED = '#b60015';
const YELLOW = '#FFD544';

export default function Desserts() {
  const router = useRouter();
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push('/tabs/menu')}>
          <Ionicons name="arrow-back" size={20} color="#1a1612" /><Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Desserts Menu</Text>
          <Text style={s.subtitle}>Casa Del Sol</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>
      <View style={s.body}>
        <Ionicons name="ice-cream" size={72} color={RED} />
        <Text style={s.comingSoon}>Coming Soon</Text>
        <Text style={s.sub}>Our desserts menu is being prepared.{'\n'}Check back soon!</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: YELLOW },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  backBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4, width: 60 },
  backText:     { fontSize: 15, fontWeight: '700', color: '#1a1612' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title:        { fontSize: 18, fontWeight: '800', color: '#1a1612', textAlign: 'center' },
  subtitle:     { fontSize: 11, color: RED, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' },
  body:         { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  comingSoon:   { fontSize: 28, fontWeight: '900', color: '#1a1612' },
  sub:          { fontSize: 15, color: '#6b6b6b', textAlign: 'center', lineHeight: 24 },
});
