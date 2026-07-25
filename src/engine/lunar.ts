/**
 * Low-precision Moon position (Meeus ch. 47, largest periodic terms only).
 * Typical accuracy is a few tenths of a degree in ecliptic longitude - fine
 * for placing a moon sign, though right at a sign boundary (every ~2.2
 * days) it can occasionally be off by a few hours.
 */
import { julianCenturiesFromJD, normalizeDegrees, toRadians } from './julian';

export function moonEclipticLongitude(jd: number): number {
  const T = julianCenturiesFromJD(jd);

  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T;

  const d = toRadians(D);
  const m = toRadians(M);
  const mp = toRadians(Mp);
  const f = toRadians(F);

  const terms = [
    6.288774 * Math.sin(mp),
    1.274027 * Math.sin(2 * d - mp),
    0.658314 * Math.sin(2 * d),
    0.213618 * Math.sin(2 * mp),
    -0.185116 * Math.sin(m),
    -0.114332 * Math.sin(2 * f),
    0.058793 * Math.sin(2 * d - 2 * mp),
    0.057066 * Math.sin(2 * d - m - mp),
    0.053322 * Math.sin(2 * d + mp),
    0.045758 * Math.sin(2 * d - m),
    -0.04092 * Math.sin(m - mp),
    -0.03472 * Math.sin(d),
    -0.030383 * Math.sin(m + mp),
  ];

  const sumL = terms.reduce((a, b) => a + b, 0);

  return normalizeDegrees(Lp + sumL);
}
