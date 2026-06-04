import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../constants/Colors';
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
      orderType === 'pickup'
        ? 'Your order will be ready for pick up in about 15 minutes!'
        : 'Your order is being prepared and will be on its way soon!',
      [{ text: 'OK', onPress: () => { clearCart(); router.replace('/tabs/orders'); } }]
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={22} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>

          {/* Order Type */}
          <Text style={styles.sectionLabel}>How would you like your order?</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, orderType === 'pickup' && styles.toggleActive]}
              onPress={() => setOrderType('pickup')}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Ionicons name="storefront" size={28} color={orderType === 'pickup' ? Colors.white : Colors.grey} />
              <Text style={[styles.toggleTitle, orderType === 'pickup' && styles.toggleTitleActive]}>Pick Up</Text>
              <Text style={[styles.toggleSub, orderType === 'pickup' && styles.toggleSubActive]}>Collect from restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, orderType === 'delivery' && styles.toggleActive]}
              onPress={() => setOrderType('delivery')}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            >
              <Ionicons name="bicycle" size={28} color={orderType === 'delivery' ? Colors.white : Colors.grey} />
              <Text style={[styles.toggleTitle, orderType === 'delivery' && styles.toggleTitleActive]}>Delivery</Text>
              <Text style={[styles.toggleSub, orderType === 'delivery' && styles.toggleSubActive]}>+P30 delivery fee</Text>
            </TouchableOpacity>
          </View>

          {/* Contact */}
          <Text style={styles.sectionLabel}>Your Details</Text>
          <View style={styles.inputGroup}>
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. John Doe" placeholderTextColor={Colors.grey} />
            </View>
            <View style={[styles.inputWrap, { borderTopWidth: 1, borderTopColor: Colors.border }]}>
              <Text style={styles.inputLabel}>Phone Number (Botswana) *</Text>
              <View style={styles.phoneRow}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>🇧🇼 +267</Text>
                </View>
                <TextInput
                  style={[styles.input, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="71 234 567"
                  placeholderTextColor={Colors.grey}
                  keyboardType="phone-pad"
                  maxLength={9}
                />
              </View>
            </View>
          </View>

          {/* Delivery Address */}
          {orderType === 'delivery' && (
            <>
              <Text style={styles.sectionLabel}>Delivery Address</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Address Line 1 *</Text>
                  <TextInput style={styles.input} value={address1} onChangeText={setAddress1} placeholder="House/Plot No, Street Name" placeholderTextColor={Colors.grey} />
                </View>
                <View style={[styles.inputWrap, { borderTopWidth: 1, borderTopColor: Colors.border }]}>
                  <Text style={styles.inputLabel}>Address Line 2</Text>
                  <TextInput style={styles.input} value={address2} onChangeText={setAddress2} placeholder="Area / Suburb (optional)" placeholderTextColor={Colors.grey} />
                </View>
                <View style={[styles.inputWrap, { borderTopWidth: 1, borderTopColor: Colors.border }]}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="e.g. Gaborone" placeholderTextColor={Colors.grey} />
                </View>
              </View>
            </>
          )}

          {/* Order Summary */}
          <Text style={styles.sectionLabel}>Order Summary</Text>
          <View style={styles.summaryBox}>
            {items.map(item => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={styles.summaryItem}>{item.name} × {item.quantity}</Text>
                <Text style={styles.summaryPrice}>P {item.price * item.quantity}.00</Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryItem}>Subtotal</Text>
              <Text style={styles.summaryPrice}>P {total}.00</Text>
            </View>
            {orderType === 'delivery' && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryItem}>Delivery Fee</Text>
                <Text style={styles.summaryPrice}>P {deliveryFee}.00</Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total</Text>
              <Text style={styles.summaryTotalAmt}>P {grandTotal}.00</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.black} />
            <Text style={styles.placeBtnText}>Place Order — P {grandTotal}.00</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: Colors.white },
  header:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, gap: 12 },
  backBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  title:             { fontSize: 22, fontWeight: '800', color: Colors.black },
  scroll:            { flex: 1 },
  sectionLabel:      { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 12, marginTop: 4 },
  toggleRow:         { flexDirection: 'row', gap: 12, marginBottom: 24 },
  toggleBtn:         { flex: 1, alignItems: 'center', padding: 18, borderRadius: 16, backgroundColor: Colors.lightGrey, borderWidth: 2, borderColor: 'transparent', gap: 6 },
  toggleActive:      { backgroundColor: Colors.pink, borderColor: Colors.pink },
  toggleTitle:       { fontSize: 16, fontWeight: '800', color: Colors.grey },
  toggleTitleActive: { color: Colors.white },
  toggleSub:         { fontSize: 12, color: Colors.grey, textAlign: 'center' },
  toggleSubActive:   { color: 'rgba(255,255,255,0.8)' },
  inputGroup:        { backgroundColor: Colors.lightGrey, borderRadius: 16, marginBottom: 20, overflow: 'hidden' },
  inputWrap:         { padding: 14 },
  inputLabel:        { fontSize: 12, fontWeight: '600', color: Colors.grey, marginBottom: 8 },
  input:             { fontSize: 15, color: Colors.black, backgroundColor: Colors.white, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.border },
  phoneRow:          { flexDirection: 'row', alignItems: 'center', gap: 0 },
  phonePrefix:       { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: 12, paddingHorizontal: 14 },
  phonePrefixText:   { fontSize: 15, fontWeight: '600', color: Colors.black },
  summaryBox:        { backgroundColor: Colors.lightGrey, borderRadius: 16, padding: 16, marginBottom: 20 },
  summaryRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItem:       { fontSize: 14, color: Colors.grey },
  summaryPrice:      { fontSize: 14, fontWeight: '600', color: Colors.black },
  summaryDivider:    { height: 1, backgroundColor: Colors.border, marginVertical: 6 },
  summaryTotal:      { fontSize: 16, fontWeight: '800', color: Colors.black },
  summaryTotalAmt:   { fontSize: 16, fontWeight: '800', color: Colors.pink },
  footer:            { padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.white },
  placeBtn:          { backgroundColor: Colors.yellow, borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeBtnText:      { fontSize: 16, fontWeight: '700', color: Colors.black },
});
