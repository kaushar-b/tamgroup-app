import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<'pickup' | 'delivery' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'on_delivery' | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = orderType === 'delivery' ? 30 : 0;
  const grandTotal = total + deliveryFee;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!orderType) e.orderType = 'Please select Pick Up or Delivery';
    if (orderType === 'delivery' && !paymentMethod) e.paymentMethod = 'Please select a payment method';
    if (!name.trim()) e.name = 'Full name is required';
    if (!phone.trim()) e.phone = 'Phone number is required';
    if (orderType === 'delivery' && !address1.trim()) e.address1 = 'Address is required for delivery';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    Alert.alert(
      'Order Placed!',
      orderType === 'pickup' ? 'Your order will be ready for pick up in about 15 minutes!' : 'Your order is being prepared and will be on its way soon!',
      [{ text: 'OK', onPress: () => { clearCart(); router.replace('/tabs'); } }]
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.container}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#1a1612" />
          </TouchableOpacity>
          <Text style={s.title}>Checkout</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 130 }}>

          <Text style={s.sectionLabel}>How would you like your order?</Text>
          {errors.orderType ? <Text style={s.fieldError}>{errors.orderType}</Text> : null}
          <View style={s.toggleRow}>
            <TouchableOpacity style={[s.toggleBtn, orderType === 'pickup' && s.toggleActive]} onPress={() => { setOrderType('pickup'); setErrors(e => ({ ...e, orderType: '' })); }}>
              <Ionicons name="storefront" size={28} color={orderType === 'pickup' ? '#fff' : '#CE6F79'} />
              <Text style={[s.toggleTitle, orderType === 'pickup' && s.toggleTitleActive]}>Pick Up</Text>
              <Text style={[s.toggleSub, orderType === 'pickup' && s.toggleSubActive]}>Collect from restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.toggleBtn, orderType === 'delivery' && s.toggleActive]} onPress={() => { setOrderType('delivery'); setErrors(e => ({ ...e, orderType: '' })); }}>
              <Ionicons name="car-sport" size={28} color={orderType === 'delivery' ? '#fff' : '#CE6F79'} />
              <Text style={[s.toggleTitle, orderType === 'delivery' && s.toggleTitleActive]}>Delivery</Text>
              <Text style={[s.toggleSub, orderType === 'delivery' && s.toggleSubActive]}>+P30 delivery fee</Text>
            </TouchableOpacity>
          </View>

          {orderType === 'delivery' && (
            <>
              <Text style={s.sectionLabel}>Payment Method</Text>
              {errors.paymentMethod ? <Text style={s.fieldError}>{errors.paymentMethod}</Text> : null}
              <TouchableOpacity
                style={[s.payBtn, paymentMethod === 'online' && s.payBtnActive, { backgroundColor: paymentMethod === 'online' ? '#CE6F79' : '#FADAD9', borderColor: paymentMethod === 'online' ? '#CE6F79' : '#F3C3C5' }]}
                onPress={() => { setPaymentMethod('online'); setErrors(e => ({ ...e, paymentMethod: '' })); }}
              >
                <Ionicons name="card" size={22} color={paymentMethod === 'online' ? '#fff' : '#CE6F79'} />
                <Text style={[s.payBtnText, { color: paymentMethod === 'online' ? '#fff' : '#1a1612' }]}>Pay Online</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.payBtn, { marginTop: 10, backgroundColor: paymentMethod === 'on_delivery' ? '#1a1612' : '#FADAD9', borderColor: paymentMethod === 'on_delivery' ? '#1a1612' : '#F3C3C5' }]}
                onPress={() => { setPaymentMethod('on_delivery'); setErrors(e => ({ ...e, paymentMethod: '' })); }}
              >
                <Ionicons name="wallet" size={22} color={paymentMethod === 'on_delivery' ? '#fff' : '#CE6F79'} />
                <Text style={[s.payBtnText, { color: paymentMethod === 'on_delivery' ? '#fff' : '#1a1612' }]}>Pay on Delivery</Text>
              </TouchableOpacity>
            </>
          )}

          <Text style={s.sectionLabel}>Your Details</Text>
          <View style={s.inputGroup}>
            <View style={s.inputWrap}>
              <Text style={s.inputLabel}>Full Name *</Text>
              <TextInput style={[s.input, errors.name && s.inputError]} value={name} onChangeText={v => { setName(v); setErrors(e => ({ ...e, name: '' })); }} placeholder="e.g. John Doe" placeholderTextColor="#9b7b7e" />
              {errors.name ? <Text style={s.fieldError}>{errors.name}</Text> : null}
            </View>
            <View style={[s.inputWrap, s.inputBorder]}>
              <Text style={s.inputLabel}>Phone Number (Botswana) *</Text>
              <View style={s.phoneRow}>
                <View style={s.phonePrefix}><Text style={s.phonePrefixText}>🇧🇼 +267</Text></View>
                <TextInput style={[s.input, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0 }, errors.phone && s.inputError]} value={phone} onChangeText={v => { setPhone(v); setErrors(e => ({ ...e, phone: '' })); }} placeholder="71 234 567" placeholderTextColor="#9b7b7e" keyboardType="phone-pad" maxLength={9} />
              </View>
              {errors.phone ? <Text style={s.fieldError}>{errors.phone}</Text> : null}
            </View>
          </View>

          {orderType === 'delivery' && (
            <>
              <Text style={s.sectionLabel}>Delivery Address</Text>
              <View style={s.inputGroup}>
                <View style={s.inputWrap}>
                  <Text style={s.inputLabel}>Address Line 1 *</Text>
                  <TextInput style={[s.input, errors.address1 && s.inputError]} value={address1} onChangeText={v => { setAddress1(v); setErrors(e => ({ ...e, address1: '' })); }} placeholder="House/Plot No, Street Name" placeholderTextColor="#9b7b7e" />
                  {errors.address1 ? <Text style={s.fieldError}>{errors.address1}</Text> : null}
                </View>
                <View style={[s.inputWrap, s.inputBorder]}>
                  <Text style={s.inputLabel}>Address Line 2</Text>
                  <TextInput style={s.input} value={address2} onChangeText={setAddress2} placeholder="Area / Suburb (optional)" placeholderTextColor="#9b7b7e" />
                </View>
                <View style={[s.inputWrap, s.inputBorder]}>
                  <Text style={s.inputLabel}>City</Text>
                  <TextInput style={s.input} value={city} onChangeText={setCity} placeholder="e.g. Gaborone" placeholderTextColor="#9b7b7e" />
                </View>
              </View>
            </>
          )}

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
            {orderType === 'delivery' && (
              <View style={s.summaryRow}>
                <Text style={s.summaryItem}>Delivery Fee</Text>
                <Text style={s.summaryPrice}>P {deliveryFee}.00</Text>
              </View>
            )}
            <View style={s.summaryDivider} />
            <View style={s.summaryRow}>
              <Text style={s.summaryTotal}>Total</Text>
              <Text style={s.summaryTotalAmt}>P {grandTotal}.00</Text>
            </View>
          </View>
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity style={s.placeBtn} onPress={handlePlaceOrder}>
            <Ionicons name="checkmark-circle" size={20} color="#1a1612" />
            <Text style={s.placeBtnText}>Place Order — P {grandTotal}.00</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#fff' },
  header:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, gap: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3C3C5' },
  backBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center' },
  title:             { fontSize: 22, fontWeight: '800', color: '#1a1612' },
  sectionLabel:      { fontSize: 15, fontWeight: '700', color: '#1a1612', marginBottom: 8, marginTop: 8 },
  fieldError:        { fontSize: 12, color: '#D10000', marginBottom: 6 },
  toggleRow:         { flexDirection: 'row', gap: 12, marginBottom: 24 },
  toggleBtn:         { flex: 1, alignItems: 'center', padding: 18, borderRadius: 16, backgroundColor: '#FADAD9', borderWidth: 2, borderColor: 'transparent', gap: 6 },
  toggleActive:      { backgroundColor: '#CE6F79', borderColor: '#CE6F79' },
  toggleTitle:       { fontSize: 16, fontWeight: '800', color: '#CE6F79' },
  toggleTitleActive: { color: '#fff' },
  toggleSub:         { fontSize: 12, color: '#CE6F79', textAlign: 'center' },
  toggleSubActive:   { color: 'rgba(255,255,255,0.85)' },
  inputGroup:        { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F3C3C5' },
  inputWrap:         { padding: 14 },
  inputBorder:       { borderTopWidth: 1, borderTopColor: '#F3C3C5' },
  inputLabel:        { fontSize: 12, fontWeight: '600', color: '#CE6F79', marginBottom: 8 },
  input:             { fontSize: 15, color: '#1a1612', backgroundColor: '#FADAD9', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#F3C3C5' },
  inputError:        { borderColor: '#D10000' },
  phoneRow:          { flexDirection: 'row' },
  phonePrefix:       { backgroundColor: '#FADAD9', borderWidth: 1, borderColor: '#F3C3C5', borderRadius: 10, borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: 12, paddingHorizontal: 14, justifyContent: 'center' },
  phonePrefixText:   { fontSize: 15, fontWeight: '600', color: '#1a1612' },
  summaryBox:        { backgroundColor: '#FADAD9', borderRadius: 16, padding: 16, marginBottom: 20 },
  summaryRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItem:       { fontSize: 14, color: '#6b6b6b' },
  summaryPrice:      { fontSize: 14, fontWeight: '600', color: '#1a1612' },
  summaryDivider:    { height: 1, backgroundColor: '#F3C3C5', marginVertical: 6 },
  summaryTotal:      { fontSize: 16, fontWeight: '800', color: '#1a1612' },
  summaryTotalAmt:   { fontSize: 16, fontWeight: '800', color: '#CE6F79' },
  footer:            { padding: 20, paddingBottom: 36, borderTopWidth: 1, borderTopColor: '#F3C3C5', backgroundColor: '#fff' },
  placeBtn:          { backgroundColor: '#FFDD32', borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeBtnText:      { fontSize: 16, fontWeight: '700', color: '#1a1612' },
  payBtn:            { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, borderWidth: 2, marginBottom: 4 },
  payBtnActive:      { },
  payBtnText:        { fontSize: 15, fontWeight: '700' },
});
