/**
 * 統合分析: combine the 5 systems into a single, readable summary.
 *
 * 動物占い・四柱推命・算命学 の3つは同じ干支暦(五行)を土台にしているため、
 * それらの一致度は数理的に意味のある比較になる。一方で占星術(西洋の4元素)
 * とマヤ暦(マヤの暦体系)は全く別の体系なので、無理に五行へ変換して数値比較
 * はせず、それぞれの体系が語るキーワードを並べて「複数の視点から見えてくる
 * 共通の物語」として提示する方針にしている。
 */
import { Gogyou } from './kanshi';
import { FullAnalysisResult } from './fullAnalysis';
import { TZOLKIN_SIGN_KEYWORD, TZOLKIN_TONE_KEYWORD } from './mayanCalendar';

const GOGYOU_KEYWORD: Record<Gogyou, string> = {
  木: '成長・向上心・チャレンジ精神',
  火: '情熱・表現力・行動力',
  土: '安定志向・信頼・誠実さ',
  金: '意志の強さ・決断力・筋を通す姿勢',
  水: '柔軟性・知性・順応力',
};

const GOGYOU_ADVICE: Record<Gogyou, string> = {
  木: '新しい挑戦や学びを積極的に取り入れることで、持ち前の成長力が発揮されやすくなります。',
  火: '自分の想いを言葉や行動でしっかり表現する機会を増やすと、エネルギーが良い方向に循環します。',
  土: '焦らずコツコツ信頼を積み重ねる姿勢が、長期的な安定と評価につながります。',
  金: '決断力と一貫性を大切にしつつ、時には周囲の意見にも耳を傾けると視野が広がります。',
  水: '柔軟性と知性を活かしつつ、自分の軸をどこかに一本通しておくとブレにくくなります。',
};

export interface SystemHighlight {
  system: string;
  headline: string;
  detail: string;
}

export interface IntegratedSummary {
  /** 動物占い・算命学(日干)が共有する軸となる五行。 */
  coreElement: Gogyou;
  coreElementKeyword: string;
  /** 四柱推命の五行バランス全体で見た最も強い五行。coreElementと一致すれば、それだけ軸がぶれにくいことを意味する。 */
  balanceElement: Gogyou;
  coreAndBalanceAgree: boolean;
  perSystem: SystemHighlight[];
  keywords: string[];
  headline: string;
  advice: string;
}

export function buildIntegratedSummary(result: FullAnalysisResult): IntegratedSummary {
  const coreElement = result.sanmeigaku.dayMasterElement as Gogyou;
  const balanceElement = result.shichuSuimei.dominantGogyou;
  const agree = coreElement === balanceElement;

  const perSystem: SystemHighlight[] = [
    {
      system: '動物占い',
      headline: `${result.animal.animal}(${result.animal.color})`,
      detail: result.animal.description,
    },
    {
      system: '四柱推命',
      headline: `日主は${result.shichuSuimei.pillars.dayMaster}(${coreElement})・全体では${balanceElement}が最も強い`,
      detail: `五行バランス: 木${result.shichuSuimei.gogyouBalance.木.toFixed(1)} 火${result.shichuSuimei.gogyouBalance.火.toFixed(1)} 土${result.shichuSuimei.gogyouBalance.土.toFixed(1)} 金${result.shichuSuimei.gogyouBalance.金.toFixed(1)} 水${result.shichuSuimei.gogyouBalance.水.toFixed(1)}`,
    },
    {
      system: '西洋占星術',
      headline: `太陽星座は${result.astrology.sunSign}・月星座は${result.astrology.moonSign}`,
      detail: `${result.astrology.sunSignTrait} 感情面では、${result.astrology.moonSignTrait}`,
    },
    {
      system: 'マヤ暦',
      headline: `KIN${result.mayan.tzolkin.kin}(${result.mayan.tzolkin.number}・${result.mayan.tzolkin.sign})`,
      detail: `${TZOLKIN_SIGN_KEYWORD[result.mayan.tzolkin.sign] ?? ''} / トーン${result.mayan.tzolkin.number}: ${TZOLKIN_TONE_KEYWORD[result.mayan.tzolkin.number] ?? ''}`,
    },
    {
      system: '算命学',
      headline: `十大主星(年干)は${result.sanmeigaku.juudaiShusei.year}`,
      detail: `十二大従星(日支)は${result.sanmeigaku.juuniDaijuusei.day}。日干の五行は${coreElement}。`,
    },
  ];

  const keywords = Array.from(
    new Set([
      ...result.animal.keyTraits,
      ...GOGYOU_KEYWORD[coreElement].split('・'),
      ...GOGYOU_KEYWORD[balanceElement].split('・'),
    ])
  );

  const headline = agree
    ? `生まれ持った軸となる資質は「${GOGYOU_KEYWORD[coreElement]}」。5つの占術のうち、暦を土台とする動物占い・四柱推命・算命学が同じ${coreElement}の気質を指しており、ブレの少ない一貫した個性の持ち主と言えます。`
    : `日干そのものが示す核は「${GOGYOU_KEYWORD[coreElement]}」ですが、四柱推命の全体バランスで見ると「${GOGYOU_KEYWORD[balanceElement]}」の要素が最も強く出ています。生まれ持った芯(${coreElement})と、後天的に育ってきた資質(${balanceElement})の両方を併せ持つタイプです。`;

  const advice = agree
    ? GOGYOU_ADVICE[coreElement]
    : `${GOGYOU_ADVICE[coreElement]} また、${GOGYOU_ADVICE[balanceElement]}`;

  return {
    coreElement,
    coreElementKeyword: GOGYOU_KEYWORD[coreElement],
    balanceElement,
    coreAndBalanceAgree: agree,
    perSystem,
    keywords,
    headline,
    advice,
  };
}
