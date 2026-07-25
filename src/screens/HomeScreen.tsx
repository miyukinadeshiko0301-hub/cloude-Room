import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, cardShadow } from '../theme/theme';
import { loadProfiles, deleteProfile } from '../storage/profileStore';
import { BirthProfile } from '../types/profile';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [profiles, setProfiles] = useState<BirthProfile[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadProfiles().then(setProfiles);
    }, [])
  );

  const onDelete = (id: string) => {
    Alert.alert('削除しますか?', '', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '削除', style: 'destructive', onPress: () => deleteProfile(id).then(setProfiles) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔮 統合占いアプリ</Text>
      <Text style={styles.subtitle}>動物占い・四柱推命・占星術・マヤ暦・算命学を、まとめて診断💫</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Input')}>
        <Text style={styles.primaryButtonText}>✨ 新しく診断する</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => {
          if (profiles.length < 2) {
            Alert.alert('相性診断には2人分のデータが必要です', 'まずはお二人分を登録してください。');
            return;
          }
          navigation.navigate('Compatibility');
        }}
      >
        <Text style={styles.secondaryButtonText}>💞 相性を診断する</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>保存済みのプロフィール</Text>
      <FlatList
        data={profiles}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingBottom: spacing(4) }}
        ListEmptyComponent={<Text style={styles.empty}>まだ登録がありません。「新しく診断する」から始めましょう。</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Result', { profileId: item.id })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{item.name}</Text>
              <Text style={styles.profileDate}>
                {item.year}/{item.month}/{item.day} {item.timeUnknown ? '(時刻不明)' : `${item.hour}:${String(item.minute).padStart(2, '0')}`}
              </Text>
            </View>
            <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>削除</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing(2) },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: spacing(2) },
  subtitle: { color: colors.textMuted, marginTop: spacing(0.5), marginBottom: spacing(2) },
  primaryButton: {
    backgroundColor: colors.primary, borderRadius: 20, paddingVertical: spacing(1.6), alignItems: 'center',
    ...cardShadow,
  },
  primaryButtonText: { color: colors.onPrimary, fontWeight: '700', fontSize: 16 },
  secondaryButton: {
    marginTop: spacing(1.2), borderRadius: 20, paddingVertical: spacing(1.6), alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.surface,
  },
  secondaryButtonText: { color: colors.primary, fontWeight: '700', fontSize: 16 },
  sectionLabel: { color: colors.textMuted, marginTop: spacing(3), marginBottom: spacing(1), fontWeight: '600' },
  empty: { color: colors.textMuted, marginTop: spacing(2) },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 18,
    padding: spacing(1.5), marginBottom: spacing(1), borderWidth: 1, borderColor: colors.border,
    ...cardShadow,
  },
  profileName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  profileDate: { color: colors.textMuted, marginTop: 2 },
  deleteButton: { paddingHorizontal: spacing(1), paddingVertical: spacing(0.5) },
  deleteText: { color: colors.danger },
});
