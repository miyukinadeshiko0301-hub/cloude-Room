export interface BirthProfile {
  id: string;
  name: string;
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23
  minute: number; // 0-59
  /** true if the user doesn't know their birth time (defaults hour/minute to noon, disables ascendant). */
  timeUnknown?: boolean;
  utcOffsetHours?: number; // defaults to 9 (JST)
  birthPlace?: {
    label: string;
    latitudeDeg: number;
    longitudeDeg: number;
  };
}
