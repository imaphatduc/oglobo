export type GeoFeature = {
  type: "Feature";
  properties: {
    WIKIDATAID: string;
    NAME: string;
    NAME_VI: string;
    FORMAL_EN: string;
    SOVEREIGNT: string;
    TYPE: string;
    FLAG?: string;
    CONTINENTS: string[];
    REGIONS: string[];
    AREA?: number;
    POPULATION?: {
      value: number;
      year: number;
    };
    CAPITALS: string[];
    OFFICIAL_LANGUAGES: string[];
    NEIGHBORS: Set<number>;
    COLOR: string;
  };
  bbox: [number, number, number, number];
  geometry:
    | {
        type: "Polygon";
        coordinates: [number, number][][];
      }
    | {
        type: "MultiPolygon";
        coordinates: [number, number][][][];
      };
};
