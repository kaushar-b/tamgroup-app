import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const RED = '#b60015';

function CartIcon({ size }: { size: number }) {
  const { count } = useCart();
  return (
    <View>
      <Ionicons name="cart" size={size} color={RED} />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  );
}

function AccountIcon({ size }: { size: number }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);
  const initial = (user?.email?.[0] || 'U').toUpperCase();
  return (
    <View style={[styles.accountIconCircle, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }]}>
      <Text style={[styles.accountIconText, { fontSize: size * 0.6 }]}>{initial}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#FFD544',
          borderTopWidth: 2,
          height: 96,
          paddingBottom: 34,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: RED,
        tabBarInactiveTintColor: RED,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', color: RED },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarLabel: 'Home', tabBarIcon: ({ size }) => <Ionicons name="home" size={size} color={RED} /> }} />
      <Tabs.Screen name="menu" options={{ tabBarLabel: 'Menu', tabBarIcon: ({ size }) => <Ionicons name="restaurant" size={size} color={RED} /> }} />
      <Tabs.Screen name="cart" options={{ tabBarLabel: 'Cart', tabBarIcon: ({ size }) => <CartIcon size={size} /> }} />
      <Tabs.Screen name="orders" options={{ tabBarLabel: 'Orders', tabBarIcon: ({ size }) => <Ionicons name="receipt" size={size} color={RED} /> }} />
      <Tabs.Screen name="account" options={{ tabBarLabel: 'Account', tabBarIcon: ({ size }) => <AccountIcon size={size} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge:             { position: 'absolute', top: -4, right: -6, backgroundColor: '#FFD544', borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  badgeText:         { color: '#1a1612', fontSize: 10, fontWeight: '800' },
  accountIconCircle: { backgroundColor: RED, alignItems: 'center', justifyContent: 'center' },
  accountIconText:   { color: '#fff', fontWeight: '800' },
});
