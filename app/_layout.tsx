import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  async getToken(key: string) {
    try { return SecureStore.getItemAsync(key); } catch { return null; }
  },
  async saveToken(key: string, value: string) {
    try { return SecureStore.setItemAsync(key, value); } catch { return; }
  },
};

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuth = segments[0] === 'auth';
    if (!isSignedIn && !inAuth) router.replace('/auth/sign-in');
    if (isSignedIn && inAuth) router.replace('/tabs');
  }, [isLoaded, isSignedIn]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  );
}