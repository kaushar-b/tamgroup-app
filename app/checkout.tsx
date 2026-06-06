import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<'pickup' | 'delivery' | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');

  const deliveryFee = orderType === 'delivery' ? 30 : 0;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = () => {
    if (!orderType) { Alert.alert('Select Order Type', 'Please choose Pickup or Delivery.'); return; }
    if (!name.trim()) { Alert.alert('Missing Info', 'Please enter your full name.'); return; }
    if (!phone.trim()) { Alert.alert('Missing Info', 'Please enter your phone number.'); return; }
    if (orderType === 'delivery' && !address1.trim()) { Alert.alert('Missing Info', 'Please enter your delivery address.'); return; }
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
          <View style={s.toggleRow}>
            <TouchableOpacity style={[s.toggleBtn, orderType === 'pickup' && s.toggleActive]} onPress={() => setOrderType('pickup')}>
              <Ionicons name="storefront" size={28} color={orderType === 'pickup' ? '#fff' : '#6b6b6b'} />
              <Text style={[s.toggleTitle, orderType === 'pickup' && s.toggleTitleActive]}>Pick Up</Text>
              <Text style={[s.toggleSub, orderType === 'pickup' && s.toggleSubActive]}>Collect from restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.toggleBtn, orderType === 'delivery' && s.toggleActive]} onPress={() => setOrderType('delivery')}>
              <Ionicons name="bicycle" size={28} color={orderType === 'delivery' ? '#fff' : '#6b6b6b'} />
              <Text style={[s.toggleTitle, orderType === 'delivery' && s.toggleTitleActive]}>Delivery</Text>
              <Text style={[s.toggleSub, orderType === 'delivery' && s.toggleSubActive]}>+P30 delivery fee</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.sectionLabel}>Your Details</Text>
          <View style={s.inputGroup}>
            <View style={s.inputWrap}>
              <Text style={s.inputLabel}>Full Name *</Text>
              <TextInput style={s.input} value={name} onChangeText={setName} placeholder="e.g. John Doe" placeholderTextColor="#6b6b6b" />
            </View>
            <View style={[s.inputWrap, s.inputBorder]}>
              <Text style={s.inputLabel}>Phone Number (Botswana) *</Text>
              <View style={s.phoneRow}>
                <View style={s.phonePrefix}><Text style={s.phonePrefixText}>🇧🇼 +267</Text></View>
                <TextInput style={[s.input, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0 }]} value={phone} onChangeText={setPhone} placeholder="71 234 567" placeholderTextColor="#6b6b6b" keyboardType="phone-pad" maxLength={9} />
              </View>
            </View>
          </View>

          {orderType === 'delivery' && (
            <>
              <Text style={s.sectionLabel}>Delivery Address</Text>
              <View style={s.inputGroup}>
                <View style={s.inputWrap}>
                  <Text style={s.inputLabel}>Address Line 1 *</Text>
                  <TextInput style={s.input} value={address1} onChangeText={setAddress1} placeholder="House/Plot No, Street Name" placeholderTextColor="#6b6b6b" />
                </View>
                <View style={[s.inputWrap, s.inputBorder]}>
                  <Text style={s.inputLabel}>Address Line 2</Text>
                  <TextInput style={s.input} value={address2} onChangeText={setAddress2} placeholder="Area / Suburb (optional)" placeholderTextColor="#6b6b6b" />
                </View>
                <View style={[s.inputWrap, s.inputBorder]}>
                  <Text style={s.inputLabel}>City</Text>
                  <TextInput style={s.input} value={city} onChangeText={setCity} placeholder="e.g. Gaborone" placeholderTextColor="#6b6b6b" />
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
  header:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, gap: 12 },
  backBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  title:             { fontSize: 22, fontWeight: '800', color: '#1a1612' },
  sectionLabel:      { fontSize: 15, fontWeight: '700', color: '#1a1612', marginBottom: 12, marginTop: 8 },
  toggleRow:         { flexDirection: 'row', gap: 12, marginBottom: 24 },
  toggleBtn:         { flex: 1, alignItems: 'center', padding: 18, borderRadius: 16, backgroundColor: '#f5f5f5', borderWidth: 2, borderColor: 'transparent', gap: 6 },
  toggleActive:      { backgroundColor: '#FBA4AD', borderColor: '#FBA4AD' },
  toggleTitle:       { fontSize: 16, fontWeight: '800', color: '#6b6b6b' },
  toggleTitleActive: { color: '#fff' },
  toggleSub:         { fontSize: 12, color: '#6b6b6b', textAlign: 'center' },
  toggleSubActive:   { color: 'rgba(255,255,255,0.85)' },
  inputGroup:        { backgroundColor: '#f5f5f5', borderRadius: 16, marginBottom: 20, overflow: 'hidden' },
  inputWrap:         { padding: 14 },
  inputBorder:       { borderTopWidth: 1, borderTopColor: '#efefef' },
  inputLabel:        { fontSize: 12, fontWeight: '600', color: '#6b6b6b', marginBottom: 8 },
  input:             { fontSize: 15, color: '#1a1612', backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#efefef' },
  phoneRow:          { flexDirection: 'row' },
  phonePrefix:       { backgroundColor: '#fff', borderWidth: 1, borderColor: '#efefef', borderRadius: 10, borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: 12, paddingHorizontal: 14, justifyContent: 'center' },
  phonePrefixText:   { fontSize: 15, fontWeight: '600', color: '#1a1612' },
  summaryBox:        { backgroundColor: '#f5f5f5', borderRadius: 16, padding: 16, marginBottom: 20 },
  summaryRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItem:       { fontSize: 14, color: '#6b6b6b' },
  summaryPrice:      { fontSize: 14, fontWeight: '600', color: '#1a1612' },
  summaryDivider:    { height: 1, backgroundColor: '#efefef', marginVertical: 6 },
  summaryTotal:      { fontSize: 16, fontWeight: '800', color: '#1a1612' },
  summaryTotalAmt:   { fontSize: 16, fontWeight: '800', color: '#FBA4AD' },
  footer:            { padding: 20, paddingBottom: 36, borderTopWidth: 1, borderTopColor: '#efefef', backgroundColor: '#fff' },
  placeBtn:          { backgroundColor: '#FFDD32', borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeBtnText:      { fontSize: 16, fontWeight: '700', color: '#1a1612' },
});
