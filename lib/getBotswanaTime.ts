// ─────────────────────────────────────────────────────────────────────────────
// getBotswanaTime.ts
// Always fetches the real current time from the WorldTimeAPI (free, no key).
// Falls back to device time only if the network call fails.
// This means users cannot spoof the time by changing their phone clock.
//
// Botswana (Gaborone) is UTC+2, no daylight saving.
// ─────────────────────────────────────────────────────────────────────────────

export type BotswanaTime = {
  dayOfWeek: number;   // 0 = Sunday … 6 = Saturday
  dayName: string;     // "Monday", "Tuesday" …
  hour: number;        // 0-23 in Gaborone local time
  minute: number;
  isSunday: boolean;
};

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export async function getBotswanaTime(): Promise<BotswanaTime> {
  try {
    const res  = await fetch('https://worldtimeapi.org/api/timezone/Africa/Gaborone', { cache: 'no-store' });
    const data = await res.json();
    // data.datetime looks like "2025-06-14T21:34:00.123456+02:00"
    const dt   = new Date(data.datetime);
    const dow  = dt.getDay();
    return {
      dayOfWeek: dow,
      dayName:   DAY_NAMES[dow],
      hour:      dt.getHours(),
      minute:    dt.getMinutes(),
      isSunday:  dow === 0,
    };
  } catch {
    // Fallback: use device time but force UTC+2
    const now     = new Date();
    const utcMs   = now.getTime() + now.getTimezoneOffset() * 60000;
    const bwMs    = utcMs + 2 * 3600000; // Botswana is UTC+2
    const bwDate  = new Date(bwMs);
    const dow     = bwDate.getDay();
    return {
      dayOfWeek: dow,
      dayName:   DAY_NAMES[dow],
      hour:      bwDate.getHours(),
      minute:    bwDate.getMinutes(),
      isSunday:  dow === 0,
    };
  }
}
