import { ContinentsSelect } from "./ContinentsSelect";
import { DatasetSelect } from "./DatasetSelect";
import { ShowCountryNamesToggle } from "./ShowCountryNamesToggle";

export const Control = () => {
  return (
    <div className="grid grid-cols-[auto_2fr] items-center gap-5 p-3 justify-between text-xs">
      <ShowCountryNamesToggle />
      <ContinentsSelect />
      <DatasetSelect />
    </div>
  );
};
