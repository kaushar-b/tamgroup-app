// ─────────────────────────────────────────────────────────────────────────────
// getBotswanaTime.ts
// Primary source: Firebase Realtime Database's `.info/serverTimeOffset`.
// This is tamper-proof — even if a user changes their phone's clock, the math
// (deviceNow + offset) always reconstructs the TRUE current time, because the
// offset is the gap between server time and device time, and that gap stays
// correct even after the device's displayed date is changed.
// Secondary fallback: WorldTimeAPI. Last resort: raw device clock.
// Botswana (Gaborone) is UTC+2, no daylight saving.
// ─────────────────────────────────────────────────────────────────────────────
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';

export type BotswanaTime = {
  dayOfWeek: number;   // 0 = Sunday … 6 = Saturday
  dayName: string;     // "Monday", "Tuesday" …
  hour: number;        // 0-23 in Gaborone local time
  minute: number;
  isSunday: boolean;
};

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function fromUtcMs(utcMs: number): BotswanaTime {
  const bwMs   = utcMs + 2 * 3600000; // Botswana is UTC+2, fixed offset, no DST
  const bwDate = new Date(bwMs);
  // Use UTC getters on the shifted timestamp so the device's own timezone
  // setting can never affect the result — only the math above matters.
  const dow = bwDate.getUTCDay();
  return {
    dayOfWeek: dow,
    dayName:   DAY_NAMES[dow],
    hour:      bwDate.getUTCHours(),
    minute:    bwDate.getUTCMinutes(),
    isSunday:  dow === 0,
  };
}

function getFirebaseServerTime(): Promise<number> {
  return new Promise((resolve, reject) => {
    let settled = false;
    let unsubscribe: (() => void) | null = null;

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { unsubscribe?.(); } catch {}
      reject(new Error('Firebase server time timeout'));
    }, 4000);

    try {
      const offsetRef = ref(db, '.info/serverTimeOffset');
      unsubscribe = onValue(
        offsetRef,
        (snap) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          try { unsubscribe?.(); } catch {}
          resolve(Date.now() + (snap.val() || 0));
        },
        (err) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          try { unsubscribe?.(); } catch {}
          reject(err);
        }
      );
    } catch (err) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(err);
    }
  });
}

async function getWorldTimeApiTime(): Promise<number> {
  const res  = await fetch('https://worldtimeapi.org/api/timezone/Africa/Gaborone', { cache: 'no-store' });
  const data = await res.json();
  return new Date(data.utc_datetime).getTime();
}

export async function getBotswanaTime(): Promise<BotswanaTime> {
  // 1. Firebase server time — most reliable, already connected for orders etc.
  try {
    const utcMs = await getFirebaseServerTime();
    return fromUtcMs(utcMs);
  } catch {}

  // 2. WorldTimeAPI — secondary check if Firebase is somehow unreachable
  try {
    const utcMs = await getWorldTimeApiTime();
    return fromUtcMs(utcMs);
  } catch {}

  // 3. Last resort: device clock (only reached with zero network at all,
  // in which case orders/menu won't load either — app-wide issue, not this bug)
  const now   = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return fromUtcMs(utcMs);
}
