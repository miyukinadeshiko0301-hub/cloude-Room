/**
 * 算命学 (Sanmeigaku). Built on the same 干支暦 foundation as 四柱推命
 * (年干支・月干支・日干支 = 陰占), interpreted through 算命学's own
 * framework: 十大主星 (relationship of each pillar's stem to the day
 * master) and 十二大従星 (the classical 十二運 growth-stage cycle).
 */
import { CivilDateTime } from './julian';
import { Branch, Stem, BRANCHES, STEM_ELEMENT, STEM_YINYANG, HIDDEN_STEMS } from './kanshi';
import { computeFourPillars, tenGodFor } from './shichuSuimei';

/** 十大主星 label for a given 十神-diff/same-yinyang combination (same underlying logic as 十神). */
const JUUDAI_SHUSEI: Record<string, string> = {
  比肩: '貫索星', 劫財: '石門星',
  食神: '鳳閣星', 傷官: '調舒星',
  偏財: '禄存星', 正財: '司禄星',
  偏官: '車騎星', 正官: '牽牛星',
  偏印: '龍高星', 正印: '玉堂星',
};

export function juudaiShuseiFor(dayMaster: Stem, target: Stem): string {
  return JUUDAI_SHUSEI[tenGodFor(dayMaster, target)];
}

export interface InsenResult {
  year: { stem: Stem; branch: Branch };
  month: { stem: Stem; branch: Branch };
  day: { stem: Stem; branch: Branch };
  dayMaster: Stem;
}

export interface JuudaiShuseiSummary {
  year: string;
  month: string;
  /** 日支の蔵干(本気)から見た主星。日干そのものは中心なので算出しない。 */
  dayBranchHiddenStem: string;
}

// 十二運 (長生訣): starting 長生 branch for each stem, and forward(陽)/backward(陰) direction.
const CHOUSEI_START: Record<Stem, Branch> = {
  甲: '亥', 丙: '寅', 戊: '寅', 庚: '巳', 壬: '申',
  乙: '午', 丁: '酉', 己: '酉', 辛: '子', 癸: '卯',
};

const JUUNIUN_STAGES = ['長生', '沐浴', '冠帯', '建禄', '帝旺', '衰', '病', '死', '墓', '絶', '胎', '養'] as const;

export function juuniunStageFor(dayMaster: Stem, targetBranch: Branch): string {
  const startIdx = BRANCHES.indexOf(CHOUSEI_START[dayMaster]);
  const targetIdx = BRANCHES.indexOf(targetBranch);
  const forward = STEM_YINYANG[dayMaster] === '陽';
  const stageIdx = forward
    ? (((targetIdx - startIdx) % 12) + 12) % 12
    : (((startIdx - targetIdx) % 12) + 12) % 12;
  return JUUNIUN_STAGES[stageIdx];
}

export interface JuuniDaijuuseiSummary {
  year: string;
  month: string;
  day: string;
}

export interface SanmeigakuResult {
  insen: InsenResult;
  juudaiShusei: JuudaiShuseiSummary;
  juuniDaijuusei: JuuniDaijuuseiSummary;
  dayMasterElement: string;
}

export function analyzeSanmeigaku(dt: CivilDateTime): SanmeigakuResult {
  const pillars = computeFourPillars(dt);
  const dayMaster = pillars.day.stem;

  const insen: InsenResult = {
    year: { stem: pillars.year.stem, branch: pillars.year.branch },
    month: { stem: pillars.month.stem, branch: pillars.month.branch },
    day: { stem: pillars.day.stem, branch: pillars.day.branch },
    dayMaster,
  };

  const dayBranchMainHidden = HIDDEN_STEMS[pillars.day.branch][0].stem;

  const juudaiShusei: JuudaiShuseiSummary = {
    year: juudaiShuseiFor(dayMaster, pillars.year.stem),
    month: juudaiShuseiFor(dayMaster, pillars.month.stem),
    dayBranchHiddenStem: juudaiShuseiFor(dayMaster, dayBranchMainHidden),
  };

  const juuniDaijuusei: JuuniDaijuuseiSummary = {
    year: juuniunStageFor(dayMaster, pillars.year.branch),
    month: juuniunStageFor(dayMaster, pillars.month.branch),
    day: juuniunStageFor(dayMaster, pillars.day.branch),
  };

  return {
    insen,
    juudaiShusei,
    juuniDaijuusei,
    dayMasterElement: STEM_ELEMENT[dayMaster],
  };
}
