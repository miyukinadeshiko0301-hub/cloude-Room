/**
 * 動物占い (Animal Fortune-telling) - original implementation.
 *
 * This is NOT a reproduction of any specific commercial product's
 * proprietary lookup tables. It is our own system built transparently on
 * classical 干支/五行 theory: the 日柱 (day pillar) 十二支 selects one of
 * 12 base animals, and the day stem's 五行 selects one of 5 character
 * colors, for 60 unique animal x color patterns overall.
 */
import { CivilDateTime } from './julian';
import { dayPillar } from './kanshi';
import { STEM_ELEMENT, Gogyou } from './kanshi';

export interface AnimalProfile {
  animal: string;
  color: string;
  colorElement: Gogyou;
  keyTraits: string[];
  description: string;
}

const ANIMAL_BY_BRANCH: Record<string, { animal: string; keyTraits: string[]; description: string }> = {
  子: { animal: 'ねずみ', keyTraits: ['機転', '社交的', '情報通'], description: 'フットワークが軽く、人との縁を大切にしながら要領よくチャンスをつかむタイプ。' },
  丑: { animal: 'うし', keyTraits: ['忍耐', '堅実', 'マイペース'], description: 'コツコツ積み上げる力があり、一度決めたことをやり抜く芯の強さを持つタイプ。' },
  寅: { animal: 'とら', keyTraits: ['行動力', '正義感', '独立心'], description: '思い立ったらすぐ動く行動派。自分の信じる道を堂々と進むリーダー気質。' },
  卯: { animal: 'うさぎ', keyTraits: ['温和', '協調性', '警戒心'], description: '場の空気を読み、周囲と穏やかな関係を築くのが得意な平和主義者。' },
  辰: { animal: 'たつ', keyTraits: ['理想家', 'カリスマ', '大胆'], description: '大きな夢やビジョンを掲げ、周囲を巻き込みながら突き進むスケールの大きいタイプ。' },
  巳: { animal: 'へび', keyTraits: ['洞察力', '探究心', '慎重'], description: '物事の本質を見抜く鋭さを持ち、じっくり考えてから動く知性派。' },
  午: { animal: 'うま', keyTraits: ['自由', '情熱', '瞬発力'], description: '感情表現が豊かで、興味の赴くままに全力で駆け抜けるエネルギッシュなタイプ。' },
  未: { animal: 'ひつじ', keyTraits: ['優しさ', '協調', '繊細'], description: '周囲への気配りを欠かさず、穏やかな人間関係を大切にする癒し系。' },
  申: { animal: 'さる', keyTraits: ['器用', '好奇心', '要領の良さ'], description: '幅広いことを器用にこなし、状況に応じて柔軟に立ち回れるマルチタイプ。' },
  酉: { animal: 'とり', keyTraits: ['几帳面', '計画性', '完璧主義'], description: '緻密に計画を立て、細部までこだわりを持って物事を仕上げる職人気質。' },
  戌: { animal: 'いぬ', keyTraits: ['誠実', '忠実', '正義感'], description: '一度信頼した相手には誠実に尽くす、義理堅く頼れる存在。' },
  亥: { animal: 'いのしし', keyTraits: ['一直線', '純粋', '実行力'], description: '目標を定めたら脇目も振らず突き進む、まっすぐで純粋なパワータイプ。' },
};

const COLOR_BY_ELEMENT: Record<Gogyou, { color: string; description: string }> = {
  木: { color: 'グリーン', description: '成長志向で、新しいことにどんどん挑戦したい向上心が根っこにあります。' },
  火: { color: 'レッド', description: '情熱的で、思いを表現せずにはいられないエネルギーが根っこにあります。' },
  土: { color: 'イエロー', description: '安定志向で、周囲との信頼関係をじっくり育てたい誠実さが根っこにあります。' },
  金: { color: 'ホワイト', description: '筋を通すことを重んじ、白黒はっきりさせたい潔さが根っこにあります。' },
  水: { color: 'ブルー', description: '柔軟で順応性が高く、流れを読んで賢く立ち回る知性が根っこにあります。' },
};

export function analyzeAnimalFortune(dt: CivilDateTime): AnimalProfile {
  const pillar = dayPillar(dt);
  const base = ANIMAL_BY_BRANCH[pillar.branch];
  const element = STEM_ELEMENT[pillar.stem];
  const colorInfo = COLOR_BY_ELEMENT[element];

  return {
    animal: base.animal,
    color: colorInfo.color,
    colorElement: element,
    keyTraits: base.keyTraits,
    description: `${base.description} ${colorInfo.description}`,
  };
}
