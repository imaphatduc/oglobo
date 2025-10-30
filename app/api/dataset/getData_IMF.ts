import { readFileSync } from "fs";
import { IMF_CPI, IMF_CPI_SECTOR } from "~/dataset";

type RAW = {
  COUNTRY: string;
  "COUNTRY.ID": string;
  COICOP_1999: IMF_CPI_SECTOR;
  FREQUENCY: "Annual";
} & {
  [year: string]: string | number;
};

export const getData_IMF = (code: string, year: string): IMF_CPI[] => {
  const file = readFileSync(`./datasets/${code}.json`, "utf8");

  const data = JSON.parse(file);

  return data.map((d: RAW) => ({
    countryId: d["COUNTRY.ID"],
    sector: d["COICOP_1999"],
    year,
    value: typeof d[year] === "string" ? 0 : d[year],
  }));
};
