import { Vector3 } from "three";

export const toGlobeCoords = (
  lon: number,
  lat: number,
  globeRadius: number
) => {
  const phi = (lat * Math.PI) / 180;
  const theta = (-lon * Math.PI) / 180;
  const axialTilt = (23.5 * Math.PI) / 180;

  const x = globeRadius * Math.cos(phi) * Math.cos(theta);
  const y = globeRadius * Math.sin(phi);
  const z = globeRadius * Math.cos(phi) * Math.sin(theta);

  const yTilted = y * Math.cos(axialTilt) - z * Math.sin(axialTilt);
  const zTilted = y * Math.sin(axialTilt) + z * Math.cos(axialTilt);

  return new Vector3(x, yTilted, zTilted);
};
