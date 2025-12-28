import type { Route } from "./+types/home";
import MapView from "~/map-view";
import { getStationGeometries } from "~/db/stations";
import { getCrimes } from "~/db/crimes";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Crime Stats SA" }];
}

export async function loader() {
  return {
    crimes: await getCrimes(),
    geomPromise: getStationGeometries(),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <MapView {...loaderData} />;
}
