import { GeoFeature } from "../../types";
import { WikidataClaim } from "./WikiData.type";

type Area = GeoFeature["properties"]["AREA"];

const extractArea = (P2046: WikidataClaim[]): Area => {
  const areaClaim = P2046[0];

  const area = parseInt(areaClaim.mainsnak.datavalue?.value.amount.slice(1));

  return area;
};

export const getArea = (P2046: WikidataClaim[]): Area => {
  let area = extractArea(P2046);

  try {
    area = P2046 && getArea(P2046);
  } catch {
    area = undefined;
  }

  return area;
};
