import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');

  const deliveryFee = orderType === 'delivery' ? 30 : 0;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = () => {
    if (!name.trim() || !phone.trim()) { Alert.alert('Missing Info', 'Please enter your name and phone number.'); return; }
    if (orderType === 'delivery' && !address1.trim()) { Alert.alert('Missing Info', 'Please enter your delivery address.'); return; }
    Alert.alert('Order Placed!', orderType === 'pickup' ? 'Your order will be ready for pick up in about 15 minutes.' : 'Your order is being prepared and will be on its way soon!', [
      { text: 'OK', onPress: () => { clearCart(); router.replace('/tabs/orders'); } }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 20 }}>

        {/* Order Type */}
        <Text style={styles.sectionLabel}>Order Type</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity style={[styles.toggleBtn, orderType === 'pickup' && styles.toggleActive]} onPress={() => setOrderType('pickup')}>
            <Ionicons name="storefront" size={18} color={orderType === 'pickup' ? Colors.white : Colors.grey} />
            <Text style={[styles.toggleText, orderType === 'pickup' && styles.toggleTextActive]}>Pick Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, orderType === 'delivery' && styles.toggleActive]} onPress={() => setOrderType('delivery')}>
            <Ionicons name="bicycle" size={18} color={orderType === 'delivery' ? Colors.white : Colors.grey} />
            <Text style={[styles.toggleText, orderType === 'delivery' && styles.toggleTextActive]}>Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* Contact */}
        <Text style={styles.sectionLabel}>Your Details</Text>
        <View style={styles.inputGroup}>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. John Doe" placeholderTextColor={Colors.grey} />
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="e.g. +267 71 234 567" placeholderTextColor={Colors.grey} keyboardType="phone-pad" />
          </View>
        </View>

        {/* Delivery Address */}
        {orderType === 'delivery' && (
          <>
            <Text style={styles.sectionLabel}>Delivery Address</Text>
            <View style={styles.inputGroup}>
              <View style={styles.inputWrap}>
                <Text style={styles.inputLabel}>Address Line 1 *</Text>
                <TextInput style={styles.input} value={address1} onChangeText={setAddress1} placeholder="House/Unit No, Street" placeholderTextColor={Colors.grey} />
              </View>
              <View style={styles.inputWrap}>
                <Text style={styles.inputLabel}>Address Line 2</Text>
                <TextInput style={styles.input} value={address2} onChangeText={setAddress2} placeholder="Area / Suburb (optional)" placeholderTextColor={Colors.grey} />
              </View>
              <View style={styles.inputWrap}>
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

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.black} />
          <Text style={styles.placeBtnText}>Place Order — P {grandTotal}.00</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.white },
  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, gap: 12 },
  backBtn:          { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.lightGrey, alignItems: 'center', justifyContent: 'center' },
  title:            { fontSize: 22, fontWeight: '800', color: Colors.black },
  scroll:           { flex: 1 },
  sectionLabel:     { fontSize: 15, fontWeight: '700', color: Colors.black, marginBottom: 10, marginTop: 8 },
  toggleRow:        { flexDirection: 'row', gap: 12, marginBottom: 24 },
  toggleBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, backgroundColor: Colors.lightGrey, borderWidth: 2, borderColor: 'transparent' },
  toggleActive:     { backgroundColor: Colors.pink, borderColor: Colors.pink },
  toggleText:       { fontSize: 15, fontWeight: '700', color: Colors.grey },
  toggleTextActive: { color: Colors.white },
  inputGroup:       { backgroundColor: Colors.lightGrey, borderRadius: 16, padding: 4, marginBottom: 20 },
  inputWrap:        { padding: 12 },
  inputLabel:       { fontSize: 12, fontWeight: '600', color: Colors.grey, marginBottom: 6 },
  input:            { fontSize: 15, color: Colors.black, backgroundColor: Colors.white, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.border },
  summaryBox:       { backgroundColor: Colors.lightGrey, borderRadius: 16, padding: 16, marginBottom: 20 },
  summaryRow:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryItem:      { fontSize: 14, color: Colors.grey },
  summaryPrice:     { fontSize: 14, fontWeight: '600', color: Colors.black },
  summaryDivider:   { height: 1, backgroundColor: Colors.border, marginVertical: 6 },
  summaryTotal:     { fontSize: 16, fontWeight: '800', color: Colors.black },
  summaryTotalAmt:  { fontSize: 16, fontWeight: '800', color: Colors.pink },
  footer:           { padding: 20, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.white },
  placeBtn:         { backgroundColor: Colors.yellow, borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeBtnText:     { fontSize: 16, fontWeight: '700', color: Colors.black },
});
