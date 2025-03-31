import { Vector3 } from "three";

export const toGeoCoords = (point: Vector3) => {
  const axialTilt = (23.5 * Math.PI) / 180;

  const yOriginal =
    point.y * Math.cos(axialTilt) + point.z * Math.sin(axialTilt);
  const zOriginal =
    -point.y * Math.sin(axialTilt) + point.z * Math.cos(axialTilt);

  const radius = Math.sqrt(point.x ** 2 + yOriginal ** 2 + zOriginal ** 2);
  const lon = Math.atan2(-zOriginal, point.x) * (180 / Math.PI);
  const lat = Math.asin(yOriginal / radius) * (180 / Math.PI);

  return [lon, lat];
};
