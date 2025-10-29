import { readFileSync } from "fs";
import { GeoData } from "@/data";
import { initGeoData } from "@/data/init";
import { App } from "./components";
import { AppProvider } from "./contexts";

export default async function Home() {
  // await initGeoData();

  const file = readFileSync("./geodata/50m_countries.json", "utf8");

  const { features } = JSON.parse(file) as GeoData;

  return (
    <main>
      <AppProvider countries={features} globeRadius={2.5}>
        <App />
      </AppProvider>
    </main>
  );
}
