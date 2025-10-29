import { GeoFeature } from "../../types";
import { REGIONS } from "../../lib";
import { getExternalWikidataClaims } from "./getExternalWikidataClaims";
import { WikidataClaim } from "./WikiData.type";

const extractRegions = async (P361?: WikidataClaim[]) => {
  const regionsClaims = P361 ? await getExternalWikidataClaims(P361) : [];

  const regions = regionsClaims
    .map((claim) => claim.vi ?? claim.en)
    .filter((info) =>
      REGIONS.map((r) => r.toLowerCase()).includes(info.toLowerCase())
    );

  return regions;
};

export const getRegions = async (P361?: WikidataClaim[]) => {
  let regions: GeoFeature["properties"]["REGIONS"];

  try {
    regions = await extractRegions(P361);
  } catch {
    regions = [];
  }

  return regions;
};
