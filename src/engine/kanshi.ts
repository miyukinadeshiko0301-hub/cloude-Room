/**
 * 干支 (kan-shi / stems & branches) core reference data and the 60-cycle
 * index arithmetic shared by 四柱推命, 算命学 and 動物占い.
 */
import { toJulianDayNumber, CivilDateTime } from './julian';

export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export type Stem = (typeof STEMS)[number];
export type Branch = (typeof BRANCHES)[number];

export type Gogyou = '木' | '火' | '土' | '金' | '水';
export type YinYang = '陽' | '陰';

/** 十干 -> 五行, 陰陽 */
export const STEM_ELEMENT: Record<Stem, Gogyou> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
};
export const STEM_YINYANG: Record<Stem, YinYang> = {
  甲: '陽', 乙: '陰', 丙: '陽', 丁: '陰', 戊: '陽', 己: '陰',
  庚: '陽', 辛: '陰', 壬: '陽', 癸: '陰',
};

/** 十二支 -> 五行, 陰陽 */
export const BRANCH_ELEMENT: Record<Branch, Gogyou> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};
export const BRANCH_YINYANG: Record<Branch, YinYang> = {
  子: '陽', 丑: '陰', 寅: '陽', 卯: '陰', 辰: '陽', 巳: '陰',
  午: '陽', 未: '陰', 申: '陽', 酉: '陰', 戌: '陽', 亥: '陰',
};

export const ZODIAC_ANIMAL: Record<Branch, string> = {
  子: 'ねずみ', 丑: 'うし', 寅: 'とら', 卯: 'うさぎ', 辰: 'たつ', 巳: 'へび',
  午: 'うま', 未: 'ひつじ', 申: 'さる', 酉: 'とり', 戌: 'いぬ', 亥: 'いのしし',
};

/** 蔵干: hidden stems carried within each branch (本気・中気・余気), with rough day-weightings. */
export const HIDDEN_STEMS: Record<Branch, { stem: Stem; weight: number }[]> = {
  子: [{ stem: '癸', weight: 1 }],
  丑: [{ stem: '己', weight: 0.6 }, { stem: '癸', weight: 0.2 }, { stem: '辛', weight: 0.2 }],
  寅: [{ stem: '甲', weight: 0.6 }, { stem: '丙', weight: 0.3 }, { stem: '戊', weight: 0.1 }],
  卯: [{ stem: '乙', weight: 1 }],
  辰: [{ stem: '戊', weight: 0.6 }, { stem: '乙', weight: 0.3 }, { stem: '癸', weight: 0.1 }],
  巳: [{ stem: '丙', weight: 0.6 }, { stem: '庚', weight: 0.3 }, { stem: '戊', weight: 0.1 }],
  午: [{ stem: '丁', weight: 0.7 }, { stem: '己', weight: 0.3 }],
  未: [{ stem: '己', weight: 0.6 }, { stem: '丁', weight: 0.3 }, { stem: '乙', weight: 0.1 }],
  申: [{ stem: '庚', weight: 0.6 }, { stem: '壬', weight: 0.3 }, { stem: '戊', weight: 0.1 }],
  酉: [{ stem: '辛', weight: 1 }],
  戌: [{ stem: '戊', weight: 0.6 }, { stem: '辛', weight: 0.3 }, { stem: '丁', weight: 0.1 }],
  亥: [{ stem: '壬', weight: 0.7 }, { stem: '甲', weight: 0.3 }],
};

export interface KanshiPillar {
  stem: Stem;
  branch: Branch;
  /** 0-59 index into the 60-cycle, where 0 = 甲子. */
  index: number;
}

export function pillarFromIndex(index: number): KanshiPillar {
  const i = ((index % 60) + 60) % 60;
  return { stem: STEMS[i % 10], branch: BRANCHES[i % 12], index: i };
}

export function pillarLabel(p: KanshiPillar): string {
  return `${p.stem}${p.branch}`;
}

/**
 * 日柱 (day pillar). Verified against reference dates: 1900-01-01 = 甲戌
 * (index 10) and 2000-01-01 = 戊午 (index 54).
 *
 * Traditional 四柱推命/算命学 practice starts the day at 23:00 (the start
 * of 子時), not civil midnight - so a birth time of 23:00-23:59 belongs to
 * the *next* day's pillar. We shift by +1h before taking the calendar date
 * to reproduce that convention.
 */
export function dayPillar(dt: CivilDateTime): KanshiPillar {
  let day = dt.day;
  let month = dt.month;
  let year = dt.year;
  let hour = dt.hour + 1;
  if (hour >= 24) {
    hour -= 24;
    // Calendar-only rollover to the next date (no timezone conversion involved).
    const d = new Date(Date.UTC(year, month - 1, day + 1));
    year = d.getUTCFullYear();
    month = d.getUTCMonth() + 1;
    day = d.getUTCDate();
  }
  const jdn = toJulianDayNumber({ year, month, day, hour, minute: dt.minute });
  const index = (((jdn + 49) % 60) + 60) % 60;
  return pillarFromIndex(index);
}

export function branchIndex(b: Branch): number {
  return BRANCHES.indexOf(b);
}
export function stemIndex(s: Stem): number {
  return STEMS.indexOf(s);
}
