import type { Route } from "./+types/home";
import MapView from "~/map-view";
import { getStations, getStationGeometries } from "~/db/stations";
import { getCrimes } from "~/db/crimes";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Crime Stats SA" }];
}

export async function loader() {
  const [stations, crimes] = await Promise.all([getStations(), getCrimes()]);
  return {
    stations,
    crimes,
    geomPromise: getStationGeometries(),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <MapView {...loaderData} />;
}
