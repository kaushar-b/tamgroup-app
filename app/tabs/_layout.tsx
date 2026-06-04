import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider, useCart } from '../../context/CartContext';
import { View, Text, StyleSheet } from 'react-native';

function CartIcon({ color, size }: { color: string; size: number }) {
  const { count } = useCart();
  return (
    <View>
      <Ionicons name="cart" size={size} color={color} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
  );
}

function TabsNavigator() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: Colors.pink,
        tabBarInactiveTintColor: Colors.grey,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => <CartIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <CartProvider>
      <TabsNavigator />
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  badge:     { position: 'absolute', top: -4, right: -6, backgroundColor: Colors.pink, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});