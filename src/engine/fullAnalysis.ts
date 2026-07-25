import { CivilDateTime } from './julian';
import { BirthProfile } from '../types/profile';
import { analyzeAnimalFortune, AnimalProfile } from './animalFortune';
import { analyzeShichuSuimei, ShichuSuimeiResult } from './shichuSuimei';
import { analyzeAstrology, AstrologyResult, GeoLocation } from './astrology';
import { analyzeMayanCalendar, MayanResult } from './mayanCalendar';
import { analyzeSanmeigaku, SanmeigakuResult } from './sanmeigaku';

export function profileToCivilDateTime(profile: BirthProfile): CivilDateTime {
  return {
    year: profile.year,
    month: profile.month,
    day: profile.day,
    hour: profile.timeUnknown ? 12 : profile.hour,
    minute: profile.timeUnknown ? 0 : profile.minute,
    utcOffsetHours: profile.utcOffsetHours ?? 9,
  };
}

export interface FullAnalysisResult {
  profile: BirthProfile;
  animal: AnimalProfile;
  shichuSuimei: ShichuSuimeiResult;
  astrology: AstrologyResult;
  mayan: MayanResult;
  sanmeigaku: SanmeigakuResult;
}

export function runFullAnalysis(profile: BirthProfile): FullAnalysisResult {
  const dt = profileToCivilDateTime(profile);
  const location: GeoLocation | undefined =
    !profile.timeUnknown && profile.birthPlace
      ? { latitudeDeg: profile.birthPlace.latitudeDeg, longitudeDeg: profile.birthPlace.longitudeDeg }
      : undefined;

  return {
    profile,
    animal: analyzeAnimalFortune(dt),
    shichuSuimei: analyzeShichuSuimei(dt),
    astrology: analyzeAstrology(dt, location),
    mayan: analyzeMayanCalendar(dt),
    sanmeigaku: analyzeSanmeigaku(dt),
  };
}
