import { GeoFeature } from "@/app/types";
import { uniformCoords } from "./uniformCoords";
import { area, centroid } from "@turf/turf";
import { toGlobeCoords } from "./toGlobeCoords";

export const getCountryGeoData = (country: GeoFeature, scaleFactor: number) => {
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
  const centerPoint = toGlobeCoords(lonCenter, latCenter, scaleFactor);
  return { centerPoint, countryArea };
};
