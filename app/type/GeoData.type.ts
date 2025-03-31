import { GeoFeature } from "../types";

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
