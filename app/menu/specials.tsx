import { useState, useEffect, useCallback, useRef, Component, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { ref as dbRef, set as dbSet } from 'firebase/database';
import { db } from '../../lib/firebase';
import { subscribeSection, MenuItem, DAYS } from '../../lib/menu';
import { getBotswanaTime } from '../../lib/getBotswanaTime';

class SpecialsErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message: string }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: error?.message ?? String(error) };
  }
  componentDidCatch(error: any, info: any) {
    try {
      dbSet(dbRef(db, 'debug/specialsCrash'), {
        message: error?.message ?? String(error),
        stack: error?.stack ? String(error.stack).slice(0, 1500) : 'no stack',
        componentStack: info?.componentStack ? String(info.componentStack).slice(0, 1500) : 'no component stack',
        timestamp: Date.now(),
      });
    } catch {}
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#FFD544', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#b60015', textAlign: 'center', marginBottom: 12 }}>
            Something went wrong — please go back and try again
          </Text>
          <Text style={{ fontSize: 12, color: '#1a1612', textAlign: 'center' }}>{this.state.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const { width: SW } = Dimensions.get('window');
const RED    = '#b60015';
const YELLOW = '#FFD544';

const dayIndex = (d?: string) => {
  const i = DAYS.indexOf(d || '');
  return i === -1 ? 99 : i;
};

function DishModal({ dish, onClose }: { dish: MenuItem | null; onClose: () => void }) {
  const { addToCart, removeFromCart, items } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => { setImgIdx(0); }, [dish?.id]);
  if (!dish) return null;
  const qty = items.find(i => i.id === dish.id)?.quantity ?? 0;
  const inCart = qty > 0;
  const imgs = dish.images?.length ? dish.images : [];
  const cartImage = imgs[0] ? { uri: imgs[0] } : undefined;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={modal.sheet}>
          <View style={modal.imageBox}>
            {imgs[imgIdx]
              ? <Image source={{ uri: imgs[imgIdx] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              : <View style={modal.imgEmpty}><Ionicons name="image-outline" size={48} color="#ccc" /></View>}
            {imgs.length > 1 && (
              <>
                <TouchableOpacity style={[modal.navBtn, { left: 10 }]} onPress={() => setImgIdx(i => Math.max(0, i - 1))}>
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[modal.navBtn, { right: 10 }]} onPress={() => setImgIdx(i => Math.min(imgs.length - 1, i + 1))}>
                  <Ionicons name="chevron-forward" size={22} color="#fff" />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={modal.backBtn} onPress={onClose}>
              <Ionicons name="arrow-back" size={18} color="#1a1612" />
              <Text style={modal.backBtnText}>Back</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={modal.body}>
            <Text style={modal.name}>{dish.name}</Text>
            <Text style={modal.desc}>{dish.description}</Text>
            <View style={modal.priceRow}>
              <Text style={modal.price}>P {dish.price}.00</Text>
            </View>
            {!inCart ? (
              <TouchableOpacity
                style={modal.addBtn}
                onPress={() => addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: cartImage })}
              >
                <Ionicons name="cart" size={20} color="#1a1612" />
                <Text style={modal.addBtnTxt}>Add to Cart</Text>
              </TouchableOpacity>
            ) : (
              <View style={modal.cartControls}>
                <TouchableOpacity style={modal.removeBtn} onPress={() => { for (let i = 0; i < qty; i++) removeFromCart(dish.id); }}>
                  <Text style={modal.removeBtnTxt}>Remove</Text>
                </TouchableOpacity>
                <View style={modal.qtyRow}>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => removeFromCart(dish.id)}>
                    <Ionicons name="remove" size={28} color="#1a1612" />
                  </TouchableOpacity>
                  <Text style={modal.qtyText}>{qty}</Text>
                  <TouchableOpacity style={modal.qtyBtn} onPress={() => addToCart(dish.id, { id: dish.id, name: dish.name, price: dish.price, icon: 'restaurant', image: cartImage })}>
                    <Ionicons name="add" size={28} color="#1a1612" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function WeeklySpecialsInner() {
  const router = useRouter();
  const [dishes, setDishes]           = useState<MenuItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeDish, setActiveDish]   = useState<MenuItem | null>(null);
  const [today, setToday]             = useState('');
  const [isSunday, setIsSunday]       = useState(false);
  const [timeState, setTimeState]     = useState<'loading' | 'ok' | 'error'>('loading');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const unsub = subscribeSection('specials', list => { setDishes(list); setDataLoading(false); });
    return unsub;
  }, []);

  const fetchTime = useCallback(async () => {
    if (!mountedRef.current) return;
    setTimeState('loading');
    try {
      const t = await getBotswanaTime();
      if (!mountedRef.current) return;
      setToday(t.dayName);
      setIsSunday(t.isSunday);
      setTimeState('ok');
    } catch {
      if (!mountedRef.current) return;
      setToday('');
      setIsSunday(false);
      setTimeState('error');
    }
  }, []);

  useEffect(() => { fetchTime(); }, [fetchTime]);

  const verified = timeState === 'ok';
  const week = [...dishes].sort((a, b) => dayIndex(a.day) - dayIndex(b.day));
  const sundayDishes = week.filter(d => d.sundayAvailable !== false);
  const gridDishes = isSunday ? sundayDishes : week;
  const todayDishes = verified ? (isSunday ? sundayDishes : week.filter(s => s.day === today)) : [];

  const bannerText =
    dataLoading || timeState === 'loading' ? 'Verifying date…'
    : timeState === 'error' ? "Couldn't verify date — tap refresh"
    : isSunday ? 'Sunday — All Specials!'
    : `Today: ${today}`;

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push('/tabs/menu')}>
          <Ionicons name="arrow-back" size={24} color="#1a1612" />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.title}>Weekly Menu</Text>
          <Text style={s.subtitle}>Casa Del Sol</Text>
        </View>
        <View style={{ width: 70 }} />
      </View>

      <View style={[s.dayBanner, timeState === 'error' && s.dayBannerError]}>
        <Ionicons name={timeState === 'error' ? 'warning' : 'calendar'} size={16} color={timeState === 'error' ? RED : '#1a1612'} />
        <Text style={[s.dayLabel, timeState === 'error' && { color: RED }]}>{bannerText}</Text>
        <TouchableOpacity onPress={fetchTime} style={s.refreshBtn}>
          <Ionicons name="refresh" size={16} color={RED} />
        </TouchableOpacity>
      </View>

      {dataLoading ? (
        <View style={s.center}><ActivityIndicator size="large" color={RED} /></View>
      ) : (
        <ScrollView contentContainerStyle={s.list}>
          <Text style={s.weekTitle}>This Week's Menu</Text>

          {verified && isSunday && sundayDishes.length > 0 && (
            <View style={s.sundayTag}>
              <Text style={s.sundayTagTxt}>Sunday Specials</Text>
            </View>
          )}

          <View style={[s.weekGrid, verified && isSunday && s.weekFrame]}>
            {gridDishes.map(dish => {
              const orderable = verified && (isSunday || dish.day === today);
              const isToday = verified && !isSunday && dish.day === today;
              return (
                <View key={dish.id} style={s.weekCellWrap}>
                  {isToday && (
                    <View style={s.todayBar}>
                      <Text style={s.todayBarTxt}>TODAY</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[s.weekCard, isToday && s.weekCardActive, !orderable && s.weekCardDisabled]}
                    onPress={() => { if (orderable) setActiveDish(dish); }}
                    activeOpacity={orderable ? 0.85 : 1}
                  >
                    <Text style={[s.weekDay, isToday && s.weekDayActive]}>{(dish.day || '').slice(0, 3).toUpperCase()}</Text>
                    {dish.images?.[0]
                      ? <Image source={{ uri: dish.images[0] }} style={s.weekImg} resizeMode="cover" />
                      : <View style={[s.weekImg, s.weekImgEmpty]}><Ionicons name="image-outline" size={20} color="#ccc" /></View>}
                    <Text style={[s.weekName, isToday && s.weekNameActive]} numberOfLines={2}>{dish.name}</Text>
                    <Text style={[s.weekPrice, isToday && s.weekPriceActive]}>P {dish.price}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {verified && todayDishes.length > 0 && (
            <>
              <Text style={s.featuredTitle}>{isSunday ? 'All Specials' : `Today's Special`}</Text>
              {todayDishes.map(dish => (
                <TouchableOpacity key={dish.id} style={s.card} onPress={() => setActiveDish(dish)} activeOpacity={0.88}>
                  <View style={s.cardImgWrap}>
                    {dish.images?.[0]
                      ? <Image source={{ uri: dish.images[0] }} style={s.cardImg} resizeMode="cover" />
                      : <View style={[s.cardImg, s.cardImgEmpty]}><Ionicons name="image-outline" size={40} color="#ccc" /></View>}
                  </View>
                  <View style={s.cardBody}>
                    <Text style={s.cardDay}>{dish.day}</Text>
                    <Text style={s.cardName}>{dish.name}</Text>
                    <Text style={s.cardDesc} numberOfLines={2}>{dish.description}</Text>
                    <Text style={s.cardPrice}>P {dish.price}.00</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {verified && todayDishes.length === 0 && (
            <View style={s.emptyWrap}>
              <Ionicons name="moon-outline" size={48} color={RED} />
              <Text style={s.emptyText}>{isSunday ? 'No specials available today.' : 'No specials today. Check back tomorrow!'}</Text>
            </View>
          )}

          {timeState === 'error' && (
            <View style={s.emptyWrap}>
              <Ionicons name="cloud-offline-outline" size={48} color={RED} />
              <Text style={s.emptyText}>Couldn't verify today's date. Ordering is locked until we confirm the date.</Text>
              <TouchableOpacity style={s.retryBtn} onPress={fetchTime}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={s.retryBtnTxt}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      )}

      <DishModal dish={activeDish} onClose={() => setActiveDish(null)} />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: YELLOW },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  backBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6, width: 70 },
  backText:     { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title:        { fontSize: 18, fontWeight: '800', color: '#1a1612', textAlign: 'center' },
  subtitle:     { fontSize: 11, color: RED, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center' },
  dayBanner:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginTop: 12, marginBottom: 4, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: YELLOW },
  dayBannerError:{ borderColor: RED, backgroundColor: '#fff5f5' },
  dayLabel:     { flex: 1, fontSize: 14, fontWeight: '700', color: '#1a1612' },
  refreshBtn:   { padding: 4 },
  center:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyWrap:    { alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, paddingVertical: 32 },
  emptyText:    { fontSize: 15, fontWeight: '600', color: '#1a1612', textAlign: 'center' },
  retryBtn:     { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: RED, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  retryBtnTxt:  { fontSize: 14, fontWeight: '800', color: '#fff' },
  weekTitle:    { fontSize: 15, fontWeight: '800', color: '#1a1612', marginBottom: 12, marginTop: 4 },
  featuredTitle:{ fontSize: 15, fontWeight: '800', color: '#1a1612', marginBottom: 12, marginTop: 8 },
  weekGrid:     { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'stretch', gap: 10, marginBottom: 20 },
  weekFrame:    { borderWidth: 2, borderColor: RED, borderRadius: 16, padding: 10, backgroundColor: 'rgba(182,0,21,0.03)' },
  sundayTag:    { alignSelf: 'center', backgroundColor: RED, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 7, marginBottom: 10 },
  sundayTagTxt: { fontSize: 12, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  weekCellWrap: { width: '30%' },
  todayBar:     { backgroundColor: RED, borderTopLeftRadius: 10, borderTopRightRadius: 10, alignItems: 'center', paddingVertical: 3 },
  todayBarTxt:  { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  weekCard:     { width: '100%', backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', alignItems: 'center', paddingBottom: 10, elevation: 2 },
  weekCardActive:{ borderWidth: 2, borderColor: RED, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  weekCardDisabled:{ opacity: 0.55 },
  weekImg:      { width: '100%', height: 64, marginBottom: 6 },
  weekImgEmpty: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5eec9' },
  weekDay:      { fontSize: 9, fontWeight: '900', color: '#aaa', letterSpacing: 1, marginTop: 8, marginBottom: 2 },
  weekDayActive:{ color: RED },
  weekName:     { fontSize: 11, fontWeight: '700', color: '#1a1612', textAlign: 'center', paddingHorizontal: 6, lineHeight: 15, minHeight: 30 },
  weekNameActive:{ color: RED },
  weekPrice:    { fontSize: 12, fontWeight: '800', color: '#888', marginTop: 4 },
  weekPriceActive:{ color: RED },
  list:         { paddingHorizontal: 16, paddingTop: 12 },
  card:         { backgroundColor: '#fff', borderRadius: 18, marginBottom: 20, overflow: 'hidden', elevation: 2 },
  cardImgWrap:  { width: '100%', height: Math.round((SW - 40) * 0.6) },
  cardImg:      { width: '100%', height: '100%' },
  cardImgEmpty: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5eec9' },
  cardBody:     { padding: 16 },
  cardDay:      { fontSize: 11, fontWeight: '700', color: RED, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 },
  cardName:     { fontSize: 17, fontWeight: '800', color: '#1a1612', marginBottom: 4 },
  cardDesc:     { fontSize: 13, color: '#6b6b6b', lineHeight: 19, marginBottom: 8 },
  cardPrice:    { fontSize: 16, fontWeight: '800', color: RED },
});

const modal = StyleSheet.create({
  backdrop:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  imageBox:     { width: SW, height: SW, backgroundColor: '#eee', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  imgEmpty:     { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  navBtn:       { position: 'absolute', top: '50%', marginTop: -22, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backBtn:      { position: 'absolute', top: 14, right: 14, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, elevation: 6, zIndex: 10 },
  backBtnText:  { fontSize: 14, fontWeight: '700', color: '#1a1612' },
  body:         { padding: 20, paddingBottom: 40 },
  name:         { fontSize: 20, fontWeight: '800', color: '#1a1612', marginBottom: 8 },
  desc:         { fontSize: 14, color: '#6b6b6b', lineHeight: 22, marginBottom: 16 },
  priceRow:     { marginBottom: 16 },
  price:        { fontSize: 22, fontWeight: '800', color: RED },
  addBtn:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: YELLOW, borderRadius: 14, paddingVertical: 16, marginBottom: 24 },
  addBtnTxt:    { fontSize: 16, fontWeight: '800', color: '#1a1612' },
  cartControls: { gap: 10, marginBottom: 28 },
  removeBtn:    { alignItems: 'center', justifyContent: 'center', backgroundColor: RED, borderRadius: 14, paddingVertical: 14 },
  removeBtnTxt: { fontSize: 15, fontWeight: '800', color: '#fff' },
  qtyRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, backgroundColor: YELLOW, borderRadius: 14, paddingVertical: 16 },
  qtyBtn:       { padding: 12 },
  qtyText:      { fontSize: 22, fontWeight: '800', color: '#1a1612', minWidth: 32, textAlign: 'center' },
});

export default function WeeklySpecials() {
  return (
    <SpecialsErrorBoundary>
      <WeeklySpecialsInner />
    </SpecialsErrorBoundary>
  );
}