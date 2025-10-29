import { readFileSync, writeFileSync } from "fs";
import { getCountryWikiData } from "./getCountryWikiData";
import { getCountriesColors } from "./getCountriesColors";
import { GeoData } from "../types";

export const initGeoData = async () => {
  const file = readFileSync("./geodata/ne_50m_admin_0_countries.json", "utf8");

  const data: GeoData = JSON.parse(file);

  const countriesWikiData = await Promise.all(
    data.features.map((country) =>
      getCountryWikiData(country.properties.WIKIDATAID)
    )
  );

  const { adjacencyMap, countriesColors } = await getCountriesColors(
    data.features
  );

  const fetchedData: GeoData = {
    type: "FeatureCollection",
    name: "50m_countries",
    crs: data.crs,
    updatedAt: new Intl.DateTimeFormat("vi-VN").format(Date.now()),
    features: data.features.map((country, i) => {
      const wikiData = countriesWikiData[i];
      const neighbors = adjacencyMap.get(i)!;
      const color = countriesColors[i];

      return {
        type: "Feature",
        properties: {
          WIKIDATAID: country.properties.WIKIDATAID,
          NAME: country.properties.NAME,
          NAME_VI: country.properties.NAME_VI,
          FORMAL_EN: country.properties.FORMAL_EN,
          SOVEREIGNT: country.properties.SOVEREIGNT,
          TYPE: country.properties.TYPE,
          FLAG: wikiData.flag,
          CONTINENTS: wikiData.continents,
          REGIONS: wikiData.regions,
          AREA: wikiData.area,
          POPULATION: wikiData.population,
          CAPITALS: wikiData.capitals,
          OFFICIAL_LANGUAGES: wikiData.officialLanguages,
          NEIGHBORS: neighbors,
          COLOR: color,
        },
        bbox: country.bbox,
        geometry: country.geometry,
      };
    }),
  };

  writeFileSync(
    "./geodata/50m_countries.json",
    JSON.stringify(fetchedData),
    "utf-8"
  );
};
