import { DatasetKey, WBEducationExpenditure } from "../types";
import { datasets } from "./datasets";

export const getData = async (datasetKey: DatasetKey | "") => {
  if (!datasetKey) {
    return [];
  }

  const dataset = datasets[datasetKey];

  const url = `/api/dataset?indicator=${dataset.code}`;

  const res = await fetch(url);

  const data = await res.json();

  return data as WBEducationExpenditure[];
};
