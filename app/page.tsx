import { readFileSync } from "fs";
import { GeoData } from "./types/GeoData.type";
import App from "./components/App";
import { initGeoData } from "./utils/initGeoData";
import { UIProvider } from "./features/ui";

export default async function Home() {
  // await initGeoData();

  const file = readFileSync("./geodata/50m_countries.json", "utf8");

  const { features } = JSON.parse(file) as GeoData;
  console.log(features[227]);

  return (
    <main>
      <UIProvider countries={features} scaleFactor={2.5}>
        <App />
      </UIProvider>
    </main>
  );
}
