import { WikidataClaim } from "./WikiData.type";

type ExternalWikidataClaim = {
  vi?: string;
  en: string;
  rank: WikidataClaim["rank"];
};

export const getExternalWikidataClaims = async (P: WikidataClaim[]) => {
  const ids: string[] = P.map((info) => info.mainsnak.datavalue?.value.id);

  const url = (id: string) =>
    `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;

  const externalClaims: ExternalWikidataClaim[] = [];

  await Promise.all(
    ids.map(async (id, i) => {
      const res = await fetch(url(id));

      const { entities } = await res.json();

      const {
        labels: { vi, en },
      } = entities[id];

      externalClaims.push({
        vi: vi?.value,
        en: en.value,
        rank: P[i].rank,
      });
    })
  );

  return externalClaims;
};
