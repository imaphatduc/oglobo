import { readFileSync, writeFileSync } from "fs";
import { getCountriesColors, getCountryWikiData } from "../features/3d/utils";
import { GeoData } from "../types/GeoData.type";

export const initGeoData = async () => {
  const file = readFileSync("./geodata/ne_50m_admin_0_countries.json", "utf8");
  const data = JSON.parse(file) as GeoData;

  const countriesWikiData = await Promise.all(
    data.features.map((feature) =>
      getCountryWikiData(feature.properties.WIKIDATAID)
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
    features: data.features.map((feature, i) => {
      const wikiData = countriesWikiData[i];
      const neighbors = adjacencyMap.get(i)!;
      const color = countriesColors[i];

      return {
        type: "Feature",
        properties: {
          WIKIDATAID: feature.properties.WIKIDATAID,
          NAME: feature.properties.NAME,
          NAME_VI: feature.properties.NAME_VI,
          FORMAL_EN: feature.properties.FORMAL_EN,
          SOVEREIGNT: feature.properties.SOVEREIGNT,
          TYPE: feature.properties.TYPE,
          FLAG: wikiData.flag,
          CONTINENT: wikiData.continent,
          REGIONS: wikiData.regions,
          AREA: wikiData.area,
          POPULATION: wikiData.population,
          CAPITALS: wikiData.capitals,
          OFFICIAL_LANGUAGES: wikiData.officialLanguages,
          NEIGHBORS: neighbors,
          COLOR: color,
        },
        bbox: feature.bbox,
        geometry: feature.geometry,
      };
    }),
  };

  writeFileSync(
    "./geodata/50m_countries.json",
    JSON.stringify(fetchedData),
    "utf-8"
  );
};
