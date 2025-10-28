import { GeoFeature } from "@/app/types";
import { CONTINENTS, REGIONS } from "@/app/utils/constants";

const getFlag = (P41: any[]) => {
  const preferredFlag = P41.find((flag: any) => flag.rank === "preferred");
  const flag = preferredFlag ?? P41.find((flag: any) => flag.rank === "normal");
  return (flag ?? P41[0]).mainsnak.datavalue.value as string;
};

const getArea = (P2046: any[]) => {
  const area = parseInt(P2046[0].mainsnak.datavalue.value.amount.slice(1));
  return area;
};

const getPopulation = (P1082: any[]) => {
  const preferredPop = P1082.find((info: any) => info.rank === "preferred");
  const pop =
    preferredPop ??
    P1082.find((info: any) => info.rank === "normal") ??
    P1082[0];
  const popValue = parseInt(pop.mainsnak.datavalue.value.amount.slice(1));
  const year = parseInt(
    pop.qualifiers.P585[0].datavalue.value.time.slice(1, 5)
  );
  return {
    value: popValue,
    year,
  };
};

const getExternals = async (P: any[]) => {
  const ids: string[] = P.map((info) => info.mainsnak.datavalue.value.id);

  const url = (id: string) =>
    `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;

  const externals: {
    vi?: string;
    en: string;
    rank: "normal" | "preferred";
  }[] = [];
  await Promise.all(
    ids.map(async (id, i) => {
      const res = await fetch(url(id));
      const { entities } = await res.json();
      const {
        labels: { vi, en },
      } = entities[id];
      externals.push({
        vi: vi?.value,
        en: en.value,
        rank: P[i].rank,
      });
    })
  );

  return externals;
};

export const getCountryWikiData = async (id: string) => {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;

  let flag: GeoFeature["properties"]["FLAG"];
  let continents: GeoFeature["properties"]["CONTINENTS"];
  let regions: GeoFeature["properties"]["REGIONS"];
  let area: GeoFeature["properties"]["AREA"];
  let capitals: GeoFeature["properties"]["CAPITALS"];
  let officialLanguages: GeoFeature["properties"]["OFFICIAL_LANGUAGES"];
  let population: GeoFeature["properties"]["POPULATION"];

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "User-agent": "O Globo",
    },
  });
  const { entities } = await res.json();
  const { claims } = entities[id];

  try {
    flag = claims.P41 && getFlag(claims.P41);
  } catch {
    flag = undefined;
  }

  try {
    const rawContinents = claims.P30 && (await getExternals(claims.P30));
    continents =
      rawContinents &&
      rawContinents
        .filter(
          (info: any) =>
            (info.vi &&
              Object.keys(CONTINENTS)
                .map((c) => c.toLowerCase())
                .includes(info.vi.toLowerCase())) ||
            info.vi.includes("Mỹ") ||
            info.en.toLowerCase() === "insular oceania"
        )
        .map((info: any) =>
          info.vi.includes("Mỹ")
            ? "Châu Mỹ"
            : info.en.toLowerCase() === "insular oceania"
            ? "Châu Đại Dương"
            : info.vi
        );
  } catch {
    continents = [];
  }

  try {
    const rawRegions = claims.P361 ? await getExternals(claims.P361) : [];
    regions = rawRegions
      .map((info) => info.vi ?? info.en)
      .filter((info) =>
        REGIONS.map((r) => r.toLowerCase()).includes(info.toLowerCase())
      );
  } catch {
    regions = [];
  }

  try {
    const rawCapitals = claims.P36 ? await getExternals(claims.P36) : [];
    const preferredRawCapitals = rawCapitals.filter(
      (info) => info.rank === "preferred"
    );
    capitals = (
      preferredRawCapitals.length > 0 ? preferredRawCapitals : rawCapitals
    ).map((info) => info.vi ?? info.en);
  } catch {
    capitals = [];
  }

  try {
    const rawOfficialLanguages = claims.P37
      ? await getExternals(claims.P37)
      : [];
    officialLanguages = [
      ...rawOfficialLanguages.filter((info) => info.rank === "preferred"),
      ...rawOfficialLanguages.filter((info) => info.rank === "normal"),
    ].map((info) =>
      info.vi
        ? !info.vi.toLowerCase().startsWith("tiếng")
          ? `tiếng ${info.vi}`
          : info.vi
        : `tiếng ${info.en}`
    );
  } catch {
    officialLanguages = [];
  }

  try {
    area = claims.P2046 && getArea(claims.P2046);
  } catch {
    area = undefined;
  }

  try {
    population = claims.P1082 && getPopulation(claims.P1082);
  } catch {
    population = undefined;
  }

  const wikiData = {
    flag,
    continents,
    regions,
    area,
    population,
    capitals,
    officialLanguages,
  };

  return wikiData;
};
