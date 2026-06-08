import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Terms() {
  const router = useRouter();
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1a1612" />
        </TouchableOpacity>
        <Text style={s.title}>Policies & Terms</Text>
      </View>
      <ScrollView contentContainerStyle={s.content}>

        <Text style={s.sectionTitle}>Terms of Service</Text>
        <Text style={s.body}>By placing an order through the TAM Restaurant Group app, you agree to these terms. Orders are subject to availability and confirmation. TAM Restaurant Group reserves the right to cancel any order at its discretion. Prices are listed in Botswana Pula (BWP) and are inclusive of applicable taxes.</Text>

        <Text style={s.sectionTitle}>Ordering & Payment</Text>
        <Text style={s.body}>All orders must be paid in full at the time of placement. Payments are processed securely. TAM Restaurant Group does not store payment card details. Orders are only confirmed once payment has been successfully processed.</Text>

        <Text style={s.sectionTitle}>Delivery Policy</Text>
        <Text style={s.body}>Delivery is available within our designated service area. Delivery fees are calculated at checkout. Estimated delivery times are provided as a guide only and may vary due to distance, traffic, or order volume. TAM Restaurant Group is not liable for delays beyond our reasonable control.</Text>

        <Text style={s.sectionTitle}>Pick Up Policy</Text>
        <Text style={s.body}>Pick up orders will be ready within approximately 15 minutes of order confirmation. Please collect your order from TAM Restaurant Group at Mowana Park Mall, Phakalane, Botswana. Uncollected orders after 30 minutes may be disposed of.</Text>

        <Text style={s.sectionTitle}>No Refund Policy</Text>
        <Text style={s.body}>All sales are final. TAM Restaurant Group does not offer refunds under any circumstances once an order has been placed and payment has been processed. In the event of an error on our part, we will endeavour to resolve the issue by replacing the affected item.</Text>

        <Text style={s.sectionTitle}>No Returns Policy</Text>
        <Text style={s.body}>Due to the perishable nature of food products, we do not accept returns. All items leave our kitchen in accordance with our quality standards. If you have a concern about your order, please contact us immediately upon receipt.</Text>

        <Text style={s.sectionTitle}>Food Allergies & Dietary Requirements</Text>
        <Text style={s.body}>Our kitchen handles a wide variety of ingredients including nuts, dairy, gluten, and other common allergens. While we take precautions, we cannot guarantee that any item is completely free from allergens. Customers with severe allergies should exercise caution and contact us before ordering.</Text>

        <Text style={s.sectionTitle}>Privacy Policy</Text>
        <Text style={s.body}>We collect personal information such as your name, phone number, and delivery address solely for the purpose of processing and delivering your order. We do not share, sell, or distribute your personal information to third parties. Your data is stored securely and in accordance with applicable data protection laws.</Text>

        <Text style={s.sectionTitle}>Contact Us</Text>
        <Text style={s.body}>For any queries or concerns regarding your order, please contact us at:</Text>
        <Text style={s.contact}>+267 00 000 000</Text>
        <Text style={s.body}>Mowana Park Mall, Phakalane, Botswana{'\n'}Mon – Sun: 8:00 AM – 10:00 PM</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#fff' },
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F3C3C5' },
  backBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FADAD9', alignItems: 'center', justifyContent: 'center' },
  title:        { fontSize: 20, fontWeight: '800', color: '#1a1612' },
  content:      { padding: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1a1612', marginTop: 20, marginBottom: 8 },
  body:         { fontSize: 13, color: '#6b6b6b', lineHeight: 21 },
  contact:      { fontSize: 14, fontWeight: '700', color: '#CE6F79', marginTop: 6, marginBottom: 6 },
});
