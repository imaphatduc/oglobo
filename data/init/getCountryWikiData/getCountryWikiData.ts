import { getFlag } from "./getFlag";
import { getArea } from "./getArea";
import { getPopulation } from "./getPopulation";
import { getContinents } from "./getContinents";
import { getRegions } from "./getRegions";
import { getCapitals } from "./getCapitals";
import { getOfficialLanguages } from "./getOfficialLanguages";

export const getCountryWikiData = async (id: string) => {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "User-agent": "O Globo",
    },
  });

  const { entities } = await res.json();

  const { claims } = entities[id];

  const wikiData = {
    flag: getFlag(claims.P41),
    area: getArea(claims.P2046),
    population: getPopulation(claims.P1082),
    continents: await getContinents(claims.P30),
    regions: await getRegions(claims.P361),
    capitals: await getCapitals(claims.P36),
    officialLanguages: await getOfficialLanguages(claims.P37),
  };

  return wikiData;
};
