import axios from "axios";
import { DatasetKey } from "../types";
import { WBEducationExpenditure } from "../types/WBEducationExpenditure.type";
import { datasets } from "./datasets";

export const getData = async (datasetKey: DatasetKey | "") => {
  if (!datasetKey) {
    return [];
  }

  const dataset = datasets[datasetKey];

  const url = `/api/dataset?indicator=${dataset.code}`;

  const res = await axios.get(url);

  const data = res.data;

  return data as WBEducationExpenditure[];
};
