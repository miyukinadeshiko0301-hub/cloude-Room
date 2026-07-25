import { solarTermJD } from '../../src/engine/sekki';
import { fromJulianDay } from '../../src/engine/julian';

function toJstDate(jd: number) {
  const jstJD = jd + 9 / 24;
  return fromJulianDay(jstJD);
}

describe('solarTermJD (二十四節気)', () => {
  it('立春 falls near Feb 4 across several recent years', () => {
    for (const year of [2020, 2021, 2022, 2023, 2024, 2025]) {
      const jd = solarTermJD(year, 315);
      const d = toJstDate(jd);
      expect(d.month).toBe(2);
      expect(d.day).toBeGreaterThanOrEqual(3);
      expect(d.day).toBeLessThanOrEqual(5);
    }
  });

  it('夏至 (summer solstice, 90deg) falls near Jun 21', () => {
    const jd = solarTermJD(2024, 90);
    const d = toJstDate(jd);
    expect(d.month).toBe(6);
    expect(d.day).toBeGreaterThanOrEqual(20);
    expect(d.day).toBeLessThanOrEqual(22);
  });
});
