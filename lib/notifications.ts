import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ─────────────────────────────────────────────────────────────────────────
// NOTIFICATION CHANNELS (Android only — each can have its own sound)
// To use a CUSTOM sound file later:
//   1. Create folder: assets/sounds/
//   2. Drop your files in, e.g.:
//        assets/sounds/manager-ping.wav
//        assets/sounds/driver-ping.wav
//        assets/sounds/customer-ping.wav
//   3. In app.json, inside the expo-notifications plugin block, add:
//        "sounds": ["./assets/sounds/manager-ping.wav", "./assets/sounds/driver-ping.wav", "./assets/sounds/customer-ping.wav"]
//   4. Below, change sound: 'default' to sound: 'manager-ping.wav' (etc) for each channel
//   5. Rebuild the app (sounds are native, need a new EAS build)
// Right now all 3 channels use the DEFAULT system sound.
// ─────────────────────────────────────────────────────────────────────────
export const CHANNELS = {
  MANAGER: 'manager-orders',
  DRIVER: 'driver-orders',
  CUSTOMER: 'customer-updates',
} as const;

export async function setupNotificationChannels() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CHANNELS.MANAGER, {
    name: 'Manager Orders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default', // ← change to 'manager-ping.wav' once custom file is added
    vibrationPattern: [0, 250, 250, 250],
  });

  await Notifications.setNotificationChannelAsync(CHANNELS.DRIVER, {
    name: 'Driver Orders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default', // ← change to 'driver-ping.wav' once custom file is added
    vibrationPattern: [0, 250, 250, 250],
  });

  await Notifications.setNotificationChannelAsync(CHANNELS.CUSTOMER, {
    name: 'Order Updates',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default', // ← change to 'customer-ping.wav' once custom file is added
    vibrationPattern: [0, 250, 250, 250],
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests permission and returns the Expo push token for this device.
 * Returns null if permission denied or running on a simulator/web.
 */
export async function registerForPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  await setupNotificationChannels();

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch {
    return null;
  }
}

/**
 * Sends a push notification directly via Expo's push API.
 * No backend needed — called from whichever device performs the
 * triggering action (manager assigning a driver, driver updating status, etc).
 */
export async function sendPushNotification(
  to: string,
  title: string,
  body: string,
  channelId: string
): Promise<void> {
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        title,
        body,
        sound: 'default',
        channelId,
        priority: 'high',
      }),
    });
  } catch {
    // Push failures should never block the main action (status update etc)
  }
}
