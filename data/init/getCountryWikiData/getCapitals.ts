import { GeoFeature } from "../../types";
import { getExternalWikidataClaims } from "./getExternalWikidataClaims";
import { WikidataClaim } from "./WikiData.type";

const extractCapitals = async (P36?: WikidataClaim[]) => {
  const capitalsClaims = P36 ? await getExternalWikidataClaims(P36) : [];

  const preferredCapitalsClaims = capitalsClaims.filter(
    (claim) => claim.rank === "preferred"
  );

  const capitals = (
    preferredCapitalsClaims.length > 0
      ? preferredCapitalsClaims
      : capitalsClaims
  ).map((claim) => claim.vi ?? claim.en);

  return capitals;
};

export const getCapitals = async (P36?: WikidataClaim[]) => {
  let capitals: GeoFeature["properties"]["CAPITALS"];

  try {
    capitals = await extractCapitals(P36);
  } catch {
    capitals = [];
  }

  return capitals;
};
