import { V3 } from "../types";

export const toGlobeCoords = (
  lon: number,
  lat: number,
  scaleFactor: number
) => {
  const phi = (lat * Math.PI) / 180;
  const theta = (-lon * Math.PI) / 180;
  const axialTilt = (23.5 * Math.PI) / 180;

  const x = scaleFactor * Math.cos(phi) * Math.cos(theta);
  const y = scaleFactor * Math.sin(phi);
  const z = scaleFactor * Math.cos(phi) * Math.sin(theta);

  const yTilted = y * Math.cos(axialTilt) - z * Math.sin(axialTilt);
  const zTilted = y * Math.sin(axialTilt) + z * Math.cos(axialTilt);

  return [x, yTilted, zTilted] as V3;
};
