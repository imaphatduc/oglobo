import { Color } from "three";

/**
 * Returns true if the color is closer to white than black.
 */
export const isColorLight = (color: Color): boolean => {
  // Use sRGB luminance formula (human eye–weighted)
  const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;

  return luminance > 0.5;
};
