import { analyzeMayanCalendar } from '../../src/engine/mayanCalendar';

describe('analyzeMayanCalendar', () => {
  it('2012-12-21 is the famous Long Count 13.0.0.0.0 = 4 Ahau 3 Kankin', () => {
    const r = analyzeMayanCalendar({ year: 2012, month: 12, day: 21, hour: 12, minute: 0, utcOffsetHours: 9 });
    expect(r.longCountLabel).toBe('13.0.0.0.0');
    expect(r.tzolkin.number).toBe(4);
    expect(r.tzolkin.sign).toBe('アハウ');
    expect(r.haab.day).toBe(3);
    expect(r.haab.month).toBe('カンキン');
  });

  it('tzolkin kin cycles from 1 to 260 and advances by 1 each day', () => {
    const d1 = analyzeMayanCalendar({ year: 2024, month: 3, day: 1, hour: 12, minute: 0, utcOffsetHours: 9 });
    const d2 = analyzeMayanCalendar({ year: 2024, month: 3, day: 2, hour: 12, minute: 0, utcOffsetHours: 9 });
    expect(d1.tzolkin.kin).toBeGreaterThanOrEqual(1);
    expect(d1.tzolkin.kin).toBeLessThanOrEqual(260);
    const expectedNext = d1.tzolkin.kin === 260 ? 1 : d1.tzolkin.kin + 1;
    expect(d2.tzolkin.kin).toBe(expectedNext);
  });
});
