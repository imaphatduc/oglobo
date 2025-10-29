import { ContinentsSelect } from "./ContinentsSelect";
import { DatasetSelect } from "./DatasetSelect";
import { ShowCountryNamesToggle } from "./ShowCountryNamesToggle";

export const Control = () => {
  return (
    <div className="grid grid-cols-[2fr_3fr] items-center gap-5 p-3 rounded-md justify-between text-xs">
      <ShowCountryNamesToggle />
      <ContinentsSelect />
      <DatasetSelect />
    </div>
  );
};
