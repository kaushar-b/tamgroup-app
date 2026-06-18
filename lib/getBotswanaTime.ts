// ─────────────────────────────────────────────────────────────────────────────
// getBotswanaTime.ts
// Gets the REAL current time by writing a serverTimestamp() placeholder to
// Firebase and reading back what the server actually wrote. This forces a
// genuine network round-trip to the server's clock every single call —
// it cannot be fooled by changing the device's date, because the server
// (not the device) generates the timestamp value at write time.
// Secondary fallback: WorldTimeAPI. No device-clock fallback.
// Botswana (Gaborone) is UTC+2, no daylight saving.
// ─────────────────────────────────────────────────────────────────────────────
import { ref, set, serverTimestamp, onValue, off } from 'firebase/database';
import { db } from './firebase';

export type BotswanaTime = {
  dayOfWeek: number;
  dayName: string;
  hour: number;
  minute: number;
  isSunday: boolean;
};

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function fromUtcMs(utcMs: number): BotswanaTime {
  const bwMs   = utcMs + 2 * 3600000;
  const bwDate = new Date(bwMs);
  const dow = bwDate.getUTCDay();
  return {
    dayOfWeek: dow,
    dayName:   DAY_NAMES[dow],
    hour:      bwDate.getUTCHours(),
    minute:    bwDate.getUTCMinutes(),
    isSunday:  dow === 0,
  };
}

// Writes a server-generated timestamp to a scratch path, then reads back
// the value the SERVER actually wrote (not what we sent) — this is a real
// round trip, immune to device clock spoofing.
function getFirebaseServerTime(): Promise<number> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const scratchRef = ref(db, 'debug/_timeCheck');
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { off(scratchRef); } catch {}
      reject(new Error('Firebase time check timeout'));
    }, 6000);

    set(scratchRef, serverTimestamp())
      .then(() => {
        if (settled) return;
        const unsubscribe = onValue(
          scratchRef,
          (snap) => {
            const val = snap.val();
            if (typeof val === 'number' && !settled) {
              settled = true;
              clearTimeout(timeout);
              try { unsubscribe(); } catch {}
              resolve(val);
            }
          },
          (err) => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            try { unsubscribe(); } catch {}
            reject(err);
          }
        );
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        reject(err);
      });
  });
}

async function getWorldTimeApiTime(): Promise<number> {
  const res  = await fetch('https://worldtimeapi.org/api/timezone/Africa/Gaborone', { cache: 'no-store' });
  const data = await res.json();
  return new Date(data.utc_datetime).getTime();
}

export async function getBotswanaTime(): Promise<BotswanaTime> {
  try {
    const utcMs = await getFirebaseServerTime();
    return fromUtcMs(utcMs);
  } catch {}

  try {
    const utcMs = await getWorldTimeApiTime();
    return fromUtcMs(utcMs);
  } catch {}

  throw new Error(\'Could not get verified Botswana time — please check your connection.\');
}
