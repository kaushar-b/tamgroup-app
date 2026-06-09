import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function About() {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1a1612" />
        </TouchableOpacity>
        <Text style={s.title}>About Us</Text>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <View style={s.logoSection}>
          <View style={s.logoBadge}>
            <Text style={s.logoBadgeText}>TAM</Text>
          </View>
          <Text style={s.brandName}>TAM Restaurant Group</Text>
          <Text style={s.tagline}>Fresh & Delicious, Every Time</Text>
        </View>

        <Text style={s.sectionTitle}>Who We Are</Text>
        <Text style={s.body}>TAM Restaurant Group is a proudly Botswana-based restaurant located at Mowana Park Mall, Phakalane. We are passionate about delivering fresh, high-quality meals to our customers — whether you dine in, pick up, or order for delivery.</Text>

        <Text style={s.sectionTitle}>Our Mission</Text>
        <Text style={s.body}>To bring exceptional food experiences to every customer, crafted with the finest ingredients and served with warmth and care.</Text>

        <Text style={s.sectionTitle}>Find Us</Text>
        <Text style={s.body}>Mowana Park Mall{'\n'}Phakalane, Botswana{'\n'}Mon – Sun: 8:00 AM – 10:00 PM</Text>

        <View style={s.divider} />

        <Text style={s.sectionTitle}>Check Out Our Site</Text>
        <TouchableOpacity style={s.linkRow} onPress={() => openLink('https://tamgroup-restaurant.co.bw')}>
          <Ionicons name="globe-outline" size={20} color="#CE6F79" />
          <Text style={s.linkText}>tamgroup-restaurant.co.bw</Text>
          <Ionicons name="open-outline" size={16} color="#aaa" />
        </TouchableOpacity>

        <View style={s.divider} />

        <Text style={s.sectionTitle}>Follow Us</Text>
        <View style={s.socialRow}>
          <TouchableOpacity style={s.socialBtn} onPress={() => openLink('https://www.instagram.com/tamgrouprestaurant.bw/')}>
            <Ionicons name="logo-instagram" size={28} color="#CE6F79" />
            <Text style={s.socialLabel}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.socialBtn} onPress={() => openLink('https://www.tiktok.com/@tam.restaurant.group?_r=1&_t=ZS-9740GrZwjhg')}>
            <Ionicons name="logo-tiktok" size={28} color="#CE6F79" />
            <Text style={s.socialLabel}>TikTok</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.socialBtn} onPress={() => openLink('https://www.facebook.com')}>
            <Ionicons name="logo-facebook" size={28} color="#CE6F79" />
            <Text style={s.socialLabel}>Facebook</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.reminderNote}>Reminder: update the Facebook link with the real page URL when available.</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#fff' },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F3C3C5' },
  backBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center' },
  title:        { fontSize: 22, fontWeight: '800', color: '#1a1612' },
  content:      { padding: 24 },
  logoSection:  { alignItems: 'center', paddingVertical: 24 },
  logoBadge:    { width: 80, height: 80, borderRadius: 20, backgroundColor: '#CE6F79', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoBadgeText:{ fontSize: 28, fontWeight: '900', color: '#fff' },
  brandName:    { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 4 },
  tagline:      { fontSize: 13, color: '#6b6b6b', fontStyle: 'italic' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1a1612', marginTop: 20, marginBottom: 8 },
  body:         { fontSize: 13, color: '#6b6b6b', lineHeight: 21 },
  divider:      { height: 1, backgroundColor: '#F3C3C5', marginVertical: 20 },
  linkRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FADAD9', borderRadius: 12, padding: 14 },
  linkText:     { flex: 1, fontSize: 14, fontWeight: '600', color: '#CE6F79' },
  socialRow:    { flexDirection: 'row', gap: 12, marginTop: 4 },
  socialBtn:    { flex: 1, backgroundColor: '#FADAD9', borderRadius: 14, paddingVertical: 18, alignItems: 'center', gap: 6 },
  socialLabel:  { fontSize: 12, fontWeight: '600', color: '#1a1612' },
  reminderNote: { fontSize: 11, color: '#aaa', marginTop: 12, fontStyle: 'italic', textAlign: 'center' },
});
