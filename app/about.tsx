import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RED = '#b60015';
const YELLOW = '#FFD544';

export default function About() {
  const router = useRouter();
  const openLink = (url: string) => Linking.openURL(url).catch(() => {});

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1a1612" />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>About Us</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <View style={s.logoSection}>
          <Image source={require('../assets/casadelsol.logo.png')} style={s.logo} resizeMode="contain" />
        </View>

        <Text style={s.philosophyTitle}>OUR PHILOSOPHY</Text>

        <Text style={s.body}>At CASA DEL SOL, our cuisine is built upon a simple philosophy: to bring you a unique Mediterranean experience through authentic and generous flavours.</Text>
        <Text style={s.body}>We only use fresh, high-quality and seasonal ingredients, carefully selected from local producers.</Text>
        <Text style={s.body}>Our vegetables are carefully selected for their natural quality and freshness, accompanied by premium Italian olive oils chosen with great care.</Text>
        <Text style={s.body}>All our sauces are homemade, prepared daily with passion using traditional recipes and natural ingredients.</Text>
        <Text style={s.body}>Our cuisine is inspired by the true Mediterranean art of living: generous portions, rich flavours and sharing around the table.</Text>
        <Text style={s.quote}>"At CASA DEL SOL, we don't just serve you a meal, we offer you a moment of sunshine and culinary pleasure."</Text>

        <View style={s.divider} />

        <Text style={s.sectionTitle}>Follow Us</Text>
        <View style={s.socialRow}>
          <TouchableOpacity style={s.socialBtn} onPress={() => openLink('https://www.instagram.com/casadelsol.bw?igsh=MXR4ZmNnMHpmbTRxMA==')}>
            <Ionicons name="logo-instagram" size={28} color="#fff" />
            <Text style={s.socialLabel}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.socialBtn} onPress={() => openLink('https://www.tiktok.com/@tam.restaurant.group')}>
            <Ionicons name="logo-tiktok" size={28} color="#fff" />
            <Text style={s.socialLabel}>TikTok</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.socialBtn} onPress={() => openLink('https://www.facebook.com/share/1EDPymPAzL/')}>
            <Ionicons name="logo-facebook" size={28} color="#fff" />
            <Text style={s.socialLabel}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={s.divider} />

        <Text style={s.sectionTitle}>Check Out Our Site</Text>
        <TouchableOpacity style={s.linkRow} onPress={() => openLink('https://casadelsol.co.bw')}>
          <Ionicons name="globe-outline" size={20} color={RED} />
          <Text style={s.linkText}>casadelsol.co.bw</Text>
          <Ionicons name="open-outline" size={16} color="#aaa" />
        </TouchableOpacity>

        <View style={s.divider} />

        <Text style={s.sectionTitle}>Contact Us</Text>
        <View style={s.linkRow}>
          <Ionicons name="call-outline" size={20} color={RED} />
          <Text style={s.linkText}>74 794 929</Text>
        </View>

        <View style={s.divider} />

        <Text style={s.sectionTitle}>Find Us</Text>
        <Text style={s.body}>Mowana Park Mall{'\n'}Phakalane, Botswana{'\n'}Mon – Sun: 7:00 AM – 10:00 PM</Text>

        <View style={{ height: 80 }} />
        <View style={s.footer}>
          <Image source={require('../assets/logo.png')} style={s.footerLogo} resizeMode="contain" />
          <Text style={s.footerText}>TAM Group Company</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: YELLOW },
  header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16, backgroundColor: '#fff' },
  backBtn:         { flexDirection: 'row', alignItems: 'center', gap: 4, width: 70 },
  backText:        { fontSize: 15, fontWeight: '700', color: '#1a1612' },
  headerTitle:     { flex: 1, fontSize: 20, fontWeight: '800', color: '#1a1612', textAlign: 'center' },
  content:         { padding: 20 },
  logoSection:     { alignItems: 'center', paddingVertical: 20, marginBottom: 16 },
  logo:            { width: 220, height: 120 },
  philosophyTitle: { fontSize: 18, fontWeight: '900', color: RED, letterSpacing: 2, marginBottom: 6, borderBottomWidth: 2, borderBottomColor: RED, paddingBottom: 6, alignSelf: 'center', textAlign: 'center' },
  body:            { fontSize: 13, color: '#1a1612', lineHeight: 22, marginBottom: 14 },
  quote:           { fontSize: 14, color: RED, fontStyle: 'italic', fontWeight: '700', textAlign: 'center', lineHeight: 22, marginVertical: 10 },
  divider:         { height: 1, backgroundColor: '#fff', marginVertical: 16 },
  sectionTitle:    { fontSize: 15, fontWeight: '800', color: '#1a1612', marginBottom: 10 },
  socialRow:       { flexDirection: 'row', gap: 12, marginBottom: 4 },
  socialBtn:       { flex: 1, backgroundColor: RED, borderRadius: 14, paddingVertical: 18, alignItems: 'center', gap: 6 },
  socialLabel:     { fontSize: 12, fontWeight: '600', color: '#fff' },
  linkRow:         { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 4 },
  linkText:        { flex: 1, fontSize: 14, fontWeight: '600', color: RED },
  footer:          { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, paddingTop: 20, paddingBottom: 50, marginHorizontal: -20 },
  footerLogo:      { width: 44, height: 28 },
  footerText:      { fontSize: 11, color: '#1a1612', fontWeight: '600', opacity: 0.6 },
});
