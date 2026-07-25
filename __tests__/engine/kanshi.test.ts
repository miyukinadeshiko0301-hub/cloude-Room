import { dayPillar, pillarLabel } from '../../src/engine/kanshi';

describe('dayPillar (干支暦の日柱)', () => {
  it('1900-01-01 (JST, noon) is 甲戌', () => {
    const p = dayPillar({ year: 1900, month: 1, day: 1, hour: 12, minute: 0, utcOffsetHours: 9 });
    expect(pillarLabel(p)).toBe('甲戌');
  });

  it('2000-01-01 (JST, noon) is 戊午', () => {
    const p = dayPillar({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, utcOffsetHours: 9 });
    expect(pillarLabel(p)).toBe('戊午');
  });

  it('rolls the pillar over at 23:00 local time (the start of 子時)', () => {
    const before = dayPillar({ year: 2000, month: 1, day: 1, hour: 22, minute: 59, utcOffsetHours: 9 });
    const after = dayPillar({ year: 2000, month: 1, day: 1, hour: 23, minute: 0, utcOffsetHours: 9 });
    expect(pillarLabel(before)).toBe('戊午');
    expect(pillarLabel(after)).toBe('己未');
  });
});
