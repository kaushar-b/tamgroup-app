import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { seedAllIfEmpty, SECTIONS, SECTION_LABELS, Section } from '../../lib/menu';

const RED    = '#b60015';
const YELLOW = '#FFD544';
const DARK   = '#1a1612';

const SECTION_ICON: Record<Section, string> = {
  starters: 'food-fork-drink',
  paella:   'rice',
  specials: 'calendar-week',
  desserts: 'cupcake',
};

const SECTION_SUB: Record<Section, string> = {
  starters: 'Starters & Signature Salads',
  paella:   'Paella dishes',
  specials: 'One dish per weekday',
  desserts: 'Orderable desserts',
};

export default function MenuManager() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(true);

  useEffect(() => {
    (async () => {
      try { await seedAllIfEmpty(); } catch {}
      setSeeding(false);
    })();
  }, []);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={DARK} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Menu Management</Text>
        <View style={{ width: 76 }} />
      </View>

      {seeding ? (
        <View style={s.center}><ActivityIndicator size="large" color={RED} /></View>
      ) : (
        <ScrollView contentContainerStyle={s.list}>
          <Text style={s.intro}>Choose a section to manage its items.</Text>
          {SECTIONS.map(section => (
            <TouchableOpacity
              key={section}
              style={s.card}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/ManageMyApp/menu-section', params: { section } })}
            >
              <View style={s.iconWrap}>
                <MaterialCommunityIcons name={SECTION_ICON[section] as any} size={28} color="#fff" />
              </View>
              <View style={s.cardBody}>
                <Text style={s.cardTitle}>{SECTION_LABELS[section]}</Text>
                <Text style={s.cardSub}>{SECTION_SUB[section]}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={RED} />
            </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: YELLOW },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  backBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, width: 76 },
  backText:    { fontSize: 16, fontWeight: '700', color: DARK },
  headerTitle: { fontSize: 17, fontWeight: '800', color: DARK, flex: 1, textAlign: 'center' },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list:        { padding: 16 },
  intro:       { fontSize: 13, color: '#7a6a4a', fontWeight: '600', marginBottom: 14 },
  card:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, elevation: 2 },
  iconWrap:    { width: 52, height: 52, borderRadius: 12, backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  cardBody:    { flex: 1, marginLeft: 14 },
  cardTitle:   { fontSize: 17, fontWeight: '800', color: DARK },
  cardSub:     { fontSize: 12, color: '#6b6b6b', marginTop: 2 },
});