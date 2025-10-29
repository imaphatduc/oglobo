import { GeoFeature } from "../../types";
import { WikidataClaim } from "./WikiData.type";

const extractPopulation = (P1082: WikidataClaim[]) => {
  const preferredPopulationClaim = P1082.find(
    (info: any) => info.rank === "preferred"
  );

  const populationClaim =
    preferredPopulationClaim ??
    P1082.find((info: any) => info.rank === "normal") ??
    P1082[0];

  const populationValue = parseInt(
    populationClaim.mainsnak.datavalue?.value.amount.slice(1)
  );

  const year = parseInt(
    populationClaim.qualifiers?.P585[0].datavalue?.value.time.slice(1, 5)
  );

  return {
    value: populationValue,
    year,
  };
};

export const getPopulation = (P1082: WikidataClaim[]) => {
  let population: GeoFeature["properties"]["POPULATION"];

  try {
    population = P1082 && extractPopulation(P1082);
  } catch {
    population = undefined;
  }

  return population;
};
