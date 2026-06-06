import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { View, Text, StyleSheet } from 'react-native';

function CartIcon({ size }: { size: number }) {
  const { count } = useCart();
  return (
    <View>
      <Ionicons name="cart" size={size} color="#CE6F79" />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FADAD9',
          borderTopColor: '#F3C3C5',
          height: 72,
          paddingBottom: 16,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#CE6F79',
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: '#CE6F79',
        tabBarInactiveTintColor: '#CE6F79',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home', tabBarIcon: ({ size }) => <Ionicons name="home" size={size} color="#CE6F79" /> }} />
      <Tabs.Screen name="menu" options={{ tabBarLabel: 'Menu', tabBarIcon: ({ size }) => <Ionicons name="restaurant" size={size} color="#CE6F79" /> }} />
      <Tabs.Screen name="cart" options={{ tabBarLabel: 'Cart', tabBarIcon: ({ size }) => <CartIcon size={size} /> }} />
      <Tabs.Screen name="orders" options={{ tabBarLabel: 'Orders', tabBarIcon: ({ size }) => <Ionicons name="receipt" size={size} color="#CE6F79" /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge:     { position: 'absolute', top: -4, right: -6, backgroundColor: '#FFDD32', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  badgeText: { color: '#1a1612', fontSize: 10, fontWeight: '800' },
});
