import type { Route } from "./+types/home";
import MapView from "~/map-view";
import { getStations, getStationGeometries } from "~/db/stations";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Crime Stats SA" }];
}

export async function loader() {
  return {
    stations: await getStations(),
    geomPromise: getStationGeometries(),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { stations, geomPromise } = loaderData;
  return <MapView stations={stations} geomPromise={geomPromise} />;
}
