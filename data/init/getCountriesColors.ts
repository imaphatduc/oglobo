import RBush from "rbush";
import { area, bbox, booleanIntersects, polygon } from "@turf/turf";
import { BBox } from "geojson";
import { uniformCoords } from "@/app/lib";
import { GeoFeature } from "../types";

export const getCountriesColors = async (countries: GeoFeature[]) => {
  const rtree = new RBush();
  const adjacencyMap = new Map<number, Set<number>>();
  const boundingBoxes: Record<number, BBox> = {};

  // Build R-tree for spatial lookup
  countries.forEach((country, i) => {
    const bb = bbox(country);
    boundingBoxes[i] = bb;
    rtree.insert({
      minX: bb[0],
      minY: bb[1],
      maxX: bb[2],
      maxY: bb[3],
      index: i,
    });
    adjacencyMap.set(i, new Set()); // Initialize adjacency map
  });

  const setCountryNeighbors = (i: number) => {
    const bb = boundingBoxes[i];

    const poly1 = uniformCoords(countries[i]);

    const mainland1 = polygon(
      poly1.sort((a, b) => area(polygon(b)) - area(polygon(a)))[0]
    );

    const possibleNeighbors = rtree.search({
      minX: bb[0],
      minY: bb[1],
      maxX: bb[2],
      maxY: bb[3],
    }) as (BBox & { index: number })[];

    possibleNeighbors.forEach(({ index }) => {
      if (index !== i && !adjacencyMap.get(i)!.has(index)) {
        const poly2 = uniformCoords(countries[index]);

        if (
          poly2.some((coords) => booleanIntersects(mainland1, polygon(coords)))
        ) {
          adjacencyMap.get(i)!.add(index);
          adjacencyMap.get(index)!.add(i);
        }
      }
    });
  };

  return await Promise.all(
    countries.map(
      (_, i) =>
        new Promise((resolve) => {
          setTimeout(() => {
            setCountryNeighbors(i);
            resolve(true);
          }, 0);
        })
    )
  ).then(() => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFD700", "#fe8eac"];

    const countriesColors: Record<number, string> = {};

    for (let i = 0; i < countries.length; i++) {
      const usedColors = new Set<string>();

      adjacencyMap.get(i)!.forEach((neighbor) => {
        if (countriesColors[neighbor])
          usedColors.add(countriesColors[neighbor]);
      });

      countriesColors[i] =
        colors.find((color) => !usedColors.has(color)) || "#000000";
    }

    return { adjacencyMap, countriesColors };
  });
};
