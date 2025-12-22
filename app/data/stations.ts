import type { MultiPolygon, Feature, FeatureCollection } from "geojson";

export interface Station {
  id: number;
  code: string;
  name: string;
  dc_code: string;
  muni_code: string;
  prov_code: string;
  population: number;
}

export type StationCollection = FeatureCollection<MultiPolygon, Station>;

export async function fetchStations(): Promise<Station[]> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/stations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }
  return (await response.json()) as Station[];
}

export async function fetchStationGeometries(): Promise<StationCollection> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/stations/geometries`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }
  return (await response.json()) as StationCollection;
}
