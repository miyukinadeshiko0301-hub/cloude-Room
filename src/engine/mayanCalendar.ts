/**
 * マヤ暦 (Maya Calendar): Long Count, Tzolk'in (260-day sacred calendar)
 * and Haab' (365-day civil calendar), using the GMT (Goodman-Martinez-
 * Thompson) correlation constant 584283.
 *
 * Sanity-checked against the well-documented reference date 2012-12-21 =
 * Long Count 13.0.0.0.0 = Tzolk'in "4 Ahau" = Haab' "3 Kankin".
 */
import { CivilDateTime, toJulianDayNumber } from './julian';

const GMT_CORRELATION = 584283;

export const TZOLKIN_DAY_SIGNS = [
  'イミシュ', 'イク', 'アクバル', 'カン', 'チクチャン', 'キミ', 'マニク', 'ラマト',
  'ムルク', 'オク', 'チュエン', 'エブ', 'ベン', 'イシュ', 'メン', 'キブ',
  'カバン', 'エツナブ', 'カワク', 'アハウ',
] as const;

export const HAAB_MONTHS = [
  'ポップ', 'ウォ', 'シプ', 'ソツ', 'セック', 'シュル', 'ヤシュキン', 'モル',
  'チェン', 'ヤシュ', 'サック', 'ケフ', 'マック', 'カンキン', 'ムアン', 'パシュ',
  'カヤブ', 'クンク',
] as const;
const WAYEB = 'ワヤブ';

/** Short keyword for each of the 20 Tzolk'in day signs (traditional New Age / divinatory associations). */
export const TZOLKIN_SIGN_KEYWORD: Record<string, string> = {
  イミシュ: '始まりの力・根源', イク: '風・精神とコミュニケーション', アクバル: '内なる知恵・夜',
  カン: '種・可能性の種まき', チクチャン: '生命力・直感', キミ: '変容・手放し',
  マニク: '癒しの手・達成', ラマト: '調和・豊かさ', ムルク: '感情の浄化・普遍の水',
  オク: '忠実な心・信頼', チュエン: '創造性・遊び心', エブ: '道を歩む・協働',
  ベン: '柱となる力・成長', イシュ: '魔法・野性の知性', メン: '広い視野・展望',
  キブ: '戦士の勇気・古き知恵', カバン: '大地とのつながり・共鳴', エツナブ: '鏡・真実を映す',
  カワク: '嵐のエネルギー・浄化と再生', アハウ: '太陽・悟りと完成',
};

/** Short keyword for each of the 13 Tzolk'in tones (Dreamspell/Tzolk'in "13 tones of creation"). */
export const TZOLKIN_TONE_KEYWORD: Record<number, string> = {
  1: '目的を定める力', 2: '二極から選び取る力', 3: '行動を起こす活性化の力',
  4: '土台を定義する力', 5: '中心となり指揮する力', 6: '流れを組織する力',
  7: '調和をつなぐチャネルの力', 8: '型を整える調和の力', 9: '意図を点火する力',
  10: '現実化・顕在化の力', 11: '解放し手放す力', 12: '協力し捧げる力',
  13: '超越し内包する宇宙の力',
};

export interface LongCount {
  baktun: number;
  katun: number;
  tun: number;
  uinal: number;
  kin: number;
}

export interface TzolkinDate {
  number: number; // 1-13
  sign: string;
  kin: number; // 1-260 position in the 260-day cycle
}

export interface HaabDate {
  day: number; // 0-19 (or 0-4 during Wayeb)
  month: string;
}

export interface MayanResult {
  longCount: LongCount;
  longCountLabel: string;
  tzolkin: TzolkinDate;
  haab: HaabDate;
}

export function analyzeMayanCalendar(dt: CivilDateTime): MayanResult {
  const jdn = toJulianDayNumber(dt);
  const totalDays = jdn - GMT_CORRELATION;

  let remainder = totalDays;
  const baktun = Math.floor(remainder / 144000);
  remainder -= baktun * 144000;
  const katun = Math.floor(remainder / 7200);
  remainder -= katun * 7200;
  const tun = Math.floor(remainder / 360);
  remainder -= tun * 360;
  const uinal = Math.floor(remainder / 20);
  const kin = remainder - uinal * 20;

  const longCount: LongCount = { baktun, katun, tun, uinal, kin };

  const tzolkinNumber = (((totalDays + 3) % 13) + 13) % 13 + 1;
  const tzolkinSignIdx = (((totalDays + 19) % 20) + 20) % 20;
  const tzolkinKin = (((totalDays % 260) + 260) % 260) + 1;

  const haabDayOfYear = (((totalDays + 348) % 365) + 365) % 365;
  let haab: HaabDate;
  if (haabDayOfYear < 360) {
    haab = { day: haabDayOfYear % 20, month: HAAB_MONTHS[Math.floor(haabDayOfYear / 20)] };
  } else {
    haab = { day: haabDayOfYear - 360, month: WAYEB };
  }

  return {
    longCount,
    longCountLabel: `${baktun}.${katun}.${tun}.${uinal}.${kin}`,
    tzolkin: { number: tzolkinNumber, sign: TZOLKIN_DAY_SIGNS[tzolkinSignIdx], kin: tzolkinKin },
    haab,
  };
}
