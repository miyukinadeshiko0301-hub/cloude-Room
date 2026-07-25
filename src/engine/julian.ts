/**
 * Julian Day Number utilities (Meeus, "Astronomical Algorithms", ch. 7).
 * All calendar/astronomy modules in this app are built on top of these.
 */

export interface CivilDateTime {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  second?: number;
  /** Offset from UTC in hours, e.g. Japan Standard Time = 9. Defaults to 9 (JST). */
  utcOffsetHours?: number;
}

/** Julian Day Number (JD) for a Gregorian calendar civil date/time, converted to UT first. */
export function toJulianDay(dt: CivilDateTime): number {
  const offset = dt.utcOffsetHours ?? 9;
  const fractionalDay =
    dt.day +
    (dt.hour - offset + dt.minute / 60 + (dt.second ?? 0) / 3600) / 24;

  let y = dt.year;
  let m = dt.month;
  let d = fractionalDay;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    d +
    B -
    1524.5
  );
}

/**
 * Integer "Julian Day Number" for a civil calendar date, treated as a plain
 * date label (Y-M-D) with no timezone conversion applied - matching the
 * classical 干支暦/マヤ暦 correlation constants, which are all calibrated
 * against calendar dates directly rather than a specific UT instant.
 * (Continuous-time calculations like solar/lunar longitude use
 * `toJulianDay` with the real utcOffsetHours instead - see solar.ts.)
 */
export function toJulianDayNumber(dt: CivilDateTime): number {
  const jdAt0h = toJulianDay({ ...dt, hour: 0, minute: 0, second: 0, utcOffsetHours: 0 });
  return Math.floor(jdAt0h + 0.5);
}

/** Julian centuries since J2000.0 (2000-01-01 12:00 UT), used by most low-precision solar/lunar formulas. */
export function julianCenturiesFromJD(jd: number): number {
  return (jd - 2451545.0) / 36525;
}

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Normalize an angle in degrees to [0, 360). */
export function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/** Convert a Julian Day back to a civil UT date/time (Meeus ch. 7, inverse algorithm). */
export function fromJulianDay(jd: number): CivilDateTime {
  const jdAdj = jd + 0.5;
  const Z = Math.floor(jdAdj);
  const F = jdAdj - Z;

  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const dayWithFraction = B - D - Math.floor(30.6001 * E) + F;
  const day = Math.floor(dayWithFraction);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  const hoursFraction = (dayWithFraction - day) * 24;
  const hour = Math.floor(hoursFraction);
  const minutesFraction = (hoursFraction - hour) * 60;
  const minute = Math.floor(minutesFraction);
  const second = Math.round((minutesFraction - minute) * 60);

  return { year, month, day, hour, minute, second, utcOffsetHours: 0 };
}
