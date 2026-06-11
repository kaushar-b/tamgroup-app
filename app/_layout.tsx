import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator } from 'react-native';
import { CartProvider } from '../context/CartContext';

const tokenCache = {
  async getToken(key: string) {
    try { return await SecureStore.getItemAsync(key); } catch { return null; }
  },
  async saveToken(key: string, value: string) {
    try { await SecureStore.setItemAsync(key, value); } catch {}
  },
  async deleteToken(key: string) {
    try { await SecureStore.deleteItemAsync(key); } catch {}
  },
};

function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuth = segments[0] === 'auth';
    const inManage = segments[0] === 'ManageMyApp';
    if (!isSignedIn && !inAuth && !inManage) {
      router.replace('/auth/sign-in');
    } else if (isSignedIn && inAuth) {
      router.replace('/tabs');
    }
  }, [isLoaded, isSignedIn, segments]);

  if (!isLoaded) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FADAD9' }}>
      <ActivityIndicator size="large" color="#CE6F79" />
    </View>
  );

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <CartProvider>
          <AuthGate />
        </CartProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
