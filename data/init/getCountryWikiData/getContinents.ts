import { GeoFeature } from "../../types";
import { CONTINENTS } from "../../lib";
import { getExternalWikidataClaims } from "./getExternalWikidataClaims";
import { WikidataClaim } from "./WikiData.type";

type Continent = GeoFeature["properties"]["CONTINENTS"][0];

const extractContinents = async (P30?: WikidataClaim[]) => {
  const continentsClaims = P30 ? await getExternalWikidataClaims(P30) : [];

  const continents: Continent[] = [];

  for (const claim of continentsClaims) {
    if (claim.vi) {
      if (claim.vi.includes("Mỹ")) {
        continents.push("Châu Mỹ");
      }

      if (claim.en.toLowerCase() === "insular oceania") {
        continents.push("Châu Đại Dương");
      }

      const continent = Object.keys(CONTINENTS).find(
        (c) => c.toLowerCase() === claim.vi?.toLowerCase()
      );

      if (continent) {
        continents.push(continent);
      }
    }
  }

  return continents;
};

export const getContinents = async (P30?: WikidataClaim[]) => {
  let continents: Continent[];

  try {
    continents = await extractContinents(P30);
  } catch {
    continents = [];
  }

  return continents;
};
