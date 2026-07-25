import { analyzeAstrology, signForLongitude, ascendantLongitude } from '../../src/engine/astrology';
import { toJulianDay } from '../../src/engine/julian';

describe('astrology', () => {
  it('places a well-known sun-sign date correctly (Aug 10 -> 獅子座 Leo)', () => {
    const r = analyzeAstrology({ year: 2000, month: 8, day: 10, hour: 12, minute: 0, utcOffsetHours: 9 });
    expect(r.sunSign).toBe('獅子座');
  });

  it('places another well-known sun-sign date correctly (Dec 25 -> 山羊座 Capricorn)', () => {
    const r = analyzeAstrology({ year: 2000, month: 12, day: 25, hour: 12, minute: 0, utcOffsetHours: 9 });
    expect(r.sunSign).toBe('山羊座');
  });

  it('signForLongitude buckets every 30deg into the 12 signs in order', () => {
    expect(signForLongitude(0)).toBe('牡羊座');
    expect(signForLongitude(29.9)).toBe('牡羊座');
    expect(signForLongitude(30)).toBe('牡牛座');
    expect(signForLongitude(359.9)).toBe('魚座');
  });

  it('computes an ascendant longitude within [0, 360) given a birth time and place', () => {
    const jd = toJulianDay({ year: 1990, month: 6, day: 15, hour: 8, minute: 30, utcOffsetHours: 9 });
    const asc = ascendantLongitude(jd, { latitudeDeg: 35.68, longitudeDeg: 139.77 }); // Tokyo
    expect(asc).toBeGreaterThanOrEqual(0);
    expect(asc).toBeLessThan(360);
  });

  it('omits the ascendant when no birth place is given', () => {
    const r = analyzeAstrology({ year: 1990, month: 6, day: 15, hour: 8, minute: 30, utcOffsetHours: 9 });
    expect(r.ascendant).toBeUndefined();
  });
});
