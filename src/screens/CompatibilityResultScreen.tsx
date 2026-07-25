import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/theme';
import { loadProfiles } from '../storage/profileStore';
import { BirthProfile } from '../types/profile';
import { runFullAnalysis } from '../engine/fullAnalysis';
import { analyzeCompatibility } from '../engine/compatibility';

type Props = NativeStackScreenProps<RootStackParamList, 'CompatibilityResult'>;

export default function CompatibilityResultScreen({ route }: Props) {
  const { profileIdA, profileIdB } = route.params;
  const [profileA, setProfileA] = useState<BirthProfile | null>(null);
  const [profileB, setProfileB] = useState<BirthProfile | null>(null);

  useEffect(() => {
    loadProfiles().then((profiles) => {
      setProfileA(profiles.find((p) => p.id === profileIdA) ?? null);
      setProfileB(profiles.find((p) => p.id === profileIdB) ?? null);
    });
  }, [profileIdA, profileIdB]);

  const compat = useMemo(() => {
    if (!profileA || !profileB) return null;
    return analyzeCompatibility(runFullAnalysis(profileA), runFullAnalysis(profileB));
  }, [profileA, profileB]);

  if (!profileA || !profileB || !compat) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(6) }}>
      <Text style={styles.namesLine}>{profileA.name} × {profileB.name}</Text>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>総合相性スコア</Text>
        <Text style={styles.scoreValue}>{compat.overallScore}</Text>
        <Text style={styles.scoreComment}>{compat.overallComment}</Text>
      </View>

      {compat.perSystem.map((s) => (
        <View key={s.system} style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>{s.system}</Text>
            <Text style={styles.cardScore}>{s.score}点</Text>
          </View>
          <Text style={styles.relationLabel}>{s.relationLabel}</Text>
          <Text style={styles.paragraph}>{s.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loading: { color: colors.textMuted, margin: spacing(2) },
  namesLine: { color: colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: spacing(2) },
  scoreCard: {
    backgroundColor: colors.surfaceAlt, borderRadius: 16, padding: spacing(2.5),
    alignItems: 'center', marginBottom: spacing(2), borderWidth: 1, borderColor: colors.primary,
  },
  scoreLabel: { color: colors.textMuted },
  scoreValue: { color: colors.accent, fontSize: 48, fontWeight: '900', marginVertical: spacing(0.5) },
  scoreComment: { color: colors.text, textAlign: 'center', marginTop: spacing(1), lineHeight: 21 },
  card: {
    backgroundColor: colors.surface, borderRadius: 14, padding: spacing(2),
    marginBottom: spacing(1.5), borderWidth: 1, borderColor: colors.border,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.accent, fontWeight: '800', fontSize: 15 },
  cardScore: { color: colors.text, fontWeight: '800', fontSize: 15 },
  relationLabel: { color: colors.primary, fontWeight: '700', marginTop: spacing(0.5) },
  paragraph: { color: colors.text, marginTop: spacing(0.5), lineHeight: 20 },
});
