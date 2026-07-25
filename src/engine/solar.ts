/**
 * Low-precision Sun position (Meeus ch. 25). Accuracy ~0.01deg in ecliptic
 * longitude, which is more than enough to place solar-term boundaries and
 * the zodiac sun-sign to the correct day.
 */
import { julianCenturiesFromJD, normalizeDegrees, toRadians } from './julian';

/** Apparent geocentric ecliptic longitude of the Sun, in degrees [0, 360). */
export function sunEclipticLongitude(jd: number): number {
  const T = julianCenturiesFromJD(jd);

  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = toRadians(M);

  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  const trueLongitude = L0 + C;

  const omega = 125.04 - 1934.136 * T;
  const apparentLongitude =
    trueLongitude - 0.00569 - 0.00478 * Math.sin(toRadians(omega));

  return normalizeDegrees(apparentLongitude);
}
