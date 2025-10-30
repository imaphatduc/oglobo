import { Color } from "three";

export function getCountriesColorsFromData(
  values: number[],
  baseColor = "#97a87a"
): Color[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  console.log(max - min);

  function normalize(value: number, min: number, max: number): number {
    if (min === max) return 0;
    return (value - min) / (max - min);
  }

  const colors = values.map((v) => {
    if (v === 0) {
      return new Color(0xdad7cd);
    }

    const norm = normalize(v, min, max);
    /**
     * gamma controls the steepness:
        - gamma = 1 → linear (default)
        - gamma < 1 → makes midtones brighter
        - gamma > 1 → makes midtones darker, more contrast
     */
    const gamma = 5 * ((max - min) / 500 + 1);
    const factor = Math.pow(1 - norm, gamma);
    const colorNorm = new Color(baseColor).multiplyScalar(factor);
    return colorNorm;
  });

  return colors;
}
