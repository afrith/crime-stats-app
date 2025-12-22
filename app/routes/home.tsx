import type { Route } from "./+types/home";
import MapView from "~/mapView";
import type { FeatureCollection } from "geojson";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crime Stats SA" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

async function fetchStations(): Promise<FeatureCollection> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/stations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }
  return (await response.json()) as FeatureCollection;
}

export async function clientLoader() {
  return { stationsPromise: fetchStations() };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { stationsPromise } = loaderData;
  return <MapView stationsPromise={stationsPromise} />;
}
