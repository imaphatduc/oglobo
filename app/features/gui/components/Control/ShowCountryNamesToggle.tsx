import { useApp } from "@/app/contexts";
import ToggleButton from "./ToggleButton";

export const ShowCountryNamesToggle = () => {
  const { showCountryNames, toggleCountryNames } = useApp();

  return (
    <>
      <p>Hiện tên quốc gia</p>
      <ToggleButton checked={showCountryNames} onChange={toggleCountryNames} />
    </>
  );
};
