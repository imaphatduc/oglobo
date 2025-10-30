import { useApp } from "@/app/contexts";
import { DropdownSelect } from "@/app/utils";
import { datasets } from "~/dataset";

export const DatasetSelect = () => {
  const { datasetKey, setDatasetKey } = useApp();

  return (
    <DropdownSelect
      label="Hiện dữ liệu"
      value={datasetKey}
      onChange={(e) => setDatasetKey(e.target.value as any)}
      options={datasets.map((d) => d.desc_vi)}
    />
  );
};
