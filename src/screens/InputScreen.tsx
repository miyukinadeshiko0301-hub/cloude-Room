import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme/theme';
import { BIRTH_PLACE_PRESETS } from '../theme/birthPlaces';
import { saveProfile, newProfileId } from '../storage/profileStore';
import { BirthProfile } from '../types/profile';

type Props = NativeStackScreenProps<RootStackParamList, 'Input'>;

export default function InputScreen({ navigation }: Props) {
  const now = new Date();
  const [name, setName] = useState('');
  const [year, setYear] = useState(String(now.getFullYear() - 25));
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('0');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [placeIdx, setPlaceIdx] = useState(2); // 東京

  const onSubmit = async () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const h = parseInt(hour, 10) || 0;
    const min = parseInt(minute, 10) || 0;

    if (!name.trim()) return Alert.alert('お名前を入力してください');
    if (!y || m < 1 || m > 12 || d < 1 || d > 31) return Alert.alert('生年月日を確認してください');
    if (!timeUnknown && (h < 0 || h > 23 || min < 0 || min > 59)) return Alert.alert('時刻を確認してください');

    const place = BIRTH_PLACE_PRESETS[placeIdx];
    const profile: BirthProfile = {
      id: newProfileId(),
      name: name.trim(),
      year: y,
      month: m,
      day: d,
      hour: h,
      minute: min,
      timeUnknown,
      utcOffsetHours: 9,
      birthPlace: { label: place.label, latitudeDeg: place.latitudeDeg, longitudeDeg: place.longitudeDeg },
    };

    await saveProfile(profile);
    navigation.replace('Result', { profileId: profile.id });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(6) }}>
      <Text style={styles.label}>お名前・ニックネーム</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="例) こうちゃん" placeholderTextColor={colors.textMuted} />

      <Text style={styles.label}>生年月日</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.inputSmall]} keyboardType="number-pad" value={year} onChangeText={setYear} placeholder="年" placeholderTextColor={colors.textMuted} />
        <TextInput style={[styles.input, styles.inputSmall]} keyboardType="number-pad" value={month} onChangeText={setMonth} placeholder="月" placeholderTextColor={colors.textMuted} />
        <TextInput style={[styles.input, styles.inputSmall]} keyboardType="number-pad" value={day} onChangeText={setDay} placeholder="日" placeholderTextColor={colors.textMuted} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>生まれた時刻が分からない</Text>
        <Switch value={timeUnknown} onValueChange={setTimeUnknown} trackColor={{ true: colors.primary, false: colors.border }} />
      </View>

      {!timeUnknown && (
        <>
          <Text style={styles.label}>生まれた時刻</Text>
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.inputSmall]} keyboardType="number-pad" value={hour} onChangeText={setHour} placeholder="時" placeholderTextColor={colors.textMuted} />
            <TextInput style={[styles.input, styles.inputSmall]} keyboardType="number-pad" value={minute} onChangeText={setMinute} placeholder="分" placeholderTextColor={colors.textMuted} />
          </View>
        </>
      )}

      <Text style={styles.label}>生まれた場所(占星術のアセンダント計算に使用)</Text>
      <View style={styles.placeWrap}>
        {BIRTH_PLACE_PRESETS.map((p, i) => (
          <TouchableOpacity
            key={p.label}
            style={[styles.chip, i === placeIdx && styles.chipActive]}
            onPress={() => setPlaceIdx(i)}
          >
            <Text style={[styles.chipText, i === placeIdx && styles.chipTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitText}>5つの占術で診断する</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  label: { color: colors.textMuted, marginTop: spacing(2), marginBottom: spacing(1), fontSize: 14 },
  input: {
    backgroundColor: colors.surface, color: colors.text, borderRadius: 10,
    paddingHorizontal: spacing(1.5), paddingVertical: spacing(1.2), borderWidth: 1, borderColor: colors.border,
  },
  inputSmall: { flex: 1, minWidth: 0, marginRight: spacing(1) },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing(2) },
  placeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(1) },
  chip: {
    paddingHorizontal: spacing(1.5), paddingVertical: spacing(0.8), borderRadius: 20,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: spacing(1), marginBottom: spacing(1),
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted },
  chipTextActive: { color: colors.background, fontWeight: '700' },
  submitButton: {
    marginTop: spacing(4), backgroundColor: colors.primary, borderRadius: 14,
    paddingVertical: spacing(1.8), alignItems: 'center',
  },
  submitText: { color: colors.background, fontWeight: '700', fontSize: 16 },
});
