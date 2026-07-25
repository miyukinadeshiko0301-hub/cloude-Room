import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, cardShadow } from '../theme/theme';
import { loadProfiles } from '../storage/profileStore';
import { BirthProfile } from '../types/profile';
import { runFullAnalysis, FullAnalysisResult } from '../engine/fullAnalysis';
import { buildIntegratedSummary } from '../engine/integrated';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const TABS = ['総合', '動物占い', '四柱推命', '占星術', 'マヤ暦', '算命学'] as const;
type Tab = (typeof TABS)[number];
const TAB_EMOJI: Record<Tab, string> = {
  総合: '💖', 動物占い: '🐾', 四柱推命: '☯️', 占星術: '✨', マヤ暦: '🌞', 算命学: '🀄',
};

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
      {children}
    </View>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ResultScreen({ route, navigation }: Props) {
  const { profileId } = route.params;
  const [profile, setProfile] = useState<BirthProfile | null>(null);
  const [tab, setTab] = useState<Tab>('総合');

  useEffect(() => {
    loadProfiles().then((profiles) => {
      const p = profiles.find((x) => x.id === profileId) ?? null;
      setProfile(p);
      if (p) navigation.setOptions({ title: `${p.name}さんの診断結果` });
    });
  }, [profileId]);

  const analysis: FullAnalysisResult | null = useMemo(() => (profile ? runFullAnalysis(profile) : null), [profile]);
  const summary = useMemo(() => (analysis ? buildIntegratedSummary(analysis) : null), [analysis]);

  if (!profile || !analysis || !summary) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={{ paddingHorizontal: spacing(1) }}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{TAB_EMOJI[t]} {t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(6) }}>
        {tab === '総合' && (
          <>
            <Card title="総合コメント">
              <Text style={styles.paragraph}>{summary.headline}</Text>
              <Text style={[styles.paragraph, { marginTop: spacing(1) }]}>{summary.advice}</Text>
            </Card>
            <Card title="キーワード">
              <View style={styles.keywordWrap}>
                {summary.keywords.map((k) => (
                  <View key={k} style={styles.keywordChip}><Text style={styles.keywordText}>{k}</Text></View>
                ))}
              </View>
            </Card>
            {summary.perSystem.map((s) => (
              <Card key={s.system} title={s.system}>
                <Text style={styles.cardHeadline}>{s.headline}</Text>
                <Text style={styles.paragraph}>{s.detail}</Text>
              </Card>
            ))}
          </>
        )}

        {tab === '動物占い' && (
          <Card>
            <Text style={styles.bigHeadline}>{analysis.animal.animal}({analysis.animal.color})</Text>
            <Text style={styles.paragraph}>{analysis.animal.description}</Text>
            <View style={styles.keywordWrap}>
              {analysis.animal.keyTraits.map((k) => (
                <View key={k} style={styles.keywordChip}><Text style={styles.keywordText}>{k}</Text></View>
              ))}
            </View>
          </Card>
        )}

        {tab === '四柱推命' && (
          <>
            <Card title="四柱">
              <Row label="年柱" value={`${analysis.shichuSuimei.pillars.year.stem}${analysis.shichuSuimei.pillars.year.branch}`} />
              <Row label="月柱" value={`${analysis.shichuSuimei.pillars.month.stem}${analysis.shichuSuimei.pillars.month.branch}`} />
              <Row label="日柱(日主)" value={`${analysis.shichuSuimei.pillars.day.stem}${analysis.shichuSuimei.pillars.day.branch}`} />
              <Row label="時柱" value={`${analysis.shichuSuimei.pillars.hour.stem}${analysis.shichuSuimei.pillars.hour.branch}`} />
            </Card>
            <Card title="十神">
              <Row label="年干" value={analysis.shichuSuimei.tenGods.year} />
              <Row label="月干" value={analysis.shichuSuimei.tenGods.month} />
              <Row label="時干" value={analysis.shichuSuimei.tenGods.hour} />
            </Card>
            <Card title="五行バランス">
              {(['木', '火', '土', '金', '水'] as const).map((g) => (
                <Row key={g} label={g} value={analysis.shichuSuimei.gogyouBalance[g].toFixed(1)} />
              ))}
              <Text style={[styles.paragraph, { marginTop: spacing(1) }]}>
                最も強い: {analysis.shichuSuimei.dominantGogyou} / 最も弱い: {analysis.shichuSuimei.weakestGogyou}
              </Text>
            </Card>
          </>
        )}

        {tab === '占星術' && (
          <>
            <Card title="太陽星座">
              <Text style={styles.bigHeadline}>{analysis.astrology.sunSign}</Text>
              <Text style={styles.paragraph}>{analysis.astrology.sunSignTrait}</Text>
            </Card>
            <Card title="月星座">
              <Text style={styles.bigHeadline}>{analysis.astrology.moonSign}</Text>
              <Text style={styles.paragraph}>{analysis.astrology.moonSignTrait}</Text>
            </Card>
            {analysis.astrology.ascendant ? (
              <Card title="アセンダント(上昇星座)">
                <Text style={styles.bigHeadline}>{analysis.astrology.ascendant.sign}</Text>
                <Text style={styles.paragraph}>{analysis.astrology.ascendant.trait}</Text>
              </Card>
            ) : (
              <Card title="アセンダント(上昇星座)">
                <Text style={styles.paragraph}>出生時刻が未入力のため計算できません。時刻を入力すると表示されます。</Text>
              </Card>
            )}
          </>
        )}

        {tab === 'マヤ暦' && (
          <>
            <Card title="KIN(キン)">
              <Text style={styles.bigHeadline}>KIN {analysis.mayan.tzolkin.kin}</Text>
              <Text style={styles.paragraph}>紋章: {analysis.mayan.tzolkin.sign} / 音(トーン): {analysis.mayan.tzolkin.number}</Text>
            </Card>
            <Card title="ロングカウント / ハアブ">
              <Row label="ロングカウント" value={analysis.mayan.longCountLabel} />
              <Row label="ハアブ" value={`${analysis.mayan.haab.day} ${analysis.mayan.haab.month}`} />
            </Card>
          </>
        )}

        {tab === '算命学' && (
          <>
            <Card title="陰占(干支)">
              <Row label="年干支" value={`${analysis.sanmeigaku.insen.year.stem}${analysis.sanmeigaku.insen.year.branch}`} />
              <Row label="月干支" value={`${analysis.sanmeigaku.insen.month.stem}${analysis.sanmeigaku.insen.month.branch}`} />
              <Row label="日干支(日主)" value={`${analysis.sanmeigaku.insen.day.stem}${analysis.sanmeigaku.insen.day.branch}`} />
            </Card>
            <Card title="十大主星">
              <Row label="年干" value={analysis.sanmeigaku.juudaiShusei.year} />
              <Row label="月干" value={analysis.sanmeigaku.juudaiShusei.month} />
              <Row label="日支(蔵干)" value={analysis.sanmeigaku.juudaiShusei.dayBranchHiddenStem} />
            </Card>
            <Card title="十二大従星">
              <Row label="年支" value={analysis.sanmeigaku.juuniDaijuusei.year} />
              <Row label="月支" value={analysis.sanmeigaku.juuniDaijuusei.month} />
              <Row label="日支" value={analysis.sanmeigaku.juuniDaijuusei.day} />
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { color: colors.textMuted, margin: spacing(2) },
  tabBar: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { paddingHorizontal: spacing(1.6), paddingVertical: spacing(1.2), marginRight: spacing(0.5) },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600' },
  tabTextActive: { color: colors.primary },
  card: {
    backgroundColor: colors.surface, borderRadius: 20, padding: spacing(2),
    marginBottom: spacing(1.5), borderWidth: 1, borderColor: colors.border,
    ...cardShadow,
  },
  cardTitle: { color: colors.accent, fontWeight: '800', fontSize: 15, marginBottom: spacing(1) },
  cardHeadline: { color: colors.text, fontWeight: '700', fontSize: 15, marginBottom: spacing(0.5) },
  bigHeadline: { color: colors.text, fontWeight: '800', fontSize: 22, marginBottom: spacing(1) },
  paragraph: { color: colors.text, lineHeight: 21 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing(0.6) },
  infoLabel: { color: colors.textMuted },
  infoValue: { color: colors.text, fontWeight: '700' },
  keywordWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(1) },
  keywordChip: {
    backgroundColor: colors.surfaceAlt, borderRadius: 20, paddingHorizontal: spacing(1.4),
    paddingVertical: spacing(0.6), marginRight: spacing(0.8), marginBottom: spacing(0.8),
  },
  keywordText: { color: colors.accent, fontWeight: '600' },
});
