import { GeoFeature } from "@/app/types";
import { MessageCircle, Ruler, Star, Users } from "lucide-react";
import ToggleButton from "./ToggleButton";
import { useUI } from "../../contexts/UIContext";

interface Props {
  selectedCountry: GeoFeature;
}

const Board = ({ selectedCountry }: Props) => {
  const {
    properties: { FLAG, CAPITALS, OFFICIAL_LANGUAGES, POPULATION, AREA },
  } = selectedCountry;

  const { showCountryNames, toggleCountryNames } = useUI();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-5 justify-between text-sm">
        <p>Show country names</p>
        <ToggleButton
          checked={showCountryNames}
          onChange={toggleCountryNames}
        />
      </div>

      <div className="flex flex-col items-center space-y-5">
        {FLAG && (
          <img
            src={`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
              FLAG
            )}`}
            className="h-20"
          />
        )}
        <h1 className="text-center uppercase font-bold text-2xl">
          {selectedCountry.properties.NAME_VI}
        </h1>
      </div>
      <div className="grid grid-cols-[1.5rem,1fr] gap-x-3 gap-y-5 items-center">
        <div className="text-xl self-start">
          <Star />
        </div>
        <div className="space-y-2">
          {CAPITALS.map((capital, i) => (
            <p key={i}>{capital}</p>
          ))}
        </div>
        <div className="text-xl self-start">
          <MessageCircle />
        </div>
        <div className="space-y-2">
          {OFFICIAL_LANGUAGES.map((language, i) => (
            <p key={i}>{language[0].toUpperCase() + language.slice(1)}</p>
          ))}
        </div>
        <div className="text-sm">
          <Users />
        </div>
        <div>
          {POPULATION && (
            <p>
              {new Intl.NumberFormat().format(POPULATION.value) +
                ` người (${POPULATION.year})`}
            </p>
          )}
        </div>
        <div className="text-xl">
          <Ruler />
        </div>
        <div>
          {AREA && <p>{new Intl.NumberFormat().format(AREA) + " km²"}</p>}
        </div>
      </div>
    </div>
  );
};

export default Board;
