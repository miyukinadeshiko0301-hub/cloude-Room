/**
 * 西洋占星術 (Western astrology).
 *
 * 太陽星座 and 月星座 are derived from real ecliptic longitude calculations
 * (see solar.ts / lunar.ts), not fixed calendar date ranges - so they stay
 * correct even in years where a sign boundary shifts by a day. アセンダント
 * (ascendant) additionally needs a birth time and place; it is omitted
 * when those aren't provided.
 *
 * Other chart points (Mercury..Pluto, houses) are out of scope for this
 * version - see README for the roadmap.
 */
import { CivilDateTime, julianCenturiesFromJD, normalizeDegrees, toDegrees, toJulianDay, toRadians } from './julian';
import { sunEclipticLongitude } from './solar';
import { moonEclipticLongitude } from './lunar';

export const ZODIAC_SIGNS = [
  '牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
  '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座',
] as const;

const SIGN_TRAITS: Record<string, string> = {
  牡羊座: '直感的で行動が早く、開拓者精神にあふれる。',
  牡牛座: '五感を大事にし、じっくり着実に価値を積み上げる。',
  双子座: '好奇心旺盛で情報収集と会話を通じて世界を広げる。',
  蟹座: '身近な人を大切にし、感情豊かで面倒見が良い。',
  獅子座: '自己表現力にあふれ、周囲を照らす主役気質。',
  乙女座: '観察力と分析力に優れ、物事を丁寧に磨き上げる。',
  天秤座: 'バランス感覚に優れ、調和と美意識を大切にする。',
  蠍座: '物事の本質を深く掘り下げる集中力と情熱を持つ。',
  射手座: '自由を愛し、未知の世界へ果敢に飛び出していく。',
  山羊座: '目標達成への意志が強く、着実に社会的地位を築く。',
  水瓶座: '独自の視点を持ち、常識にとらわれない発想をする。',
  魚座: '共感力が高く、想像力豊かで境界を溶かして繋がる。',
};

export function signForLongitude(longitudeDeg: number): string {
  const idx = Math.floor(normalizeDegrees(longitudeDeg) / 30);
  return ZODIAC_SIGNS[idx];
}

export interface GeoLocation {
  /** Positive = North */
  latitudeDeg: number;
  /** Positive = East */
  longitudeDeg: number;
}

function meanObliquityDeg(jd: number): number {
  const T = julianCenturiesFromJD(jd);
  return 23.439291 - 0.0130042 * T;
}

function greenwichMeanSiderealTimeDeg(jd: number): number {
  const d = jd - 2451545.0;
  const T = julianCenturiesFromJD(jd);
  const gmst =
    280.46061837 +
    360.98564736629 * d +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return normalizeDegrees(gmst);
}

/** Ascendant ecliptic longitude, given UT Julian Day and geographic location. */
export function ascendantLongitude(jd: number, loc: GeoLocation): number {
  const gmst = greenwichMeanSiderealTimeDeg(jd);
  const ramc = normalizeDegrees(gmst + loc.longitudeDeg);
  const eps = toRadians(meanObliquityDeg(jd));
  const ramcRad = toRadians(ramc);
  const latRad = toRadians(loc.latitudeDeg);

  const y = -Math.cos(ramcRad);
  const x = Math.sin(ramcRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps);
  return normalizeDegrees(toDegrees(Math.atan2(y, x)));
}

export interface AstrologyResult {
  sunLongitude: number;
  sunSign: string;
  sunSignTrait: string;
  moonLongitude: number;
  moonSign: string;
  moonSignTrait: string;
  ascendant?: { longitude: number; sign: string; trait: string };
}

export function analyzeAstrology(dt: CivilDateTime, location?: GeoLocation): AstrologyResult {
  const jd = toJulianDay(dt);
  const sunLongitude = sunEclipticLongitude(jd);
  const moonLongitude = moonEclipticLongitude(jd);
  const sunSign = signForLongitude(sunLongitude);
  const moonSign = signForLongitude(moonLongitude);

  const result: AstrologyResult = {
    sunLongitude,
    sunSign,
    sunSignTrait: SIGN_TRAITS[sunSign],
    moonLongitude,
    moonSign,
    moonSignTrait: SIGN_TRAITS[moonSign],
  };

  if (location) {
    const ascLongitude = ascendantLongitude(jd, location);
    const ascSign = signForLongitude(ascLongitude);
    result.ascendant = { longitude: ascLongitude, sign: ascSign, trait: SIGN_TRAITS[ascSign] };
  }

  return result;
}
