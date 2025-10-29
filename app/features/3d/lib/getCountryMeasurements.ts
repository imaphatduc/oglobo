import { area, centroid } from "@turf/turf";
import { uniformCoords } from "@/app/lib";
import { GeoFeature } from "@/data";
import { toGlobeCoords } from "./math";

export const getCountryMeasurements = (
  country: GeoFeature,
  globeRadius: number
) => {
  const uniformedCountry = uniformCoords(country);

  let countryArea = 0;

  const firstLandGeoData = {
    type: "Polygon" as const,
    coordinates: uniformedCountry[0],
  };

  const largestLandGeoData = uniformedCountry.reduce((acc, land) => {
    const landGeoData = { type: "Polygon" as const, coordinates: land };
    const landArea = area(landGeoData);
    countryArea += landArea;
    return landArea > area(acc) ? landGeoData : acc;
  }, firstLandGeoData);

  const [lonCenter, latCenter] =
    centroid(largestLandGeoData).geometry.coordinates;

  const centerPoint = toGlobeCoords(lonCenter, latCenter, globeRadius);

  return { centerPoint, area: countryArea };
};
