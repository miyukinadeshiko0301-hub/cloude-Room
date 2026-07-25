import { computeFourPillars } from '../../src/engine/shichuSuimei';
import { pillarLabel } from '../../src/engine/kanshi';

describe('computeFourPillars', () => {
  it('2000-01-01 12:00 JST belongs to the 四柱推命 year 1999 (before 立春) = 己卯年', () => {
    const p = computeFourPillars({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, utcOffsetHours: 9 });
    expect(pillarLabel(p.year)).toBe('己卯');
    expect(pillarLabel(p.day)).toBe('戊午');
  });

  it('a birth date after 立春 uses the calendar year itself', () => {
    // 立春 2000 fell on Feb 4; March 1 2000 should belong to 庚辰年.
    const p = computeFourPillars({ year: 2000, month: 3, day: 1, hour: 12, minute: 0, utcOffsetHours: 9 });
    expect(pillarLabel(p.year)).toBe('庚辰');
  });

  it('month branch is 寅 immediately after 立春 and 丑 immediately before it', () => {
    const after = computeFourPillars({ year: 2024, month: 2, day: 10, hour: 12, minute: 0, utcOffsetHours: 9 });
    const before = computeFourPillars({ year: 2024, month: 1, day: 20, hour: 12, minute: 0, utcOffsetHours: 9 });
    expect(after.month.branch).toBe('寅');
    expect(before.month.branch).toBe('丑');
  });
});
