import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/theme';
import { loadProfiles } from '../storage/profileStore';
import { BirthProfile } from '../types/profile';

type Props = NativeStackScreenProps<RootStackParamList, 'Compatibility'>;

export default function CompatibilityScreen({ navigation }: Props) {
  const [profiles, setProfiles] = useState<BirthProfile[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadProfiles().then(setProfiles);
    }, [])
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const canProceed = selected.length === 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>2人選んでください</Text>
      <Text style={styles.subtitle}>相性を見たいプロフィールを2つタップして選択</Text>

      <FlatList
        data={profiles}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingBottom: spacing(2) }}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity style={[styles.card, isSelected && styles.cardSelected]} onPress={() => toggle(item.id)}>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardDate}>{item.year}/{item.month}/{item.day}</Text>
              {isSelected && <Text style={styles.checkmark}>選択中</Text>}
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={[styles.submitButton, !canProceed && styles.submitButtonDisabled]}
        disabled={!canProceed}
        onPress={() => navigation.navigate('CompatibilityResult', { profileIdA: selected[0], profileIdB: selected[1] })}
      >
        <Text style={styles.submitText}>相性を診断する</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing(2) },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  subtitle: { color: colors.textMuted, marginTop: spacing(0.5), marginBottom: spacing(2) },
  card: {
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing(1.5),
    marginBottom: spacing(1), borderWidth: 1, borderColor: colors.border,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.surfaceAlt },
  cardName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  cardDate: { color: colors.textMuted, marginTop: 2 },
  checkmark: { color: colors.primary, marginTop: spacing(0.5), fontWeight: '700' },
  submitButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: spacing(1.6), alignItems: 'center' },
  submitButtonDisabled: { opacity: 0.4 },
  submitText: { color: colors.background, fontWeight: '700', fontSize: 16 },
});
