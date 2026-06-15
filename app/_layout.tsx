import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { CartProvider } from '../context/CartContext';
import { Appearance } from 'react-native';
Appearance.setColorScheme('light');

// ─── STAFF ACCOUNTS ───────────────────────────────────────────
// To change the manager email, update MANAGER_EMAIL below.
// To change the driver email, update DRIVER_EMAIL below.
// Passwords are set in Firebase Authentication console.
const MANAGER_EMAIL = 'casadelsol.bw@gmail.com';
const DRIVER_EMAIL  = 'web.expert.remote@gmail.com'; // ← change this to the actual driver email
// ──────────────────────────────────────────────────────────────

function AuthGate() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoaded(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const inAuth    = segments[0] === 'auth';
    const inManage  = segments[0] === 'ManageMyApp';

    if (!user && !inAuth && !inManage) {
      router.replace('/auth/sign-in');
      return;
    }

    if (user && inAuth) {
      const email = user.email ?? '';
      if (email === MANAGER_EMAIL) {
        router.replace('/ManageMyApp/dashboard');
      } else if (email === DRIVER_EMAIL) {
        router.replace('/ManageMyApp/driver');
      } else {
        router.replace('/tabs');
      }
      return;
    }

    // If staff lands on /tabs, redirect them to their dashboard
    if (user && segments[0] === 'tabs') {
      const email = user.email ?? '';
      if (email === MANAGER_EMAIL) {
        router.replace('/ManageMyApp/dashboard');
      } else if (email === DRIVER_EMAIL) {
        router.replace('/ManageMyApp/driver');
      }
    }
  }, [loaded, user, segments]);

  if (!loaded) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFD544' }}>
      <ActivityIndicator size="large" color="#b60015" />
    </View>
  );
  return <Slot />;
}

export default function RootLayout() {
  return (
    <CartProvider>
      <AuthGate />
    </CartProvider>
  );
}
