import ToggleButton from "../../3d/components/ToggleButton";
import { useUI } from "../contexts/UIContext";

const ShowCountryNamesToggle = () => {
  const { showCountryNames, toggleCountryNames } = useUI();

  return (
    <>
      <p>Hiện tên quốc gia</p>
      <ToggleButton checked={showCountryNames} onChange={toggleCountryNames} />
    </>
  );
};

export default ShowCountryNamesToggle;
