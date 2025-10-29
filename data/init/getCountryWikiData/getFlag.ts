import { GeoFeature } from "../../types";
import { WikidataClaim } from "./WikiData.type";

type Flag = GeoFeature["properties"]["FLAG"];

export const extractFlag = (P41: WikidataClaim[]): Flag => {
  const preferredFlagClaim = P41.find(
    (flagClaim) => flagClaim.rank === "preferred"
  );

  const flagClaim =
    preferredFlagClaim ?? P41.find((flag) => flag.rank === "normal") ?? P41[0];

  const flag = flagClaim.mainsnak.datavalue?.value;

  return flag;
};

export const getFlag = (P41: WikidataClaim[]): Flag => {
  let flag: Flag;

  try {
    flag = P41 && extractFlag(P41);
  } catch {
    flag = undefined;
  }

  return flag;
};
