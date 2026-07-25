export interface BirthPlacePreset {
  label: string;
  latitudeDeg: number;
  longitudeDeg: number;
}

export const BIRTH_PLACE_PRESETS: BirthPlacePreset[] = [
  { label: '札幌', latitudeDeg: 43.06, longitudeDeg: 141.35 },
  { label: '仙台', latitudeDeg: 38.27, longitudeDeg: 140.87 },
  { label: '東京', latitudeDeg: 35.68, longitudeDeg: 139.77 },
  { label: '横浜', latitudeDeg: 35.44, longitudeDeg: 139.64 },
  { label: '名古屋', latitudeDeg: 35.18, longitudeDeg: 136.91 },
  { label: '大阪', latitudeDeg: 34.69, longitudeDeg: 135.5 },
  { label: '京都', latitudeDeg: 35.01, longitudeDeg: 135.77 },
  { label: '広島', latitudeDeg: 34.4, longitudeDeg: 132.46 },
  { label: '福岡', latitudeDeg: 33.59, longitudeDeg: 130.4 },
  { label: '那覇', latitudeDeg: 26.21, longitudeDeg: 127.68 },
  { label: 'ソウル', latitudeDeg: 37.57, longitudeDeg: 126.98 },
  { label: '台北', latitudeDeg: 25.03, longitudeDeg: 121.57 },
  { label: 'ニューヨーク', latitudeDeg: 40.71, longitudeDeg: -74.01 },
  { label: 'ロンドン', latitudeDeg: 51.51, longitudeDeg: -0.13 },
];
