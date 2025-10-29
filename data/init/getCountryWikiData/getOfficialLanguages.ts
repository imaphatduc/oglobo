import { GeoFeature } from "../../types";
import { getExternalWikidataClaims } from "./getExternalWikidataClaims";
import { WikidataClaim } from "./WikiData.type";

const extractOfficialLanguages = async (P37?: WikidataClaim[]) => {
  const officialLanguagesClaims = P37
    ? await getExternalWikidataClaims(P37)
    : [];

  const officialLanguages = officialLanguagesClaims
    .filter((claim) => claim.rank === "preferred" || claim.rank === "normal")
    .map((info) =>
      info.vi
        ? !info.vi.toLowerCase().startsWith("tiếng")
          ? `tiếng ${info.vi}`
          : info.vi
        : `tiếng ${info.en}`
    );

  return officialLanguages;
};

export const getOfficialLanguages = async (P37?: WikidataClaim[]) => {
  let officialLanguages: GeoFeature["properties"]["OFFICIAL_LANGUAGES"];

  try {
    officialLanguages = await extractOfficialLanguages(P37);
  } catch {
    officialLanguages = [];
  }

  return officialLanguages;
};
