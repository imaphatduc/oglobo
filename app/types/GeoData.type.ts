import { GeoFeature } from "./GeoFeature.type";

export type GeoData = {
  type: "FeatureCollection";
  name: string;
  crs: {
    type: "name";
    properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" };
  };
  updatedAt: string;
  features: GeoFeature[];
};
