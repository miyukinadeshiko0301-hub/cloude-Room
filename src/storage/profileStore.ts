import AsyncStorage from '@react-native-async-storage/async-storage';
import { BirthProfile } from '../types/profile';

const STORAGE_KEY = '@uranai/profiles';

export async function loadProfiles(): Promise<BirthProfile[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as BirthProfile[];
  } catch {
    return [];
  }
}

export async function saveProfile(profile: BirthProfile): Promise<BirthProfile[]> {
  const profiles = await loadProfiles();
  const idx = profiles.findIndex((p) => p.id === profile.id);
  if (idx >= 0) {
    profiles[idx] = profile;
  } else {
    profiles.push(profile);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  return profiles;
}

export async function deleteProfile(id: string): Promise<BirthProfile[]> {
  const profiles = (await loadProfiles()).filter((p) => p.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  return profiles;
}

export function newProfileId(): string {
  return `p_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}
