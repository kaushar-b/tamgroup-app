import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { subscribeSection, MenuItem, Section, SECTION_LABELS } from '../../lib/menu';

const RED    = '#b60015';
const YELLOW = '#FFD544';
const DARK   = '#1a1612';

function Row({ item, onPress }: { item: MenuItem; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.row} activeOpacity={0.85} onPress={onPress}>
      <View style={s.thumbWrap}>
        {item.images?.[0]
          ? <Image source={{ uri: item.images[0] }} style={s.thumb} />
          : <View style={[s.thumb, s.thumbEmpty]}><Ionicons name="image-outline" size={22} color={RED} /></View>}
      </View>
      <View style={s.rowBody}>
        {item.day ? <Text style={s.rowDay}>{item.day.toUpperCase()}</Text> : null}
        <Text style={s.rowName} numberOfLines={1}>{item.name}</Text>
        <Text style={s.rowDesc} numberOfLines={1}>{item.description || 'No description'}</Text>
        <Text style={s.rowPrice}>P {item.price}.00</Text>
      </View>
      <View style={s.editIcon}><Ionicons name="create-outline" size={22} color={RED} /></View>
    </TouchableOpacity>
  );
}

export default function MenuSection() {
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string }>();
  const section = (params.section || 'starters') as Section;

  const [items, setItems]     = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeSection(section, list => { setItems(list); setLoading(false); });
    return unsub;
  }, [section]);

  const goEdit = (id: string) => router.push({ pathname: '/ManageMyApp/menu-editor', params: { section, id } });
  const goAdd  = () => router.push({ pathname: '/ManageMyApp/menu-editor', params: { section } });

  const mains  = items.filter(i => i.group !== 'salads');
  const salads = items.filter(i => i.group === 'salads');

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.replace('/ManageMyApp/menu-manager')}>
          <Ionicons name="arrow-back" size={24} color={DARK} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{SECTION_LABELS[section]}</Text>
        <View style={{ width: 76 }} />
      </View>

      <TouchableOpacity style={s.addBtn} onPress={goAdd}>
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={s.addBtnTxt}>Add New Item</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={s.center}><ActivityIndicator size="large" color={RED} /></View>
      ) : items.length === 0 ? (
        <View style={s.center}>
          <Ionicons name="restaurant-outline" size={56} color={RED} />
          <Text style={s.emptyTxt}>No items yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.list}>
          {section === 'starters' ? (
            <>
              {mains.map(item => <Row key={item.id} item={item} onPress={() => goEdit(item.id)} />)}
              {salads.length > 0 && (
                <View style={s.divider}><Text style={s.dividerTxt}>— Signature Salads —</Text></View>
              )}
              {salads.map(item => <Row key={item.id} item={item} onPress={() => goEdit(item.id)} />)}
            </>
          ) : (
            items.map(item => <Row key={item.id} item={item} onPress={() => goEdit(item.id)} />)
          )}
          <View style={{ height: 60 }} />
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
  addBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: RED, marginHorizontal: 16, marginTop: 14, borderRadius: 14, paddingVertical: 15 },
  addBtnTxt:   { fontSize: 15, fontWeight: '800', color: '#fff' },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTxt:    { fontSize: 16, fontWeight: '700', color: DARK },
  list:        { padding: 16 },
  row:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 10, marginBottom: 12, elevation: 2 },
  thumbWrap:   { width: 64, height: 64, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f5eec9' },
  thumb:       { width: '100%', height: '100%' },
  thumbEmpty:  { alignItems: 'center', justifyContent: 'center' },
  rowBody:     { flex: 1, marginLeft: 12 },
  rowDay:      { fontSize: 10, fontWeight: '900', color: RED, letterSpacing: 1, marginBottom: 2 },
  rowName:     { fontSize: 16, fontWeight: '800', color: DARK },
  rowDesc:     { fontSize: 13, color: '#6b6b6b', marginTop: 2 },
  rowPrice:    { fontSize: 14, fontWeight: '800', color: RED, marginTop: 4 },
  editIcon:    { padding: 10 },
  divider:     { alignItems: 'center', marginVertical: 14 },
  dividerTxt:  { fontSize: 14, fontWeight: '900', color: DARK, letterSpacing: 0.5 },
});