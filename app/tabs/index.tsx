import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.firstName || 'there'} 👋</Text>
          <Text style={styles.subGreeting}>What would you like today?</Text>
        </View>
        <TouchableOpacity style={styles.logoBadge} onPress={() => signOut()}>
          <Text style={styles.logoText}>TAM</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Banner */}
      <View style={styles.hero}>
        <Text style={styles.heroEmo}>🍽️</Text>
        <Text style={styles.heroTitle}>Fresh & Delicious</Text>
        <Text style={styles.heroSub}>Mowana Park Mall, Phakalane</Text>
        <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/tabs/menu')}>
          <Text style={styles.heroBtnText}>Order Now</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/menu')}>
          <Text style={styles.actionEmoji}>🍔</Text>
          <Text style={styles.actionLabel}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/cart')}>
          <Text style={styles.actionEmoji}>🛒</Text>
          <Text style={styles.actionLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/tabs/orders')}>
          <Text style={styles.actionEmoji}>📋</Text>
          <Text style={styles.actionLabel}>Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📍 Find Us</Text>
        <Text style={styles.infoText}>Mowana Park Mall{'\n'}Phakalane, Botswana</Text>
        <View style={styles.infoDivider} />
        <Text style={styles.infoTitle}>🕐 Hours</Text>
        <Text style={styles.infoText}>Mon – Sun: 8:00 AM – 10:00 PM</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.white },
  content:      { padding: 20, paddingTop: 60 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting:     { fontSize: 22, fontWeight: '700', color: Colors.black },
  subGreeting:  { fontSize: 14, color: Colors.grey, marginTop: 2 },
  logoBadge:    { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.yellow, alignItems: 'center', justifyContent: 'center' },
  logoText:     { fontSize: 12, fontWeight: '800', color: Colors.black },
  hero:         { backgroundColor: Colors.pink, borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 28 },
  heroEmo:      { fontSize: 48, marginBottom: 8 },
  heroTitle:    { fontSize: 26, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  heroSub:      { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  heroBtn:      { backgroundColor: Colors.yellow, borderRadius: 10, paddingHorizontal: 28, paddingVertical: 12 },
  heroBtnText:  { fontSize: 15, fontWeight: '700', color: Colors.black },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.black, marginBottom: 14 },
  actions:      { flexDirection: 'row', gap: 12, marginBottom: 28 },
  actionCard:   { flex: 1, backgroundColor: Colors.lightGrey, borderRadius: 14, padding: 18, alignItems: 'center' },
  actionEmoji:  { fontSize: 28, marginBottom: 6 },
  actionLabel:  { fontSize: 13, fontWeight: '600', color: Colors.black },
  infoCard:     { backgroundColor: Colors.lightGrey, borderRadius: 16, padding: 20 },
  infoTitle:    { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 4 },
  infoText:     { fontSize: 14, color: Colors.grey, lineHeight: 22 },
  infoDivider:  { height: 1, backgroundColor: Colors.border, marginVertical: 14 },
});