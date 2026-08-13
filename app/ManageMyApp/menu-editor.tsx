import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Image, Alert, ActivityIndicator, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref as dbRef, get } from 'firebase/database';
import { db } from '../../lib/firebase';
import {
  newMenuId, uploadMenuImage, saveMenuItem, deleteMenuItem,
  Section, SECTION_LABELS, DAYS,
} from '../../lib/menu';

const RED    = '#b60015';
const YELLOW = '#FFD544';
const GREEN  = '#22c55e';
const DARK   = '#1a1612';

const COLS = 3;
const GAP  = 10;
const MAX_IMAGES = 10;

function move<T>(arr: T[], from: number, to: number): T[] {
  const copy = arr.slice();
  const [it] = copy.splice(from, 1);
  copy.splice(to, 0, it);
  return copy;
}

function ImageGrid({ uris, onChange, onRemove }: {
  uris: string[]; onChange: (n: string[]) => void; onRemove: (u: string) => void;
}) {
  const [gridW, setGridW] = useState(0);
  const tile = gridW > 0 ? (gridW - GAP * (COLS - 1)) / COLS : 0;
  const swap = (from: number, to: number) => {
    if (to < 0 || to >= uris.length) return;
    onChange(move(uris, from, to));
  };
  return (
    <View onLayout={e => setGridW(e.nativeEvent.layout.width)} style={styles.grid}>
      {tile > 0 && uris.map((uri, i) => {
        const isFirst = i === 0, isLast = i === uris.length - 1;
        return (
          <View key={uri} style={[styles.tile, { width: tile, height: tile, marginRight: (i % COLS === COLS - 1) ? 0 : GAP }]}>
            <Image source={{ uri }} style={styles.tileImg} />
            {isFirst && <View style={styles.primaryTag}><Text style={styles.primaryTagTxt}>Primary</Text></View>}
            <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(uri)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
            <View style={styles.moveRow}>
              <TouchableOpacity style={[styles.moveBtn, isFirst && styles.moveBtnDisabled]} disabled={isFirst} onPress={() => swap(i, i - 1)}>
                <Ionicons name="chevron-back" size={18} color={isFirst ? '#d9cccc' : '#fff'} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.moveBtn, isLast && styles.moveBtnDisabled]} disabled={isLast} onPress={() => swap(i, i + 1)}>
                <Ionicons name="chevron-forward" size={18} color={isLast ? '#d9cccc' : '#fff'} />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function MenuEditor() {
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string; id?: string }>();
  const section = (params.section || 'starters') as Section;
  const isEdit = !!params.id;

  const idRef = useRef<string>(params.id || newMenuId(section));
  const [loading, setLoading] = useState(isEdit);
  const [name, setName]   = useState('');
  const [desc, setDesc]   = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [group, setGroup] = useState<'main' | 'salads'>('main');
  const [day, setDay]     = useState<string>('Monday');
  const [sundayAvailable, setSundayAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const createdAt = useRef<number | undefined>(undefined);
  const sortOrder = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const snap = await get(dbRef(db, `menu/${section}/${params.id}`));
      const v = snap.val();
      if (v) {
        setName(v.name ?? '');
        setDesc(v.description ?? '');
        setPrice(v.price != null ? String(v.price) : '');
        setImages(Array.isArray(v.images) ? v.images : []);
        if (v.group) setGroup(v.group);
        if (v.day) setDay(v.day);
        if (v.sundayAvailable !== undefined) setSundayAvailable(v.sundayAvailable !== false);
        createdAt.current = v.createdAt;
        sortOrder.current = v.sortOrder;
      }
      setLoading(false);
    })();
  }, []);

  const back = () => router.replace({ pathname: '/ManageMyApp/menu-section', params: { section } });

  const pickImages = async () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { Alert.alert('Limit reached', `Up to ${MAX_IMAGES} images.`); return; }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission needed', 'Please allow photo access.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: remaining, quality: 0.7,
    });
    if (!res.canceled) setImages(prev => [...prev, ...res.assets.map(a => a.uri)].slice(0, MAX_IMAGES));
  };

  const removeImage = (uri: string) => setImages(prev => prev.filter(u => u !== uri));

  const onSave = async () => {
    if (!name.trim()) { Alert.alert('Missing name', 'Please enter a name.'); return; }
    const priceNum = Math.round(Number(price));
    if (!price.trim() || isNaN(priceNum) || priceNum < 0) { Alert.alert('Invalid price', 'Please enter a valid price.'); return; }
    setSaving(true);
    try {
      const finalImages: string[] = [];
      for (const uri of images) {
        if (uri.startsWith('http')) finalImages.push(uri);
        else finalImages.push(await uploadMenuImage(section, idRef.current, uri));
      }
      await saveMenuItem(section, {
        id: idRef.current, name, description: desc, price: priceNum,
        images: finalImages, sortOrder: sortOrder.current, createdAt: createdAt.current,
        group, day, sundayAvailable,
      });
      setImages(finalImages);
      setSaving(false);
      setSaved(true);
      setTimeout(back, 900);
    } catch {
      setSaving(false);
      Alert.alert('Save failed', 'Something went wrong. Please try again.');
    }
  };

  const onDelete = () => {
    Alert.alert('Delete Item', 'Permanently delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await deleteMenuItem(section, idRef.current); back(); }
        catch { Alert.alert('Delete failed', 'Please try again.'); }
      }},
    ]);
  };

  if (loading) return <View style={styles.loadingWrap}><ActivityIndicator size="large" color={RED} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={back}>
          <Ionicons name="arrow-back" size={24} color={DARK} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit' : 'Add'} · {SECTION_LABELS[section]}</Text>
        <TouchableOpacity style={[styles.saveBtn, saved && styles.saveBtnDone]} onPress={onSave} disabled={saving || saved}>
          {saving ? <ActivityIndicator size="small" color={RED} />
            : saved ? <Ionicons name="checkmark" size={20} color="#fff" />
            : <Text style={styles.saveBtnTxt}>Save</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Images</Text>
        <Text style={styles.hint}>Tap ‹ › to reorder · first image shows first · tap ✕ to remove</Text>
        <ImageGrid uris={images} onChange={setImages} onRemove={removeImage} />
        {images.length < MAX_IMAGES && (
          <TouchableOpacity style={styles.addImgBtn} onPress={pickImages}>
            <Ionicons name="images-outline" size={20} color={RED} />
            <Text style={styles.addImgTxt}>Add Images ({images.length}/{MAX_IMAGES})</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Dish name" placeholderTextColor="#c0a9a9" />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.inputMulti]} value={desc} onChangeText={setDesc} placeholder="Short description" placeholderTextColor="#c0a9a9" multiline />

        <Text style={styles.label}>Price (P)</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="150" placeholderTextColor="#c0a9a9" keyboardType="number-pad" />

        {section === 'starters' && (
          <>
            <Text style={styles.label}>Group</Text>
            <View style={styles.segRow}>
              {(['main','salads'] as const).map(g => (
                <TouchableOpacity key={g} style={[styles.seg, group === g && styles.segActive]} onPress={() => setGroup(g)}>
                  <Text style={[styles.segTxt, group === g && styles.segTxtActive]}>{g === 'main' ? 'Main' : 'Signature Salads'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {section === 'specials' && (
          <>
            <Text style={styles.label}>Day of Week</Text>
            <View style={styles.dayWrap}>
              {DAYS.map(d => (
                <TouchableOpacity key={d} style={[styles.dayChip, day === d && styles.dayChipActive]} onPress={() => setDay(d)}>
                  <Text style={[styles.dayChipTxt, day === d && styles.dayChipTxtActive]}>{d.slice(0,3)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Sunday Availability</Text>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleTitle}>Show on Sundays</Text>
                <Text style={styles.toggleSub}>On Sunday, only dishes with this ON are shown</Text>
              </View>
              <Switch
                value={sundayAvailable}
                onValueChange={setSundayAvailable}
                trackColor={{ false: '#ccc', true: RED }}
                thumbColor="#fff"
              />
            </View>
          </>
        )}

        {isEdit && (
          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.deleteBtnTxt}>Delete Item</Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: YELLOW },
  loadingWrap:  { flex: 1, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center' },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  backBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4, width: 76 },
  backText:     { fontSize: 16, fontWeight: '700', color: DARK },
  headerTitle:  { fontSize: 15, fontWeight: '800', color: DARK, flex: 1, textAlign: 'center' },
  saveBtn:      { width: 76, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 10, backgroundColor: '#fff', borderWidth: 2, borderColor: RED, minHeight: 40 },
  saveBtnDone:  { backgroundColor: GREEN, borderColor: GREEN },
  saveBtnTxt:   { fontSize: 15, fontWeight: '800', color: RED, textAlign: 'center' },
  body:         { padding: 16 },
  label:        { fontSize: 14, fontWeight: '800', color: DARK, marginTop: 18, marginBottom: 6 },
  hint:         { fontSize: 12, color: '#8a7a6a', marginBottom: 6 },
  input:        { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e7d9a6', paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: DARK },
  inputMulti:   { minHeight: 80, textAlignVertical: 'top' },
  addImgBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: RED, borderStyle: 'dashed', paddingVertical: 14, marginTop: 10 },
  addImgTxt:    { fontSize: 14, fontWeight: '800', color: RED },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  tile:         { borderRadius: 12, backgroundColor: '#eee', marginBottom: GAP, position: 'relative' },
  tileImg:      { width: '100%', height: '100%', borderRadius: 12 },
  primaryTag:   { position: 'absolute', top: 6, left: 6, backgroundColor: RED, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  primaryTagTxt:{ fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 0.3 },
  removeBtn:    { position: 'absolute', top: -6, right: -6, backgroundColor: RED, borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', elevation: 4, zIndex: 20 },
  moveRow:      { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: 4 },
  moveBtn:      { backgroundColor: 'rgba(26,22,18,0.66)', borderRadius: 8, width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  moveBtnDisabled:{ backgroundColor: 'rgba(26,22,18,0.22)' },
  segRow:       { flexDirection: 'row', gap: 10 },
  seg:          { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#fff', borderWidth: 2, borderColor: RED },
  segActive:    { backgroundColor: RED },
  segTxt:       { fontSize: 13, fontWeight: '800', color: RED },
  segTxtActive: { color: '#fff' },
  dayWrap:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayChip:      { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 50, backgroundColor: '#fff', borderWidth: 2, borderColor: RED },
  dayChipActive:{ backgroundColor: RED },
  dayChipTxt:   { fontSize: 13, fontWeight: '800', color: RED },
  dayChipTxtActive:{ color: '#fff' },
  toggleRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e7d9a6', paddingHorizontal: 14, paddingVertical: 10 },
  toggleTextWrap:{ flex: 1, paddingRight: 12 },
  toggleTitle:  { fontSize: 14, fontWeight: '800', color: DARK },
  toggleSub:    { fontSize: 11, color: '#8a7a6a', marginTop: 2 },
  deleteBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#6b6b6b', borderRadius: 12, paddingVertical: 14, marginTop: 30 },
  deleteBtnTxt: { fontSize: 14, fontWeight: '800', color: '#fff' },
});