import { runFullAnalysis } from '../../src/engine/fullAnalysis';
import { buildIntegratedSummary } from '../../src/engine/integrated';
import { analyzeCompatibility } from '../../src/engine/compatibility';
import { BirthProfile } from '../../src/types/profile';

const profileA: BirthProfile = {
  id: 'a', name: 'テストA', year: 1990, month: 6, day: 15, hour: 8, minute: 30,
  utcOffsetHours: 9, birthPlace: { label: '東京', latitudeDeg: 35.68, longitudeDeg: 139.77 },
};
const profileB: BirthProfile = {
  id: 'b', name: 'テストB', year: 1988, month: 11, day: 3, hour: 20, minute: 15,
  utcOffsetHours: 9, birthPlace: { label: '大阪', latitudeDeg: 34.69, longitudeDeg: 135.5 },
};

describe('runFullAnalysis', () => {
  it('runs all 5 systems without throwing and returns well-formed data', () => {
    const result = runFullAnalysis(profileA);
    expect(result.animal.animal).toBeTruthy();
    expect(result.shichuSuimei.pillars.day.stem).toBeTruthy();
    expect(result.astrology.sunSign).toBeTruthy();
    expect(result.astrology.ascendant).toBeDefined();
    expect(result.mayan.tzolkin.kin).toBeGreaterThanOrEqual(1);
    expect(result.sanmeigaku.insen.dayMaster).toBeTruthy();
  });

  it('handles an unknown birth time by disabling the ascendant', () => {
    const result = runFullAnalysis({ ...profileA, timeUnknown: true });
    expect(result.astrology.ascendant).toBeUndefined();
  });
});

describe('buildIntegratedSummary', () => {
  it('produces a summary referencing all 5 systems', () => {
    const result = runFullAnalysis(profileA);
    const summary = buildIntegratedSummary(result);
    expect(summary.perSystem).toHaveLength(5);
    expect(summary.headline.length).toBeGreaterThan(0);
    expect(summary.advice.length).toBeGreaterThan(0);
  });
});

describe('analyzeCompatibility', () => {
  it('produces per-system scores between 0 and 100 and an overall score', () => {
    const a = runFullAnalysis(profileA);
    const b = runFullAnalysis(profileB);
    const compat = analyzeCompatibility(a, b);
    expect(compat.perSystem).toHaveLength(5);
    for (const s of compat.perSystem) {
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
    expect(compat.overallScore).toBeGreaterThanOrEqual(0);
    expect(compat.overallScore).toBeLessThanOrEqual(100);
  });

  it('gives a self-comparison a high animal/branch score (identical day pillar)', () => {
    const a = runFullAnalysis(profileA);
    const compat = analyzeCompatibility(a, a);
    const animalScore = compat.perSystem.find((s) => s.system === '動物占い')!.score;
    expect(animalScore).toBeGreaterThanOrEqual(70);
  });
});
