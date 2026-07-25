/**
 * 相性診断: compares two people's FullAnalysisResult across all 5 systems.
 *
 * 動物占い・四柱推命・算命学 は同じ十二支の古典的な関係性(三合・支合・冲など)
 * を土台に判定する。占星術は西洋の四元素(火・地・風・水)の伝統的な相性理論、
 * マヤ暦はツォルキンのサイン・トーンの一致度を見る、独自の簡易ロジック。
 */
import { Branch, BRANCH_ELEMENT, Gogyou } from './kanshi';
import { FullAnalysisResult } from './fullAnalysis';

export interface SystemCompatibility {
  system: string;
  score: number; // 0-100
  relationLabel: string;
  comment: string;
}

export interface CompatibilityResult {
  overallScore: number;
  overallComment: string;
  perSystem: SystemCompatibility[];
}

const SANGOU_GROUPS: Branch[][] = [
  ['申', '子', '辰'],
  ['亥', '卯', '未'],
  ['寅', '午', '戌'],
  ['巳', '酉', '丑'],
];
const GOUYOU_PAIRS: [Branch, Branch][] = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'], ['辰', '酉'], ['巳', '申'], ['午', '未'],
];
const CHONG_PAIRS: [Branch, Branch][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];

function pairIncludes(pairs: [Branch, Branch][], a: Branch, b: Branch): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

const GOGYOU_GENERATES: Record<Gogyou, Gogyou> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };

export function branchRelationship(a: Branch, b: Branch): { label: string; score: number } {
  if (a === b) return { label: '比和(同じ干支)', score: 72 };
  if (SANGOU_GROUPS.some((g) => g.includes(a) && g.includes(b))) {
    return { label: '三合(理想的な相性)', score: 95 };
  }
  if (pairIncludes(GOUYOU_PAIRS, a, b)) {
    return { label: '支合(安定した相性)', score: 85 };
  }
  if (pairIncludes(CHONG_PAIRS, a, b)) {
    return { label: '冲(刺激し合う相性)', score: 48 };
  }
  const ea = BRANCH_ELEMENT[a];
  const eb = BRANCH_ELEMENT[b];
  if (GOGYOU_GENERATES[ea] === eb || GOGYOU_GENERATES[eb] === ea) {
    return { label: '相生(補い合う相性)', score: 78 };
  }
  return { label: '普通の相性', score: 62 };
}

const WESTERN_ELEMENT: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
  牡羊座: 'fire', 獅子座: 'fire', 射手座: 'fire',
  牡牛座: 'earth', 乙女座: 'earth', 山羊座: 'earth',
  双子座: 'air', 天秤座: 'air', 水瓶座: 'air',
  蟹座: 'water', 蠍座: 'water', 魚座: 'water',
};

function westernElementScore(signA: string, signB: string): { label: string; score: number } {
  const ea = WESTERN_ELEMENT[signA];
  const eb = WESTERN_ELEMENT[signB];
  if (ea === eb) return { label: '同じ元素(似た感性)', score: 82 };
  const complementary =
    (ea === 'fire' && eb === 'air') || (ea === 'air' && eb === 'fire') ||
    (ea === 'earth' && eb === 'water') || (ea === 'water' && eb === 'earth');
  if (complementary) return { label: '好相性の元素の組み合わせ', score: 90 };
  return { label: '刺激し合う元素の組み合わせ', score: 55 };
}

function tzolkinScore(numA: number, signA: string, numB: number, signB: string): { label: string; score: number } {
  if (signA === signB && numA === numB) return { label: '完全に同じKINエネルギー', score: 88 };
  if (signA === signB) return { label: '同じサイン(共感しやすい)', score: 80 };
  if (numA === numB) return { label: '同じトーン(似たリズム感)', score: 75 };
  return { label: '異なる個性が刺激し合う組み合わせ', score: 60 };
}

function avg(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function analyzeCompatibility(a: FullAnalysisResult, b: FullAnalysisResult): CompatibilityResult {
  const animalRel = branchRelationship(a.shichuSuimei.pillars.day.branch, b.shichuSuimei.pillars.day.branch);
  const yearRel = branchRelationship(a.shichuSuimei.pillars.year.branch, b.shichuSuimei.pillars.year.branch);
  const westernRel = westernElementScore(a.astrology.sunSign, b.astrology.sunSign);
  const mayanRel = tzolkinScore(a.mayan.tzolkin.number, a.mayan.tzolkin.sign, b.mayan.tzolkin.number, b.mayan.tzolkin.sign);
  const sanmeigakuRel = branchRelationship(a.sanmeigaku.insen.day.branch, b.sanmeigaku.insen.day.branch);

  const perSystem: SystemCompatibility[] = [
    {
      system: '動物占い',
      score: animalRel.score,
      relationLabel: animalRel.label,
      comment: `${a.animal.animal}と${b.animal.animal}は${animalRel.label}。`,
    },
    {
      system: '四柱推命',
      score: Math.round(avg([animalRel.score, yearRel.score])),
      relationLabel: `日柱:${animalRel.label} / 年柱:${yearRel.label}`,
      comment: `日柱同士は${animalRel.label}、年柱同士は${yearRel.label}の関係です。`,
    },
    {
      system: '西洋占星術',
      score: westernRel.score,
      relationLabel: westernRel.label,
      comment: `${a.astrology.sunSign}と${b.astrology.sunSign}は${westernRel.label}です。`,
    },
    {
      system: 'マヤ暦',
      score: mayanRel.score,
      relationLabel: mayanRel.label,
      comment: `KIN${a.mayan.tzolkin.kin}とKIN${b.mayan.tzolkin.kin}は${mayanRel.label}です。`,
    },
    {
      system: '算命学',
      score: sanmeigakuRel.score,
      relationLabel: sanmeigakuRel.label,
      comment: `日干支の関係は${sanmeigakuRel.label}です。`,
    },
  ];

  const overallScore = Math.round(avg(perSystem.map((s) => s.score)));

  let overallComment: string;
  if (overallScore >= 85) {
    overallComment = '5つの占術全体を通して、非常に調和のとれた相性です。自然体でいても噛み合いやすい関係でしょう。';
  } else if (overallScore >= 70) {
    overallComment = '全体的に良好な相性です。得意な部分でお互いを補い合える関係性です。';
  } else if (overallScore >= 55) {
    overallComment = '穏やかな相性です。特別強い引き合いはなくとも、無理のない関係を築きやすいでしょう。';
  } else {
    overallComment = '刺激し合う相性です。違いが摩擦になることもありますが、その分お互いを大きく成長させる関係にもなり得ます。';
  }

  return { overallScore, overallComment, perSystem };
}
