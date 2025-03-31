import { GeoFeature } from "@/app/types";

export const uniformCoords = (country: GeoFeature) => {
  const lands =
    country.geometry.type === "Polygon"
      ? [country.geometry.coordinates]
      : country.geometry.coordinates;

  return lands;
};
