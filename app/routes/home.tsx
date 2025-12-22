import type { Route } from "./+types/home";
import MapView from "~/mapView";
import { fetchStations, fetchStationGeometries } from "~/data/stations";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crime Stats SA" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  return {
    stations: await fetchStations(),
    geomPromise: Promise.resolve(undefined),
  };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  return {
    ...serverData,
    geomPromise: fetchStationGeometries(),
  };
}

// force the client loader to run during hydration
clientLoader.hydrate = true as const;

export default function Home({ loaderData }: Route.ComponentProps) {
  const { stations, geomPromise } = loaderData;
  return <MapView stations={stations} geomPromise={geomPromise} />;
}
