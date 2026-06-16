import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';
import { ref, push, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { getBotswanaTime } from '../lib/getBotswanaTime';
import { registerForPushToken } from '../lib/notifications';

const RED    = '#b60015';
const YELLOW = '#FFD544';
const VAT_RATE = 0.14;

// ─────────────────────────────────────────────────────────────
// RESTAURANT HOURS — change these if opening/closing times change
// Uses real Gaborone time fetched from internet (spoof-proof).
const OPEN_HOUR  = 7;   // 7:00 AM
const CLOSE_HOUR = 22;  // 10:00 PM  ← change this number to adjust closing time
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────
// DELIVERY FEE — change this number to adjust
const DELIVERY_FEE = 30;
// ─────────────────────────────────────────────

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [orderType, setOrderType]         = useState<'pickup' | 'delivery' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'on_delivery' | null>(null);
  const [tip, setTip]                     = useState<number | null>(null);
  const [name, setName]                   = useState('');
  const [phone, setPhone]                 = useState('');
  const [address1, setAddress1]           = useState('');
  const [address2, setAddress2]           = useState('');
  const [city, setCity]                   = useState('');
  const [errors, setErrors]               = useState<Record<string, string>>({});
  const [orderPlaced, setOrderPlaced]     = useState(false);
  const [placing, setPlacing]             = useState(false);
  const [orderType2, setOrderType2]       = useState<'pickup' | 'delivery' | null>(null);

  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const vatAmount   = Math.round(total * VAT_RATE);
  const grandTotal  = total + deliveryFee + vatAmount + (tip ?? 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!orderType) e.orderType = 'Please select Pick Up or Delivery';
    if (orderType === 'delivery' && !paymentMethod) e.paymentMethod = 'Please select a payment method';
    if (!name.trim()) e.name = 'Full name is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    if (phone.length !== 8) e.phone = 'Phone number must be 8 digits';
    if (orderType === 'delivery' && !address1.trim()) e.address1 = 'Address is required for delivery';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);

    // ── Check real Gaborone time before allowing order ──
    try {
      const bwTime = await getBotswanaTime();
      if (bwTime.hour < OPEN_HOUR || bwTime.hour >= CLOSE_HOUR) {
        setPlacing(false);
        Alert.alert(
          'We\'re Closed for the Night',
          `Sorry, we're not taking orders right now.\n\nWe're open daily from 7:00 AM to 10:00 PM.\n\nCome back tomorrow — we'd love to serve you! 😊`,
          [{ text: 'Got it', style: 'cancel' }]
        );
        return;
      }
    } catch {
      // If time check fails entirely, allow the order through
    }

    try {
      const ordersRef   = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      const orderId     = newOrderRef.key!;
      const customerPushToken = await registerForPushToken();

      const orderData = {
        id: orderId,
        date: new Date().toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        orderType: orderType!,
        name,
        phone: `+267${phone}`,
        address: orderType === 'delivery'
          ? `${address1}${address2 ? ', ' + address2 : ''}${city ? ', ' + city : ''}`
          : '',
        paymentMethod: orderType === 'delivery' ? paymentMethod : null,
        tip: tip ?? 0,
        items: items.map(i => ({
          id: i.id, name: i.name, price: i.price,
          quantity: i.quantity, icon: i.icon || 'restaurant',
        })),
        subtotal: total,
        vatAmount,
        deliveryFee,
        total: grandTotal,
        status: 'pending',
        assignedToDriver: false,
        driverStatus: null,
        preparingStatus: null,
        customerPushToken,
        createdAt: Date.now(),
      };

      await set(newOrderRef, orderData);
      setOrderType2(orderType);
      clearCart();
      setPlacing(false);
      setOrderPlaced(true);
    } catch {
      setPlacing(false);
      Alert.alert('Error', 'Could not place order. Please try again.');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // ORDER CONFIRMED SCREEN
  // "Track Your Order" button leads to the orders page.
  // The message below can be edited here:
  const pickupMessage  = 'Your order will be ready for pick up shortly!';
  const deliveryMessage = 'Your order will be delivered shortly!';
  // ─────────────────────────────────────────────────────────────

  if (orderPlaced) {
    return (
      <View style={s.confirmContainer}>
        <View style={s.confirmBox}>
          <Ionicons name="checkmark-circle" size={72} color={RED} />
          <Text style={s.confirmTitle}>Order Placed!</Text>
          <Text style={s.confirmSub}>
            {orderType2 === 'pickup' ? pickupMessage : deliveryMessage}
          </Text>
          <TouchableOpacity style={s.confirmBtn} onPress={() => router.replace('/tabs')}>
            <Text style={s.confirmBtnText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.ordersBtn} onPress={() => router.replace('/tabs/orders')}>
            <Ionicons name="navigate" size={16} color={RED} />
            <Text style={s.ordersBtnText}>Track Your Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1a1612" />
          </TouchableOpacity>
          <Text style={s.title}>Checkout</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }}>

          {/* Order Type */}
          <Text style={s.sectionLabel}>How would you like your order?</Text>
          {errors.orderType ? <Text style={s.fieldError}>{errors.orderType}</Text> : null}
          <View style={s.toggleRow}>
            <TouchableOpacity style={[s.toggleBtn, orderType === 'pickup' && s.toggleActive]}
              onPress={() => { setOrderType('pickup'); setErrors(e => ({ ...e, orderType: '' })); }}>
              <Ionicons name="storefront" size={28} color={orderType === 'pickup' ? '#fff' : RED} />
              <Text style={[s.toggleTitle, orderType === 'pickup' && s.toggleTitleActive]}>Pick Up</Text>
              <Text style={[s.toggleSub, orderType === 'pickup' && s.toggleSubActive]}>Collect from restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.toggleBtn, orderType === 'delivery' && s.toggleActive]}
              onPress={() => { setOrderType('delivery'); setErrors(e => ({ ...e, orderType: '' })); }}>
              <Ionicons name="car-sport" size={28} color={orderType === 'delivery' ? '#fff' : RED} />
              <Text style={[s.toggleTitle, orderType === 'delivery' && s.toggleTitleActive]}>Delivery</Text>
              <Text style={[s.toggleSub, orderType === 'delivery' && s.toggleSubActive]}>+P{DELIVERY_FEE} delivery fee</Text>
            </TouchableOpacity>
          </View>

          {/* Payment */}
          {orderType === 'delivery' && (
            <>
              <Text style={s.sectionLabel}>Payment Method</Text>
              {errors.paymentMethod ? <Text style={s.fieldError}>{errors.paymentMethod}</Text> : null}
              <TouchableOpacity
                style={[s.payBtn, { backgroundColor: paymentMethod === 'online' ? RED : '#fff', borderColor: paymentMethod === 'online' ? RED : '#eee' }]}
                onPress={() => { setPaymentMethod('online'); setErrors(e => ({ ...e, paymentMethod: '' })); }}>
                <Ionicons name="card" size={22} color={paymentMethod === 'online' ? '#fff' : RED} />
                <Text style={[s.payBtnText, { color: paymentMethod === 'online' ? '#fff' : '#1a1612' }]}>Pay Online</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.payBtn, { marginTop: 10, backgroundColor: paymentMethod === 'on_delivery' ? RED : '#fff', borderColor: paymentMethod === 'on_delivery' ? RED : '#eee' }]}
                onPress={() => { setPaymentMethod('on_delivery'); setErrors(e => ({ ...e, paymentMethod: '' })); }}>
                <Ionicons name="wallet" size={22} color={paymentMethod === 'on_delivery' ? '#fff' : RED} />
                <Text style={[s.payBtnText, { color: paymentMethod === 'on_delivery' ? '#fff' : '#1a1612' }]}>Pay on Delivery</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Details */}
          <Text style={s.sectionLabel}>Your Details</Text>
          <View style={s.inputGroup}>
            <View style={s.inputWrap}>
              <Text style={s.inputLabel}>Full Name *</Text>
              <TextInput style={[s.input, errors.name && s.inputError]} value={name}
                onChangeText={v => { setName(v); setErrors(e => ({ ...e, name: '' })); }}
                placeholder="e.g. John Doe" placeholderTextColor="#aaa" />
              {errors.name ? <Text style={s.fieldError}>{errors.name}</Text> : null}
            </View>
            <View style={[s.inputWrap, s.inputBorder]}>
              <Text style={s.inputLabel}>Phone Number (Botswana) *</Text>
              <View style={s.phoneRow}>
                <View style={s.phonePrefix}><Text style={s.phonePrefixText}>+267</Text></View>
                <TextInput
                  style={[s.input, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0 }, errors.phone && s.inputError]}
                  value={phone}
                  onChangeText={v => {
                    const nums = v.replace(/[^0-9]/g, '').slice(0, 8);
                    setPhone(nums);
                    setErrors(e => ({ ...e, phone: '' }));
                  }}
                  placeholder="71234567"
                  placeholderTextColor="#aaa"
                  keyboardType="number-pad"
                  maxLength={8}
                />
              </View>
              {errors.phone ? <Text style={s.fieldError}>{errors.phone}</Text> : null}
            </View>
          </View>

          {/* Delivery Address */}
          {orderType === 'delivery' && (
            <>
              <Text style={s.sectionLabel}>Delivery Address</Text>
              <View style={s.inputGroup}>
                <View style={s.inputWrap}>
                  <Text style={s.inputLabel}>Address Line 1 *</Text>
                  <TextInput style={[s.input, errors.address1 && s.inputError]} value={address1}
                    onChangeText={v => { setAddress1(v); setErrors(e => ({ ...e, address1: '' })); }}
                    placeholder="House/Plot No, Street Name" placeholderTextColor="#aaa" />
                  {errors.address1 ? <Text style={s.fieldError}>{errors.address1}</Text> : null}
                </View>
                <View style={[s.inputWrap, s.inputBorder]}>
                  <Text style={s.inputLabel}>Address Line 2</Text>
                  <TextInput style={s.input} value={address2} onChangeText={setAddress2}
                    placeholder="Area / Suburb (optional)" placeholderTextColor="#aaa" />
                </View>
                <View style={[s.inputWrap, s.inputBorder]}>
                  <Text style={s.inputLabel}>City</Text>
                  <TextInput style={s.input} value={city} onChangeText={setCity}
                    placeholder="e.g. Gaborone" placeholderTextColor="#aaa" />
                </View>
              </View>
            </>
          )}

          {/* Tip */}
          <Text style={s.sectionLabel}>Want to Tip the Driver?</Text>
          <View style={s.tipRow}>
            <TouchableOpacity style={[s.tipBtn, tip === null && s.tipBtnActive]} onPress={() => setTip(null)}>
              <Ionicons name="remove-circle-outline" size={24} color={tip === null ? '#fff' : RED} />
            </TouchableOpacity>
            {[5, 10, 20].map(amt => (
              <TouchableOpacity key={amt} style={[s.tipBtn, tip === amt && s.tipBtnActive]} onPress={() => setTip(amt)}>
                <Text style={[s.tipBtnText, tip === amt && s.tipBtnTextActive]}>P{amt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary */}
          <Text style={s.sectionLabel}>Order Summary</Text>
          <View style={s.summaryBox}>
            {items.map(item => (
              <View key={item.id} style={s.summaryRow}>
                <Text style={s.summaryItem}>{item.name} × {item.quantity}</Text>
                <Text style={s.summaryPrice}>P {item.price * item.quantity}.00</Text>
              </View>
            ))}
            <View style={s.summaryDivider} />
            <View style={s.summaryRow}>
              <Text style={s.summaryItem}>Subtotal</Text>
              <Text style={s.summaryPrice}>P {total}.00</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryItem}>VAT (14%)</Text>
              <Text style={s.summaryPrice}>P {vatAmount}.00</Text>
            </View>
            {orderType === 'delivery' && (
              <View style={s.summaryRow}>
                <Text style={s.summaryItem}>Delivery Fee</Text>
                <Text style={s.summaryPrice}>P {deliveryFee}.00</Text>
              </View>
            )}
            {tip ? (
              <View style={s.summaryRow}>
                <Text style={s.summaryItem}>Driver Tip</Text>
                <Text style={s.summaryPrice}>P {tip}.00</Text>
              </View>
            ) : null}
            <View style={s.summaryDivider} />
            <View style={s.summaryRow}>
              <Text style={s.summaryTotal}>Total</Text>
              <Text style={s.summaryTotalAmt}>P {grandTotal}.00</Text>
            </View>
          </View>
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity style={[s.placeBtn, placing && { opacity: 0.6 }]} onPress={handlePlaceOrder} disabled={placing}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={s.placeBtnText}>{placing ? 'Placing Order...' : `Place Order — P ${grandTotal}.00`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#f9f9f9' },
  header:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, gap: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: YELLOW },
  backBtn:           { width: 44, height: 44, borderRadius: 22, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center' },
  title:             { fontSize: 22, fontWeight: '800', color: '#1a1612' },
  sectionLabel:      { fontSize: 15, fontWeight: '700', color: '#1a1612', marginBottom: 8, marginTop: 8 },
  fieldError:        { fontSize: 12, color: RED, marginBottom: 6 },
  toggleRow:         { flexDirection: 'row', gap: 12, marginBottom: 24 },
  toggleBtn:         { flex: 1, alignItems: 'center', padding: 18, borderRadius: 16, backgroundColor: '#fff', borderWidth: 2, borderColor: '#eee', gap: 6, elevation: 1 },
  toggleActive:      { backgroundColor: RED, borderColor: RED },
  toggleTitle:       { fontSize: 16, fontWeight: '800', color: RED },
  toggleTitleActive: { color: '#fff' },
  toggleSub:         { fontSize: 12, color: '#aaa', textAlign: 'center' },
  toggleSubActive:   { color: 'rgba(255,255,255,0.85)' },
  payBtn:            { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, borderWidth: 2, marginBottom: 4 },
  payBtnText:        { fontSize: 15, fontWeight: '700' },
  tipRow:            { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tipBtn:            { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, backgroundColor: '#fff', borderWidth: 2, borderColor: '#eee', elevation: 1 },
  tipBtnActive:      { backgroundColor: RED, borderColor: RED },
  tipBtnText:        { fontSize: 15, fontWeight: '800', color: '#1a1612' },
  tipBtnTextActive:  { color: '#fff' },
  inputGroup:        { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', elevation: 1 },
  inputWrap:         { padding: 14 },
  inputBorder:       { borderTopWidth: 1, borderTopColor: '#eee' },
  inputLabel:        { fontSize: 12, fontWeight: '600', color: RED, marginBottom: 8 },
  input:             { fontSize: 15, color: '#1a1612', backgroundColor: '#fafafa', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#eee' },
  inputError:        { borderColor: RED },
  phoneRow:          { flexDirection: 'row' },
  phonePrefix:       { backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#eee', borderRadius: 10, borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: 12, paddingHorizontal: 14, justifyContent: 'center' },
  phonePrefixText:   { fontSize: 15, fontWeight: '600', color: '#1a1612' },
  summaryBox:        { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#eee', elevation: 1 },
  summaryRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItem:       { fontSize: 14, color: '#6b6b6b', flex: 1, paddingRight: 8 },
  summaryPrice:      { fontSize: 14, fontWeight: '600', color: '#1a1612' },
  summaryDivider:    { height: 1, backgroundColor: YELLOW, marginVertical: 6 },
  summaryTotal:      { fontSize: 16, fontWeight: '800', color: '#1a1612' },
  summaryTotalAmt:   { fontSize: 16, fontWeight: '800', color: RED },
  footer:            { padding: 20, paddingBottom: 36, borderTopWidth: 1, borderTopColor: YELLOW, backgroundColor: '#fff' },
  placeBtn:          { backgroundColor: RED, borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeBtnText:      { fontSize: 16, fontWeight: '700', color: '#fff' },
  confirmContainer:  { flex: 1, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center', padding: 24 },
  confirmBox:        { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', width: '100%', elevation: 4, gap: 12 },
  confirmTitle:      { fontSize: 28, fontWeight: '900', color: '#1a1612', textAlign: 'center' },
  confirmSub:        { fontSize: 15, color: '#6b6b6b', textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  confirmBtn:        { backgroundColor: RED, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, width: '100%', alignItems: 'center' },
  confirmBtnText:    { fontSize: 16, fontWeight: '700', color: '#fff' },
  ordersBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderColor: RED, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40, width: '100%' },
  ordersBtnText:     { fontSize: 15, fontWeight: '700', color: RED },
});
