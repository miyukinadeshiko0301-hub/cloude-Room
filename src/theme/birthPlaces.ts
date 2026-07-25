export interface BirthPlacePreset {
  label: string;
  latitudeDeg: number;
  longitudeDeg: number;
}

/**
 * Prefecture-capital-level presets (47 Japanese prefectures + a few major
 * overseas cities). This only feeds the astrology ascendant calculation -
 * picking the nearest city on the list is accurate enough; it does not
 * affect the other 4 systems at all.
 */
export const BIRTH_PLACE_PRESETS: BirthPlacePreset[] = [
  { label: '札幌', latitudeDeg: 43.06, longitudeDeg: 141.35 },
  { label: '青森', latitudeDeg: 40.82, longitudeDeg: 140.74 },
  { label: '盛岡', latitudeDeg: 39.7, longitudeDeg: 141.15 },
  { label: '仙台', latitudeDeg: 38.27, longitudeDeg: 140.87 },
  { label: '秋田', latitudeDeg: 39.72, longitudeDeg: 140.1 },
  { label: '山形', latitudeDeg: 38.24, longitudeDeg: 140.36 },
  { label: '福島', latitudeDeg: 37.75, longitudeDeg: 140.47 },
  { label: '水戸', latitudeDeg: 36.34, longitudeDeg: 140.45 },
  { label: '宇都宮', latitudeDeg: 36.57, longitudeDeg: 139.88 },
  { label: '前橋', latitudeDeg: 36.39, longitudeDeg: 139.06 },
  { label: 'さいたま', latitudeDeg: 35.86, longitudeDeg: 139.65 },
  { label: '千葉', latitudeDeg: 35.61, longitudeDeg: 140.12 },
  { label: '東京', latitudeDeg: 35.68, longitudeDeg: 139.77 },
  { label: '横浜', latitudeDeg: 35.44, longitudeDeg: 139.64 },
  { label: '新潟', latitudeDeg: 37.9, longitudeDeg: 139.02 },
  { label: '富山', latitudeDeg: 36.7, longitudeDeg: 137.21 },
  { label: '金沢', latitudeDeg: 36.59, longitudeDeg: 136.63 },
  { label: '福井', latitudeDeg: 36.06, longitudeDeg: 136.22 },
  { label: '甲府', latitudeDeg: 35.66, longitudeDeg: 138.57 },
  { label: '長野', latitudeDeg: 36.65, longitudeDeg: 138.18 },
  { label: '岐阜', latitudeDeg: 35.39, longitudeDeg: 136.72 },
  { label: '静岡', latitudeDeg: 34.98, longitudeDeg: 138.38 },
  { label: '名古屋', latitudeDeg: 35.18, longitudeDeg: 136.91 },
  { label: '津', latitudeDeg: 34.72, longitudeDeg: 136.51 },
  { label: '大津', latitudeDeg: 35.0, longitudeDeg: 135.87 },
  { label: '京都', latitudeDeg: 35.01, longitudeDeg: 135.77 },
  { label: '大阪', latitudeDeg: 34.69, longitudeDeg: 135.5 },
  { label: '神戸', latitudeDeg: 34.69, longitudeDeg: 135.2 },
  { label: '奈良', latitudeDeg: 34.69, longitudeDeg: 135.83 },
  { label: '和歌山', latitudeDeg: 34.23, longitudeDeg: 135.17 },
  { label: '鳥取', latitudeDeg: 35.5, longitudeDeg: 134.24 },
  { label: '松江', latitudeDeg: 35.47, longitudeDeg: 133.05 },
  { label: '岡山', latitudeDeg: 34.66, longitudeDeg: 133.93 },
  { label: '広島', latitudeDeg: 34.4, longitudeDeg: 132.46 },
  { label: '山口', latitudeDeg: 34.19, longitudeDeg: 131.47 },
  { label: '徳島', latitudeDeg: 34.07, longitudeDeg: 134.56 },
  { label: '高松', latitudeDeg: 34.34, longitudeDeg: 134.05 },
  { label: '松山', latitudeDeg: 33.84, longitudeDeg: 132.77 },
  { label: '高知', latitudeDeg: 33.56, longitudeDeg: 133.53 },
  { label: '福岡', latitudeDeg: 33.59, longitudeDeg: 130.4 },
  { label: '佐賀', latitudeDeg: 33.25, longitudeDeg: 130.3 },
  { label: '長崎', latitudeDeg: 32.75, longitudeDeg: 129.87 },
  { label: '熊本', latitudeDeg: 32.79, longitudeDeg: 130.74 },
  { label: '大分', latitudeDeg: 33.24, longitudeDeg: 131.61 },
  { label: '宮崎', latitudeDeg: 31.91, longitudeDeg: 131.42 },
  { label: '鹿児島', latitudeDeg: 31.6, longitudeDeg: 130.56 },
  { label: '那覇', latitudeDeg: 26.21, longitudeDeg: 127.68 },
  { label: 'ソウル', latitudeDeg: 37.57, longitudeDeg: 126.98 },
  { label: '台北', latitudeDeg: 25.03, longitudeDeg: 121.57 },
  { label: '上海', latitudeDeg: 31.23, longitudeDeg: 121.47 },
  { label: 'ニューヨーク', latitudeDeg: 40.71, longitudeDeg: -74.01 },
  { label: 'ロサンゼルス', latitudeDeg: 34.05, longitudeDeg: -118.24 },
  { label: 'ロンドン', latitudeDeg: 51.51, longitudeDeg: -0.13 },
  { label: 'パリ', latitudeDeg: 48.86, longitudeDeg: 2.35 },
  { label: 'シドニー', latitudeDeg: -33.87, longitudeDeg: 151.21 },
];
