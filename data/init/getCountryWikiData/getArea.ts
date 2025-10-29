import { GeoFeature } from "../../types";
import { WikidataClaim } from "./WikiData.type";

type Area = GeoFeature["properties"]["AREA"];

const extractArea = (P2046: WikidataClaim[]): Area => {
  const areaClaim = P2046[0];

  const area = parseInt(areaClaim.mainsnak.datavalue?.value.amount.slice(1));

  return area;
};

export const getArea = (P2046?: WikidataClaim[]): Area => {
  let area: GeoFeature["properties"]["AREA"];

  try {
    area = P2046 && extractArea(P2046);
  } catch {
    area = undefined;
  }

  return area;
};
