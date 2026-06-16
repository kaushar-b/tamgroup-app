import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { CartProvider } from '../context/CartContext';
import { Appearance } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

Appearance.setColorScheme('light');

// ─── STAFF ACCOUNTS ───────────────────────────────────────────
// To change manager email: update MANAGER_EMAIL below
// To change driver email:  update DRIVER_EMAIL below
// Passwords are managed in Firebase Authentication console
const MANAGER_EMAIL = 'casadelsol.bw@gmail.com';
const DRIVER_EMAIL  = 'web.expert.remote@gmail.com';
// ──────────────────────────────────────────────────────────────

// ─── BACKGROUND NOTIFICATION TASK ─────────────────────────────
// Defined at module level (required by TaskManager before app renders)
// This allows the OS to wake the app and show notifications even when
// the app has been fully killed / cleared from recent apps.
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

if (!TaskManager.isTaskDefined(BACKGROUND_NOTIFICATION_TASK)) {
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ error }: any) => {
    if (error) {
      console.error('BG notification task error:', error);
    }
    // Expo handles display automatically — nothing else needed here
  });
}
// ──────────────────────────────────────────────────────────────

// Foreground handler — show banners when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:  true,
    shouldPlaySound:  true,
    shouldSetBadge:   false,
    shouldShowBanner: true,
    shouldShowList:   true,
  }),
});

function AuthGate() {
  const [user, setUser]     = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const segments            = useSegments();
  const router              = useRouter();

  // Register background task once on mount
  useEffect(() => {
    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK).catch(() => {
      // Already registered or unsupported — safe to ignore
    });
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoaded(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const inAuth   = segments[0] === 'auth';
    const inManage = segments[0] === 'ManageMyApp';

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
