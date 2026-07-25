/**
 * 四柱推命 (Four Pillars of Destiny).
 *
 * Year/month pillars are anchored to real solar-term boundaries (立春 for
 * the year change, the 12 "節" for the month change) rather than fixed
 * calendar dates, and the day/hour pillars follow the traditional 23:00
 * day-boundary and the standard 五虎遁/五鼠遁 stem-derivation rules.
 */
import { CivilDateTime, toJulianDay } from './julian';
import { sunEclipticLongitude } from './solar';
import { solarTermJD } from './sekki';
import {
  STEMS, Stem, Gogyou,
  KanshiPillar, pillarFromIndex, dayPillar as kanshiDayPillar,
  STEM_ELEMENT, STEM_YINYANG, HIDDEN_STEMS,
} from './kanshi';

export interface FourPillars {
  year: KanshiPillar;
  month: KanshiPillar;
  day: KanshiPillar;
  hour: KanshiPillar;
  dayMaster: Stem;
}

const GOGYOU_ORDER: Gogyou[] = ['木', '火', '土', '金', '水'];

function gogyouIndex(g: Gogyou): number {
  return GOGYOU_ORDER.indexOf(g);
}

/** Effective 四柱推命 year (the year "starts" at 立春, not Jan 1). */
function effectiveYear(dt: CivilDateTime): number {
  const jd = toJulianDay(dt);
  const risshunJD = solarTermJD(dt.year, 315);
  return jd >= risshunJD ? dt.year : dt.year - 1;
}

function yearPillar(dt: CivilDateTime): KanshiPillar {
  const y = effectiveYear(dt);
  const stemIdx = (((y - 4) % 10) + 10) % 10;
  const branchIdx = (((y - 4) % 12) + 12) % 12;
  // Reconcile stem/branch into the shared 0-59 index space (0 = 甲子).
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stemIdx && i % 12 === branchIdx) return pillarFromIndex(i);
  }
  throw new Error('unreachable: stem/branch combination not found');
}

function monthBranchIndexFromLongitude(longitudeDeg: number): number {
  const shifted = ((longitudeDeg - 315 + 360) % 360);
  return (2 + Math.floor(shifted / 30)) % 12; // 寅=2 at 立春 (315deg)
}

function monthPillar(dt: CivilDateTime, yStem: Stem): KanshiPillar {
  const jd = toJulianDay(dt);
  const longitude = sunEclipticLongitude(jd);
  const monthBranchIdx = monthBranchIndexFromLongitude(longitude);

  const yearStemIdx = STEMS.indexOf(yStem);
  // 五虎遁年: the stem of the 寅 (first) month is fixed by the year stem.
  const yinMonthStemIdx = (((yearStemIdx % 5) * 2 + 2) % 10 + 10) % 10;
  const offsetFromYin = ((monthBranchIdx - 2 + 12) % 12);
  const monthStemIdx = (yinMonthStemIdx + offsetFromYin) % 10;

  for (let i = 0; i < 60; i++) {
    if (i % 10 === monthStemIdx && i % 12 === monthBranchIdx) return pillarFromIndex(i);
  }
  throw new Error('unreachable');
}

function hourPillar(dt: CivilDateTime, dStem: Stem): KanshiPillar {
  const hourBranchIdx = Math.floor(((dt.hour + 1) % 24) / 2);
  const dayStemIdx = STEMS.indexOf(dStem);
  // 五鼠遁日: the stem of 子時 is fixed by the day stem.
  const ziHourStemIdx = ((dayStemIdx % 5) * 2) % 10;
  const hourStemIdx = (ziHourStemIdx + hourBranchIdx) % 10;

  for (let i = 0; i < 60; i++) {
    if (i % 10 === hourStemIdx && i % 12 === hourBranchIdx) return pillarFromIndex(i);
  }
  throw new Error('unreachable');
}

export function computeFourPillars(dt: CivilDateTime): FourPillars {
  const year = yearPillar(dt);
  const month = monthPillar(dt, year.stem);
  const day = kanshiDayPillar(dt);
  const hour = hourPillar(dt, day.stem);
  return { year, month, day, hour, dayMaster: day.stem };
}

export const TEN_GOD_NAMES = [
  ['比肩', '劫財'], // diff 0
  ['食神', '傷官'], // diff 1
  ['偏財', '正財'], // diff 2
  ['偏官', '正官'], // diff 3
  ['偏印', '正印'], // diff 4
] as const;

/** 十神 (Ten Gods) relationship of stem `target` relative to the day master. */
export function tenGodFor(dayMaster: Stem, target: Stem): string {
  const d = gogyouIndex(STEM_ELEMENT[dayMaster]);
  const t = gogyouIndex(STEM_ELEMENT[target]);
  const diff = ((t - d) % 5 + 5) % 5;
  const sameYinYang = STEM_YINYANG[dayMaster] === STEM_YINYANG[target];
  return TEN_GOD_NAMES[diff][sameYinYang ? 0 : 1];
}

export interface TenGodsSummary {
  year: string;
  month: string;
  hour: string;
}

export function computeTenGods(pillars: FourPillars): TenGodsSummary {
  const dm = pillars.dayMaster;
  return {
    year: tenGodFor(dm, pillars.year.stem),
    month: tenGodFor(dm, pillars.month.stem),
    hour: tenGodFor(dm, pillars.hour.stem),
  };
}

/** 五行バランス: stems contribute 1pt each, branches distribute 1pt across their 蔵干 by weight. */
export function computeGogyouBalance(pillars: FourPillars): Record<Gogyou, number> {
  const balance: Record<Gogyou, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const all = [pillars.year, pillars.month, pillars.day, pillars.hour];

  for (const p of all) {
    balance[STEM_ELEMENT[p.stem]] += 1;
    for (const hs of HIDDEN_STEMS[p.branch]) {
      balance[STEM_ELEMENT[hs.stem]] += hs.weight;
    }
  }
  return balance;
}

export function dominantGogyou(balance: Record<Gogyou, number>): Gogyou {
  return (Object.keys(balance) as Gogyou[]).reduce((a, b) => (balance[a] >= balance[b] ? a : b));
}

export function weakestGogyou(balance: Record<Gogyou, number>): Gogyou {
  return (Object.keys(balance) as Gogyou[]).reduce((a, b) => (balance[a] <= balance[b] ? a : b));
}

export interface ShichuSuimeiResult {
  pillars: FourPillars;
  tenGods: TenGodsSummary;
  gogyouBalance: Record<Gogyou, number>;
  dominantGogyou: Gogyou;
  weakestGogyou: Gogyou;
}

export function analyzeShichuSuimei(dt: CivilDateTime): ShichuSuimeiResult {
  const pillars = computeFourPillars(dt);
  const tenGods = computeTenGods(pillars);
  const gogyouBalance = computeGogyouBalance(pillars);
  return {
    pillars,
    tenGods,
    gogyouBalance,
    dominantGogyou: dominantGogyou(gogyouBalance),
    weakestGogyou: weakestGogyou(gogyouBalance),
  };
}
