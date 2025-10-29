import { DatasetKey, WBEducationExpenditure } from "../types";
import { datasets } from "./datasets";

export const getData = async (datasetKey: DatasetKey | "") => {
  if (!datasetKey) {
    return undefined;
  }

  const dataset = datasets[datasetKey];

  const url = `/api/dataset?indicator=${dataset.code}`;

  const res = await fetch(url);

  const data = await res.json();

  return { data, unit: dataset.unit } as {
    data: WBEducationExpenditure[];
    unit: string;
  };
};
