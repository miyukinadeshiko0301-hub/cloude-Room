/**
 * 二十四節気 (24 solar terms). The Sun's ecliptic longitude advances ~0.9856
 * deg/day, so within a short search window it is effectively monotonic -
 * we can find the exact crossing instant with a plain bisection search.
 */
import { sunEclipticLongitude } from './solar';
import { toJulianDay } from './julian';

const DEG_PER_DAY = 360 / 365.2422;

/** Signed angular distance a-b in (-180, 180]. */
function angleDiff(a: number, b: number): number {
  let d = (a - b) % 360;
  if (d <= -180) d += 360;
  if (d > 180) d -= 360;
  return d;
}

/**
 * Find the JD at which the Sun's ecliptic longitude equals targetDeg,
 * searching near approxJD (within +/- windowDays).
 */
export function findSolarLongitudeCrossing(
  targetDeg: number,
  approxJD: number,
  windowDays = 8
): number {
  let lo = approxJD - windowDays;
  let hi = approxJD + windowDays;
  let fLo = angleDiff(sunEclipticLongitude(lo), targetDeg);
  let fHi = angleDiff(sunEclipticLongitude(hi), targetDeg);

  // Widen/shift window defensively if the root isn't bracketed.
  let guard = 0;
  while (fLo > 0 && guard < 5) {
    lo -= windowDays;
    fLo = angleDiff(sunEclipticLongitude(lo), targetDeg);
    guard++;
  }
  guard = 0;
  while (fHi < 0 && guard < 5) {
    hi += windowDays;
    fHi = angleDiff(sunEclipticLongitude(hi), targetDeg);
    guard++;
  }

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const fMid = angleDiff(sunEclipticLongitude(mid), targetDeg);
    if (Math.abs(fMid) < 1e-6) return mid;
    if (fMid < 0) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
}

export const SOLAR_TERM_NAMES = [
  '立春', '雨水', '啓蟄', '春分', '清明', '穀雨',
  '立夏', '小満', '芒種', '夏至', '小暑', '大暑',
  '立秋', '処暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒',
] as const;

export interface SolarTerm {
  name: string;
  longitudeDeg: number;
  jd: number;
}

/**
 * The 12 "節" (setsu) terms that begin each 四柱推命/算命学 month, in month
 * order starting from 寅 (立春). Longitude 315deg = 立春.
 */
export const SETSU_LONGITUDES = Array.from({ length: 12 }, (_, i) => (315 + i * 30) % 360);

/**
 * Approximate solar longitude for a given day-of-year, used only to seed
 * the bisection search with a reasonable starting guess.
 */
function approxJDForLongitude(year: number, targetDeg: number): number {
  // 立春 (315deg) falls near Feb 4; longitude increases ~0.9856deg/day from there.
  const feb4 = toJulianDay({ year, month: 2, day: 4, hour: 12, minute: 0, utcOffsetHours: 0 });
  let deltaDeg = targetDeg - 315;
  if (deltaDeg < -180) deltaDeg += 360;
  if (deltaDeg > 180) deltaDeg -= 360;
  return feb4 + deltaDeg / DEG_PER_DAY;
}

/** Find the exact JD of a given solar-term longitude nearest to `year`. */
export function solarTermJD(year: number, targetDeg: number): number {
  const guess = approxJDForLongitude(year, targetDeg);
  return findSolarLongitudeCrossing(targetDeg, guess);
}
