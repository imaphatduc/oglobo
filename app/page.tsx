import { readFileSync } from "fs";
import { GeoData } from "./types/GeoData.type";
import { Screen3D } from "./features/3d";
import { initGeoData } from "./utils/initGeoData";

export default async function Home() {
  // await initGeoData();

  const file = readFileSync("./geodata/50m_countries.json", "utf8");

  const { features } = JSON.parse(file) as GeoData;

  return (
    <main>
      <Screen3D features={features} />
    </main>
  );
}
