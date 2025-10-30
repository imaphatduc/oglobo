import { datasets } from "./datasets";

export const getDataClientSide = async (key: string) => {
  const dataset = datasets.find((d) => d.desc_vi === key);

  if (!dataset) {
    return undefined;
  }

  const url = `/api/dataset?code=${dataset.code}`;

  const res = await fetch(url);

  const { data } = await res.json();

  return { dataset, data };
};
